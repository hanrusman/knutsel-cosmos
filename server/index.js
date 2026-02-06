const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// API Routes

// GET all questions
app.get('/api/questions', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM questions ORDER BY created_at DESC');
        const rows = stmt.all();

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

// DELETE a question
app.delete('/api/questions/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({ error: 'Failed to delete question' });
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
