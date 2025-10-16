const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Unknown",
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    pageImageUrls: [
      { type: String }, // Array of URLs for each converted page image
    ],
    currentProgress: {
      type: Number,
      default: 0, // Current page number the user is on
      min: 0,
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

module.exports = mongoose.model("Book", BookSchema);
