import React, { useState, useEffect } from "react";
import { Plus, NotebookText } from "lucide-react";
import {
  getNotesForBook,
  createNote,
  updateNote,
  deleteNote,
} from "../api/notesApi";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import NoteDetail from "./NoteDetail";

const NotesPanel = ({ bookId, token, currentPage, onSelectNote }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const data = await getNotesForBook(bookId, token);
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    if (bookId && token) fetchNotes();
  }, [bookId, token]);

  const handleCreate = async (noteData) => {
    try {
      const payload = {
        pageNumber: noteData.page || currentPage,
        content: noteData.content,
      };
      await createNote(bookId, payload, token);
      fetchNotes();
      setEditingNote(null);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  const handleUpdate = async (noteId, noteData) => {
    try {
      await updateNote(noteId, noteData, token);
      fetchNotes();
      setEditingNote(null);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(noteId, token);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="w-96 p-6 bg-gray-100 border-l border-gray-200 sticky top-0 h-screen overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center">
            <NotebookText className="w-6 h-6 mr-2" /> Session Notes
          </h2>
          <button
            onClick={() => setEditingNote({ pageNumber: currentPage })}
            className="flex items-center text-sm font-medium px-3 py-1 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </button>
        </div>

        {editingNote && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-inner">
            <NoteEditor
              note={editingNote}
              onCancel={() => setEditingNote(null)}
              onSave={(noteData) => {
                editingNote._id
                  ? handleUpdate(editingNote._id, noteData)
                  : handleCreate(noteData);
              }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4">
          <NotesList
            notes={notes}
            onView={(note) => setSelectedNote(note)}
            onEdit={(note) => setEditingNote(note)}
            onDelete={handleDelete}
            onSelectPage={onSelectNote}
          />
        </div>

        {selectedNote && (
          <NoteDetail
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
