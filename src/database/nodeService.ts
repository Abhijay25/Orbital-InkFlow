// This file is created to:
// 1. Keep all database operations
// 2. Handle common database operations (CRUD)
// 3. Provide type safety with TypeScript

// Importing my database
import db from "./db";

// Declaring data types within our database
// Using snake casing for database, as it is more common in SQL naming
export interface Note {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

// This is a service object that contains all our database operations
// e.g. CRUD Operations
export const notesService = {
  // Create
  createNote(note: Note): Note {
    const stmt = db.prepare(`
            INSERT INTO notes (title, content)
            VALUES (@title, @content)
            RETURNING *
        `);

    return stmt.get(note) as Note;
  },

  // Get all notes ordered by most recent to least recent
  getAllNotes(): Note[] {
    const stmt = db.prepare("SELECT * FROM notes ORDER BY updated_at DESC");
    return stmt.all() as Note[];
  },

  // Get note by id
  getNoteById(id: number): Note | undefined {
    const stmt = db.prepare("SELECT * FROM notes WHERE id = ?");
    return stmt.get(id) as Note | undefined;
  },

  // Update a note
  updateNote(id: number, note: Partial<Note>): Note | undefined {
    const stmt = db.prepare(`
            UPDATE notes
            SET title = COALESCE(@title, title),
                content = COALESCE(@content, content)
                updated_at = CURRENT_TIMESTAMP
            WHERE id = @id
            RETURNING *
        `);

    return stmt.get({ ...note, id }) as Note | undefined;
  },

  // Delete a note
  deleteNote(id: number): boolean {
    const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  },
};
