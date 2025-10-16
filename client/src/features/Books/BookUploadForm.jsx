import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Upload, BookOpen } from "lucide-react";

const API_URL = "http://localhost:5000/api/books/";

const BookUploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    totalPages: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();
  const handleChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!file || !metadata.title || !metadata.totalPages) {
      setError("Please fill all fields and select a PDF file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("bookFile", file);
    formData.append("title", metadata.title);
    formData.append("author", metadata.author);
    formData.append("totalPages", metadata.totalPages);

    try {
      await axios.post(API_URL + "upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      setMetadata({ title: "", author: "", totalPages: "" });

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      const errMsg = err.response?.data?.msg || "Error uploading book.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0">
      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            PDF File
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
        </div>

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={metadata.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={metadata.author}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />

        <input
          type="number"
          name="totalPages"
          placeholder="Total Pages"
          value={metadata.totalPages}
          onChange={handleChange}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <BookOpen className="w-5 h-5 mr-2" /> Upload and Add to Library
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookUploadForm;
