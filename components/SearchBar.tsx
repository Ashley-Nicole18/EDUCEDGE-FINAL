"use client";

import { useState } from "react";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-md px-4 py-2 bg-white rounded shadow">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 text-sm text-gray-700 focus:outline-none"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
