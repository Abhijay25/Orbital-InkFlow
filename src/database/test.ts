// This file is created to test our database functionalities

import { notesService, Note } from "./nodeService";

const testCreateNote = () => {
  const newNote: Note = {
    title: "my Little Pony",
    content: "this is a story about a pony",
  };

  const createdNote = notesService.createNote(newNote);
  console.log("Created Note:", createdNote);
  return createdNote;
};

const runTests = async () => {
  try {
    const createdNote = testCreateNote();
    console.log(createdNote);
  } catch (error) {
    console.error("Database test failed:", error);
  }
};

runTests();
