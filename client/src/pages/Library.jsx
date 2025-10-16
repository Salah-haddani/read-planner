import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import BookUploadForm from "../features/Books/BookUploadForm";
import BookCard from "../features/Books/BookCard";
import { useAuth } from "../context/AuthContext";
import { LibraryBig, Upload } from "lucide-react";
import DailyRoutineCard from "../components/DailyRoutineCard";

const API_URL = "http://localhost:5000/api/sessions/";

const Library = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();
  const [stats, setStats] = useState({ totalBooks: 0, totalPagesRead: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(API_URL + "stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [token]);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL + "current");
      setSessions(response.data);
    } catch (err) {
      setError("Failed to fetch library.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchSessions();
      fetchStats();
    }
  }, [fetchSessions, fetchStats, token]);

  const handleUploadSuccess = () => {
    fetchSessions();
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
              <LibraryBig className="w-7 h-7 mr-3 text-indigo-600" />
              Active Reading Sessions
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Book
            </button>
          </div>

          {loading ? (
            <div className="text-center text-lg text-gray-500">
              Loading your sessions...
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-xl border border-gray-200">
              <p className="text-xl text-gray-600">
                You have no active reading sessions. Upload a book to start!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <BookCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center">
              🏆 Your Achievement
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Books in Library:</span>
                <span className="font-semibold text-indigo-600 pr-8">
                  {stats.totalBooks}
                </span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Total Pages Read:</span>
                <span className="font-semibold text-indigo-600 pr-8">
                  {stats.totalPagesRead}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500 italic">
              Keep going — every page counts!
            </p>
          </div>

          <DailyRoutineCard />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload New Book (PDF)"
      >
        <BookUploadForm onUploadSuccess={handleUploadSuccess} />
      </Modal>
    </div>
  );
};

export default Library;
