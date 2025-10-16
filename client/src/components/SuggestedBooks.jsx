import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { RefreshCw } from "lucide-react";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SuggestedBooks = ({ tags }) => {
  const [suggestions, setSuggestions] = useState(() => {
    return JSON.parse(localStorage.getItem("dailySuggestions")) || null;
  });
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const lastFetch = localStorage.getItem("suggestionDate");
    const today = new Date().toISOString().split("T")[0];

    if (!suggestions || lastFetch !== today) {
      generateSuggestions();
    }
  }, [tags]);

  const generateSuggestions = async () => {
    setLoading(true);
    setExpandedCard(null);
    try {
      const prompt = `
      Suggest 3 interesting books related to these categories: ${tags.join(
        ", "
      )}.
      For each book, provide:
      - Title
      - Author
      - Number of pages (approx.)
      - A medium paragraph summary (about what the book talks about).
      Output in JSON format: [{title, author, pages, summary}]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      console.log("Gemini response:", response.data);
      const text = response.text;
      const jsonText = text.match(/\[.*\]/s)[0];
      const parsed = JSON.parse(jsonText);

      setSuggestions(parsed);
      localStorage.setItem("dailySuggestions", JSON.stringify(parsed));
      localStorage.setItem(
        "suggestionDate",
        new Date().toISOString().split("T")[0]
      );
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-8">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
        <p className="text-gray-500 ml-3">Generating AI suggestions...</p>
      </div>
    );
  }

  if (!suggestions) {
    return <p className="text-gray-500 mt-4">No suggestions yet.</p>;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          📚 AI-Recommended Books
        </h2>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((book, i) => {
          const isExpanded = expandedCard === i;

          return (
            <div
              key={i}
              className="relative p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <h3 className="font-bold text-lg text-indigo-700 mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                <p className="text-xs text-gray-500 mb-3">{book.pages} pages</p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {book.summary}
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-3">
                  <button
                    onClick={() => toggleCard(i)}
                    className="text-xs text-indigo-600 font-medium focus:outline-none"
                  >
                    {isExpanded ? "Click to collapse" : "Click to read more"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedBooks;
