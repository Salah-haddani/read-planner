const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
