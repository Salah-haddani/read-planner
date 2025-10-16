import React from "react";
import { Trash2, Edit3, Eye } from "lucide-react";

const NotesList = ({ notes, onView, onEdit, onDelete, onSelectPage }) => {
  if (!notes.length)
    return (
      <p className="text-gray-500 text-sm text-center mt-10">
        No notes yet. Start writing one!
      </p>
    );

  return (
    <div className="flex flex-col space-y-2 overflow-y-auto">
      {notes.map((note) => (
        <div
          key={note._id}
          className="border rounded-lg p-3 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3
                className="font-semibold text-indigo-700 cursor-pointer"
                onClick={() => onSelectPage(note.pageNumber)}
              >
                Page {note.pageNumber}
              </h3>
              <p className="text-gray-700 text-sm line-clamp-2">
                {note.content}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onView(note)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onEdit(note)}
                className="text-green-500 hover:text-green-700"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(note._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
