const Book = require("../models/Book");
const { convertPdfAndUpload } = require("../services/pdfConverterService");
const ReadingSession = require("../models/ReadingSession");
// @desc    Upload a new book (PDF) and save metadata
// @route   POST /api/books/upload
exports.uploadBook = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const userId = req.user.id;
    const { title, author, totalPages } = req.body;

    if (!title || !totalPages) {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      return res
        .status(400)
        .json({ msg: "Please include title and total pages." });
    }

    let book = new Book({
      owner: userId,
      title,
      author,
      totalPages: parseInt(totalPages),
    });

    const pageImageUrls = await convertPdfAndUpload(
      pdfPath,
      book._id.toString(),
      userId
    );

    book.pageImageUrls = pageImageUrls;
    await book.save();

    const defaultPagesPerDay = 10;

    const calculateDueDate = (totalPages, startPage, pagesPerDay) => {
      const remainingPages = totalPages - startPage;
      const daysRequired = Math.ceil(remainingPages / pagesPerDay);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysRequired);
      return dueDate;
    };

    const dueDate = calculateDueDate(book.totalPages, 1, defaultPagesPerDay);

    const session = new ReadingSession({
      user: userId,
      book: book._id,
      targetPagesPerDay: defaultPagesPerDay,
      dueDate: dueDate,
      currentPage: 1,
    });

    await session.save();

    res.status(201).json(book);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ msg: err.message || "Server Error during book upload." });
  }
};
