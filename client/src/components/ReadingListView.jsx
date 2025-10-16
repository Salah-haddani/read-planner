import React, { useState, useEffect } from "react";
import { getCurrentSessions } from "../api/sessionsApi";
import { useNavigate } from "react-router-dom";

const ReadingListView = ({ userToken }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getCurrentSessions(userToken);
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch reading sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [userToken]);

  if (loading) return <p>Loading your reading list...</p>;

  return (
    <div className="reading-list">
      <h2>My Active Books</h2>
      {sessions.length === 0 ? (
        <p>You have no active reading sessions. Add a book to get started!</p>
      ) : (
        sessions.map((session) => (
          <div
            key={session._id}
            className="session-card"
            onClick={() => navigate(`/read/${session._id}`)}
          >
            <h3>{session.book.title}</h3>
            <p>Author: {session.book.author}</p>
            <p>
              Progress: Page {session.currentPage} / {session.book.totalPages}
            </p>
            <p>
              Target: {session.targetPagesPerDay} pages/day (Due:{" "}
              {new Date(session.dueDate).toLocaleDateString()})
            </p>
            <button>Continue Reading</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReadingListView;
