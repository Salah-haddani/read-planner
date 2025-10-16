import React from "react";
import { X } from "lucide-react";

const NoteDetail = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-indigo-700 mb-2">
          Page {note.pageNumber}
        </h3>
        <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
        <p className="text-xs text-gray-400 mt-3">
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>
        {note.updatedAt && (
          <p className="text-xs text-gray-400">
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;
