const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Tabela de cofrinhos
  db.run(`CREATE TABLE IF NOT EXISTS piggies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1, -- Por simplicidade, vamos usar um user_id fixo
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'piggy-bank',
    color TEXT DEFAULT '#4A6CF7',
    goal REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de transações
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    piggy_id INTEGER,
    amount REAL NOT NULL,
    description TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(piggy_id) REFERENCES piggies(id)
  )`);
});

module.exports = db;