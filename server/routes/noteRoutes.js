const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  createNote,
  getNotesForBook,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

router.route("/:bookId/notes").get(protect, getNotesForBook); // GET /api/books/:bookId/notes
router.route("/:bookId/notes").post(protect, createNote); // POST /api/books/:bookId/notes

router.route("/notes/:id").get(protect, getNoteById); // GET /api/books/notes/:id
router.route("/notes/:id").put(protect, updateNote); // PUT /api/books/notes/:id
router.route("/notes/:id").delete(protect, deleteNote); // DELETE /api/books/notes/:id

module.exports = router;
