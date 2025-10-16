import React, { useState } from "react";

const NoteEditor = ({ note = {}, onSave, onCancel }) => {
  const [page, setPage] = useState(note.pageNumber || "");
  const [content, setContent] = useState(note.content || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!page || !content.trim()) return alert("Page and content required");
    onSave({ page, content });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-3 bg-white shadow-sm mb-4"
    >
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Page Number
        </label>
        <input
          type="number"
          min="1"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="w-full border rounded-md p-2 mt-1 text-sm"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Note
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-md p-2 mt-1 text-sm h-20 resize-none"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {note._id ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
