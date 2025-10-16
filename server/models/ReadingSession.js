const mongoose = require("mongoose");

const readingSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
      min: 1,
    },
    targetPagesPerDay: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ReadingSession", readingSessionSchema);
