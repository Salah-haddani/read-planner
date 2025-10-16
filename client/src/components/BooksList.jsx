import React, { useState, useEffect } from "react";
import axios from "axios";
import TagsSelector from "./TagsSelector";
import SuggestedBooks from "./SuggestedBooks";
import { useAuth } from "../context/AuthContext";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState(() => {
    return JSON.parse(localStorage.getItem("userTags")) || [];
  });
  const { token } = useAuth();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched books:", res.data);
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    if (token) fetchBooks();
  }, [token]);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="mt-8">
        <TagsSelector tags={tags} setTags={setTags} />
        {tags.length > 0 && <SuggestedBooks tags={tags} />}
      </div>
    </div>
  );
};

export default BooksList;
