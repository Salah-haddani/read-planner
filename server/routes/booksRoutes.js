const express = require("express");
const Book = require("../models/Book");
const { uploadBook } = require("../controllers/bookController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadPDF } = require("../middlewares/fileUploadMiddleware");
const router = express.Router();

router.get("/list", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: err.message });
  }
});

router.route("/upload").post(protect, uploadPDF, uploadBook);
module.exports = router;
