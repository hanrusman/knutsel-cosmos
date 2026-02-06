const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists (for Docker volume mounting)
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sparky.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize Schema
const initDb = () => {
    // Check if table exists
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='questions'").get();

    if (!tableExists) {
        console.log('Creating questions table...');
        const createQuery = `
            CREATE TABLE questions (
                id TEXT PRIMARY KEY,
                text TEXT, -- legacy field support
                question TEXT NOT NULL,
                tags TEXT, -- Stored as JSON string
                answers TEXT, -- Stored as JSON string
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        db.exec(createQuery);

        // Insert a sample question to start
        const insert = db.prepare(`
            INSERT INTO questions (id, question, tags, answers) 
            VALUES (?, ?, ?, ?)
        `);

        insert.run(
            'sample-1',
            'Welke planeet is het grootst?',
            JSON.stringify(['level1', 'space']),
            JSON.stringify([
                { id: 'a', label: 'Aarde', isCorrect: false },
                { id: 'b', label: 'Jupiter', isCorrect: true },
                { id: 'c', label: 'Mars', isCorrect: false }
            ])
        );
    }

    // Check/Create attempts table (Stats)
    const attemptsExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='attempts'").get();
    if (!attemptsExists) {
        console.log('Creating attempts table...');
        db.prepare(`
            CREATE TABLE attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_id TEXT,
                is_correct BOOLEAN,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(question_id) REFERENCES questions(id)
            )
        `).run();
    }
};

initDb();

module.exports = db;
