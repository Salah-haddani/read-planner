import axios from "axios";

const API_URL = "/api/sessions";

const config = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// 1. GET /api/sessions/current
export const getCurrentSessions = async (token) => {
  const response = await axios.get(`${API_URL}/current`, config(token));
  return response.data;
};

// 2. POST /api/sessions
export const startReadingSession = async (bookId, targetPagesPerDay, token) => {
  const response = await axios.post(
    API_URL,
    { bookId, targetPagesPerDay },
    config(token)
  );
  return response.data;
};

// 3. GET /api/sessions/page/:sessionId/:pageNumber
export const getPageImage = async (sessionId, pageNumber, token) => {
  const response = await axios.get(
    `${API_URL}/page/${sessionId}/${pageNumber}`,
    config(token)
  );
  return response.data;
};

// 4. PUT /api/sessions/:id/update
export const updateProgress = async (sessionId, newPage, token) => {
  const response = await axios.put(
    `${API_URL}/${sessionId}/update`,
    { newPage },
    config(token)
  );
  return response.data;
};
