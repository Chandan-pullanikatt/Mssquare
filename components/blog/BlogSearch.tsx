"use client";

import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function BlogSearch({ 
  onSearch, 
  placeholder = "Search articles, tags, authors..." 
}: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <motion.div
        animate={{ borderColor: isFocused ? "#9333ea" : "#e5e7eb" }}
        className={`relative bg-white border-2 rounded-xl transition-all duration-300 ${
          isFocused ? "shadow-lg shadow-purple-100" : "shadow-md"
        }`}
      >
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none font-medium text-base"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
