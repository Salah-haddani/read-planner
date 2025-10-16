const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  getPageImage,
  startReadingSession,
  updateProgress,
  getCurrentSessions,
  getSessionById,
  getReadingStats,
} = require("../controllers/sessionController");

router.route("/current").get(protect, getCurrentSessions); // GET /api/books
router.route("/stats").get(protect, getReadingStats);
router.route("/:id/update").put(protect, updateProgress); // GET /api/books
router.route("/:sessionId").get(protect, getSessionById);
router.route("/page/:sessionId/:pageNumber").get(protect, getPageImage); // GET /api/books
router.route("/").post(protect, startReadingSession); // POST /api/books/upload

module.exports = router;
