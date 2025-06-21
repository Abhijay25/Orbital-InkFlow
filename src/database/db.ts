import Database from "better-sqlite3";
import { Database as DatabaseType } from "better-sqlite3";
import path from "path";
import { app } from "electron";
import fs from "fs";

// This is where we store our database file
const userDataPath = app
  ? app.getPath("userData")
  : path.join(__dirname, "test-db");

// Used for testing purposes
// This code runs only if userDataPath does not exist and creates a parent directory
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// Creates a full path to database file, and naming it as 'inkflow.db'
const dbPath = path.join(userDataPath, "inkflow.db");

// Create a new database connection
const db = new Database(dbPath) as DatabaseType;

// Enable foreign key support
// Note: This ensures that relationships between tables are valid
// E.g. If a not references a category, that category must exist
db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        file_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

export default db;
