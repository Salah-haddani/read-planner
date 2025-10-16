const ReadingSession = require("../models/ReadingSession");
const Book = require("../models/Book");

// Helper function to calculate the due date
const calculateDueDate = (totalPages, startPage, pagesPerDay) => {
  // Calculate remaining pages
  const remainingPages = totalPages - startPage;

  // Calculate days required
  const daysRequired = Math.ceil(remainingPages / pagesPerDay);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysRequired);
  return dueDate;
};

// @desc    Start a new reading session for a book
// @route   POST /api/sessions
exports.startReadingSession = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { bookId, targetPagesPerDay } = req.body;

  if (!bookId || !targetPagesPerDay) {
    return res
      .status(400)
      .json({ msg: "Please provide bookId and targetPagesPerDay." });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Book not found." });
    }

    // Check if a session already exists for this book/user
    let session = await ReadingSession.findOne({ user: userId, book: bookId });
    if (session) {
      return res
        .status(400)
        .json({ msg: "A reading session for this book already exists." });
    }

    // Calculate the due date
    const dueDate = calculateDueDate(book.totalPages, 1, targetPagesPerDay);

    session = new ReadingSession({
      user: userId,
      book: bookId,
      targetPagesPerDay,
      dueDate,
      currentPage: 1,
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get the S3 URL for a specific page of a book
// @route   GET /api/sessions/page/:sessionId/:pageNumber
exports.getPageImage = async (req, res) => {
  const { sessionId, pageNumber } = req.params;
  const userId = req.user.id;

  try {
    const session = await ReadingSession.findById(sessionId).populate("book");

    if (!session) {
      return res.status(404).json({ msg: "Reading session not found." });
    }

    if (session.user.toString() !== userId) {
      return res
        .status(401)
        .json({ msg: "Not authorized to view this session." });
    }

    const book = session.book;
    const pageIndex = parseInt(pageNumber) - 1;

    if (pageIndex < 0 || pageIndex >= book.pageImageUrls.length) {
      return res
        .status(400)
        .json({ msg: "Invalid page number for this book." });
    }

    // The S3 URL is stored directly in the array
    const imageUrl = book.pageImageUrls[pageIndex];

    res.json({
      imageUrl,
      currentPage: parseInt(pageNumber),
      totalPages: book.totalPages,
      bookId: session.book,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update a reading session's progress (currentPage)
// @route   PUT /api/sessions/:id/update
// @access  Private
exports.updateProgress = async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.id;
  const { newPage } = req.body;

  if (!newPage || isNaN(parseInt(newPage))) {
    return res
      .status(400)
      .json({ msg: "Please provide a valid newPage number." });
  }

  try {
    let session = await ReadingSession.findById(sessionId).populate("book");

    if (!session) {
      return res.status(404).json({ msg: "Reading session not found." });
    }

    // Authorization check
    if (session.user.toString() !== userId) {
      return res
        .status(401)
        .json({ msg: "Not authorized to update this session." });
    }

    const newPageNum = parseInt(newPage);
    const totalPages = session.book.totalPages;

    //  Check if the new page is within the book limits
    if (newPageNum < 1 || newPageNum > totalPages) {
      return res
        .status(400)
        .json({ msg: `Page number must be between 1 and ${totalPages}.` });
    }

    // Update the current page
    session.currentPage = newPageNum;

    // Check for completion
    if (newPageNum === totalPages) {
      session.isCompleted = true;
    }

    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all active reading sessions for the user
// @route   GET /api/sessions/current
// @access  Private
exports.getCurrentSessions = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all sessions for the user that are NOT completed
    const sessions = await ReadingSession.find({
      user: userId,
      //isCompleted: false,
    })
      .populate({
        path: "book",
        select: "title author totalPages",
      })
      .sort({ startDate: -1 });

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get details of a specific reading session
// @route   GET /api/sessions/:sessionId
// @access  Private
exports.getSessionById = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.id;

  try {
    const session = await ReadingSession.findById(sessionId).populate("book");

    if (!session) {
      return res.status(404).json({ msg: "Reading session not found." });
    }

    // Authorization check
    if (session.user.toString() !== userId) {
      return res
        .status(401)
        .json({ msg: "Not authorized to access this session." });
    }

    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get user reading stats (total books, total pages read)
// @route   GET /api/sessions/stats
// @access  Private
exports.getReadingStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const sessions = await ReadingSession.find({ user: userId }).populate(
      "book"
    );

    const totalBooks = sessions.length;
    const totalPagesRead = sessions.reduce(
      (sum, s) => sum + (s.currentPage || 0),
      0
    );

    res.json({ totalBooks, totalPagesRead });
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    res.status(500).json({ msg: "Server Error while getting stats" });
  }
};
