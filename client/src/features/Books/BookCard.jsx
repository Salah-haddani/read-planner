import React from "react";
import { BookOpen, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const BookCard = ({ session }) => {
  const bookTitle = session.book.title;
  const bookAuthor = session.book.author;
  const totalPages = session.book.totalPages;
  const currentProgress = session.currentPage;
  const sessionId = session._id;

  const progressPercent = Math.round((currentProgress / totalPages) * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <BookOpen className="w-8 h-8 text-indigo-500" />
          {session.isCompleted ? (
            <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-green-600 bg-green-100">
              Completed
            </span>
          ) : (
            <span className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-indigo-600 bg-indigo-100">
              In Progress
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {bookTitle}
        </h3>
        <p className="text-sm text-gray-500">{bookAuthor}</p>{" "}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Progress
            </span>
            <span className="text-sm font-semibold text-indigo-600">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Page {currentProgress} of {totalPages}{" "}
          </p>
        </div>
        <Link
          to={`/read/${sessionId}`}
          className="mt-6 w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-150"
        >
          Continue Reading <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
