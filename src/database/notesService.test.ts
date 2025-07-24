import { notesService, Note } from "./notesService";
import { expect } from "chai";
import db from "./db";

describe("notesService database unit test", () => {
  let createdNote: Note;

  beforeEach(() => {
    // Clean up the notes table before each test
    db.prepare("DELETE FROM notes").run();
    // Create a note for each test
    createdNote = notesService.createNote({
      title: "Test note 1",
      content: "Test content 1",
    });
  });

  // Testing function createNote()
  it("Should create a note", () => {
    expect(createdNote).to.have.property("id");
    expect(createdNote.title).to.equal("Test note 1");
    expect(createdNote.content).to.equal("Test content 1");
  });

  // Testing function getNoteByID()
  it("Should get note by ID", () => {
    const note = notesService.getNoteById(createdNote.id!);
    expect(note?.title).to.equal("Test note 1");
    expect(note?.content).to.equal("Test content 1");
  });

  // Testing function updateNote()
  it("Should update a note", () => {
    const updatedNote = notesService.updateNote(createdNote.id!, {
      title: "Updated title",
      content: "Updated content",
    });
    expect(updatedNote?.content).to.equal("Updated content");
    expect(updatedNote?.title).to.equal("Updated title");
  });

  // Testing function getAllNotes()
  it("Should get all the notes", () => {
    const notes = notesService.getAllNotes();
    expect(notes).to.be.an("array");
    expect(notes.length).to.be.greaterThan(0);
  });

  // Testing function deleteNote()
  it("Should delete a note when given an ID", () => {
    const isDeleted = notesService.deleteNote(createdNote.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(isDeleted).to.be.true;
    const note = notesService.getNoteById(createdNote.id!);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(note).to.be.undefined;
  });
});
