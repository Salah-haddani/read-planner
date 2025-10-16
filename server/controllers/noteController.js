const Note = require("../models/Note");
const Book = require("../models/Book");

// @desc    Create a new note for a specific book
// @route   POST /api/books/:bookId/notes
// @access  Private

exports.createNote = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;
  const { pageNumber, content } = req.body;

  if (!pageNumber || !content) {
    return res
      .status(400)
      .json({ msg: "Please provide both pageNumber and content." });
  }

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      console.log("Book not found, returning 404");
      return res.status(404).json({ msg: "Book not found." });
    }

    const pageNum = parseInt(pageNumber);

    if (pageNum < 1 || pageNum > book.totalPages) {
      console.log("Page number validation failed");
      return res.status(400).json({
        msg: `Page number must be between 1 and ${book.totalPages}.`,
      });
    }

    const note = new Note({
      user: userId,
      book: bookId,
      pageNumber: pageNum,
      content,
    });

    await note.save();

    return res.status(201).json(note);
  } catch (err) {
    console.error("Error stack:", err.stack);
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// @desc    Get all notes for a specific book
// @route   GET /api/books/:bookId/notes
// @access  Private
exports.getNotesForBook = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  try {
    const notes = await Note.find({ user: userId, book: bookId }).sort({
      pageNumber: 1,
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
exports.getNoteById = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Note not found." });
    }

    if (note.user.toString() !== userId) {
      return res.status(401).json({ msg: "Not authorized to view this note." });
    }

    res.json(note);
  } catch (err) {
    console.error("Error fetching note:", err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a note by ID
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ msg: "Content cannot be empty." });
  }

  try {
    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Note not found." });
    }

    if (note.user.toString() !== userId) {
      return res
        .status(401)
        .json({ msg: "Not authorized to update this note." });
    }

    note.content = content;
    note.updatedAt = Date.now();

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Error updating note:", err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a note by ID
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ msg: "Note not found." });
    }

    if (note.user.toString() !== userId) {
      return res
        .status(401)
        .json({ msg: "Not authorized to delete this note." });
    }

    await note.deleteOne();
    res.json({ msg: "Note removed." });
  } catch (err) {
    console.error("Error deleting note:", err.message);
    res.status(500).send("Server Error");
  }
};
