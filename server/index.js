const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// API Routes

// GET all questions (with optional limit and tag filter)
app.get('/api/questions', (req, res) => {
    try {
        const { tag, limit } = req.query;
        let query = 'SELECT * FROM questions';
        const params = [];

        if (tag) {
            query += ' WHERE tags LIKE ?';
            params.push(`%${tag}%`);
        }

        // Randomize order
        query += ' ORDER BY RANDOM()';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const stmt = db.prepare(query);
        const rows = stmt.all(params);

        // Parse JSON fields back to objects
        const questions = rows.map(r => ({
            ...r,
            tags: JSON.parse(r.tags || '[]'),
            answers: JSON.parse(r.answers || '[]')
        }));

        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// POST to record an attempt (Stats)
app.post('/api/attempts', (req, res) => {
    try {
        const { question_id, is_correct } = req.body;
        const stmt = db.prepare('INSERT INTO attempts (question_id, is_correct) VALUES (?, ?)');
        const result = stmt.run(question_id, is_correct ? 1 : 0);
        res.json({ id: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET stats (for Admin)
app.get('/api/stats', (req, res) => {
    try {
        // Return success rate per question
        const stats = db.prepare(`
            SELECT 
                q.question, 
                COUNT(a.id) as total_attempts,
                SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) as correct_count
            FROM questions q
            LEFT JOIN attempts a ON q.id = a.question_id
            GROUP BY q.id
            HAVING total_attempts > 0
        `).all();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST bulk questions
app.post('/api/questions', (req, res) => {
    const questions = req.body;

    if (!Array.isArray(questions)) {
        return res.status(400).json({ error: 'Input must be an array' });
    }

    const insert = db.prepare(`
        INSERT INTO questions (id, question, tags, answers) 
        VALUES (?, ?, ?, ?)
    `);

    const insertMany = db.transaction((qs) => {
        for (const q of qs) {
            insert.run(
                q.id || `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                q.question,
                JSON.stringify(q.tags || []),
                JSON.stringify(q.answers || [])
            );
        }
    });

    try {
        insertMany(questions);
        res.json({ success: true, count: questions.length });
    } catch (err) {
        console.error('Error saving questions:', err);
        res.status(500).json({ error: 'Failed to save questions' });
    }
});

// DELETE ALL questions (Bulk Delete)
app.delete('/api/questions', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM questions');
        const info = stmt.run();
        // Also clear attempts as they reference questions
        db.prepare('DELETE FROM attempts').run();

        res.json({ success: true, changes: info.changes });
    } catch (err) {
        console.error('Error deleting all questions:', err);
        res.status(500).json({ error: 'Failed to delete all questions' });
    }
});

// DELETE a specific question
app.delete('/api/questions/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes > 0) {
            // Cleanup orphans in attempts? SQLite foreign key cascade might handle if enabled, 
            // but for safety/simplicity let's manually clean or rely on logic.
            // Actually, we should allow attempts to stay or clear them. 
            // Let's clear attempts for this question to keep data clean.
            db.prepare('DELETE FROM attempts WHERE question_id = ?').run(id);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// RESET APP DATA (Clear Stats/Attempts)
app.post('/api/reset', (req, res) => {
    try {
        db.prepare('DELETE FROM attempts').run();
        res.json({ success: true });
    } catch (err) {
        console.error('Error resetting app data:', err);
        res.status(500).json({ error: 'Failed to reset app data' });
    }
});

// UPDATE a question
app.put('/api/questions/:id', (req, res) => {
    const { id } = req.params;
    const { question, tags, answers } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE questions 
            SET question = ?, tags = ?, answers = ?
            WHERE id = ?
        `);

        const info = stmt.run(
            question,
            JSON.stringify(tags || []),
            JSON.stringify(answers || []),
            id
        );

        if (info.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (err) {
        console.error('Error updating question:', err);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// Health check
app.get('/health', (req, res) => res.send('Sparky Backend is OK!'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data directory: ${process.env.DATA_DIR || './server/data'}`);
});
