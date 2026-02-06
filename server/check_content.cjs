const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Connect to DB (adjust path relative to where script is run)
// If run from root, DB is at server/game.db
const dbPath = path.join(__dirname, 'game.db');
const db = new Database(dbPath, { verbose: console.log });

console.log('Connected to database at:', dbPath);

// Check tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);

// Fetch questions
try {
    const questions = db.prepare('SELECT * FROM questions').all();
    console.log(`Found ${questions.length} questions.`);

    const missingImages = [];

    questions.forEach(q => {
        let answers = [];
        try {
            answers = JSON.parse(q.answers);
        } catch (e) {
            console.error(`Failed to parse answers for Q ${q.id}:`, e);
        }

        answers.forEach(a => {
            // Check if image is missing or is a placeholder text
            // Assuming "missing" means empty string or null or doesn't start with /assets
            if (!a.image || a.image.trim() === '') {
                missingImages.push({
                    questionId: q.id,
                    answerText: a.text,
                    isCorrect: a.isCorrect
                });
            }
        });
    });

    console.log('Missing Images Count:', missingImages.length);
    console.log('Missing Images Details:', JSON.stringify(missingImages, null, 2));

} catch (e) {
    console.error('Error fetching questions:', e);
}
