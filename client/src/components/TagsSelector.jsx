import React, { useState } from "react";

const availableTags = [
  "Technology",
  "Science",
  "Fiction",
  "Self-Improvement",
  "History",
  "Business",
  "Psychology",
  "Health",
  "Philosophy",
  "Education",
];

const TagsSelector = ({ tags, setTags }) => {
  const handleSelect = (tag) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(newTags);
    localStorage.setItem("userTags", JSON.stringify(newTags));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">Choose Your Interests</h2>
      <div className="flex flex-wrap gap-3">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleSelect(tag)}
            className={`px-4 py-2 rounded-full border ${
              tags.includes(tag)
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagsSelector;
