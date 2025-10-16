import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";
import ProgressTracker from "../components/ProgressTracker";
import NotesPanel from "../components/NotesPanel";

const API_URL = "http://localhost:5000/api/sessions/";

const ReadingView = ({ userToken }) => {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookId, setBookId] = useState(null);
  const [pageData, setPageData] = useState({
    imageUrl: "",
    currentPage: 1,
    totalPages: 1,
  });

  const fetchPage = useCallback(
    async (pageNumber) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_URL}page/${sessionId}/${pageNumber}`
        );

        setPageData({
          imageUrl: response.data.imageUrl,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
        });

        if (response.data.bookId && !bookId) {
          const extractedId =
            typeof response.data.bookId === "string"
              ? response.data.bookId
              : response.data.bookId._id;

          setBookId(extractedId);
        }
      } catch (err) {
        console.error("Fetch Page Error:", err);
        setError("Failed to load page image.");
      } finally {
        setLoading(false);
      }
    },
    [sessionId, bookId]
  );
  useEffect(() => {
    const loadSessionAndPage = async () => {
      if (!userToken || !sessionId) return;

      try {
        const sessionRes = await axios.get(`${API_URL}${sessionId}`);
        const savedPage = sessionRes.data.currentPage || 1;

        fetchPage(savedPage);
      } catch (err) {
        console.error("Failed to load session info:", err);
        setError("Unable to load your reading progress.");
        setLoading(false);
      }
    };

    loadSessionAndPage();
  }, [sessionId, userToken, fetchPage]);

  const updatePageHandler = useCallback(
    async (newPageNumber) => {
      if (
        newPageNumber < 1 ||
        newPageNumber > pageData.totalPages ||
        newPageNumber === pageData.currentPage
      ) {
        return;
      }

      try {
        await axios.put(`${API_URL}${sessionId}/update`, {
          newPage: newPageNumber,
        });

        fetchPage(newPageNumber);
      } catch (err) {
        console.error("Update Progress Error:", err);
        setError("Failed to save progress or load next page.");
      }
    },
    [sessionId, pageData.totalPages, pageData.currentPage, fetchPage]
  );

  const handleNoteSelect = (pageNumber) => {
    updatePageHandler(pageNumber);
  };

  if (error) {
    return (
      <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg m-10">
        <p className="font-bold mb-2">Error Loading Reading Session</p>
        <p>{error}</p>
        <p className="mt-4 text-sm text-red-500">
          Check your session ID and S3 configuration.
        </p>
      </div>
    );
  }

  if (loading && pageData.imageUrl === "") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg text-gray-700">Loading book page...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
          Reading View (Page {pageData.currentPage} of {pageData.totalPages})
        </h1>

        <ProgressTracker
          current={pageData.currentPage}
          total={pageData.totalPages}
          className="mb-8"
        />

        <div className="flex items-center w-full max-w-5xl space-x-4">
          <button
            onClick={() => updatePageHandler(pageData.currentPage - 1)}
            disabled={pageData.currentPage <= 1 || loading}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 transition duration-150 flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-600" />
          </button>

          <div className="flex-grow flex justify-center items-center min-h-[70vh]">
            <div className="w-full h-full max-w-4xl mx-auto  overflow-hidden">
              {loading ? (
                <div className="w-full h-full min-h-[70vh] flex items-center justify-center bg-gray-100">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : (
                <img
                  src={pageData.imageUrl}
                  alt={`Book page ${pageData.currentPage}`}
                  className="w-full h-full object-contain max-h-[70vh]"
                  onLoad={() => setLoading(false)}
                  onError={() =>
                    setError("Image failed to load. Check URL/CORS.")
                  }
                />
              )}
            </div>
          </div>

          <button
            onClick={() => updatePageHandler(pageData.currentPage + 1)}
            disabled={pageData.currentPage >= pageData.totalPages || loading}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 transition duration-150 flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6 text-indigo-600" />
          </button>
        </div>
      </div>

      <NotesPanel
        bookId={bookId}
        token={userToken}
        currentPage={pageData.currentPage}
        onSelectNote={handleNoteSelect}
      />
    </div>
  );
};

export default ReadingView;
