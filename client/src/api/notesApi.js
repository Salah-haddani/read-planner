import axios from "axios";

const API_URL = "/api/books";

const config = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Get all notes for a book
// GET /api/books/:bookId/notes
export const getNotesForBook = async (bookId, token) => {
  const response = await axios.get(`${API_URL}/${bookId}/notes`, config(token));
  return response.data;
};

//  Create a new note for a book
// POST /api/books/:bookId/notes
export const createNote = async (bookId, noteData, token) => {
  const response = await axios.post(
    `${API_URL}/${bookId}/notes`,
    noteData,
    config(token)
  );
  return response.data;
};

// Get a single note by ID
// GET /api/books/notes/:id
export const getNote = async (noteId, token) => {
  const response = await axios.get(`${API_URL}/notes/${noteId}`, config(token));
  return response.data;
};

//  Update a note
// PUT /api/books/notes/:id
export const updateNote = async (noteId, noteData, token) => {
  const response = await axios.put(
    `${API_URL}/notes/${noteId}`,
    noteData,
    config(token)
  );
  return response.data;
};

//  Delete a note
// DELETE /api/books/notes/:id
export const deleteNote = async (noteId, token) => {
  const response = await axios.delete(
    `${API_URL}/notes/${noteId}`,
    config(token)
  );
  return response.data;
};
