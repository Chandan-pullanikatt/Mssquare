"use client";

import { motion } from "framer-motion";
import { getAllCategories } from "@/content/blogs/blogs";

interface BlogFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function BlogFilter({
  selectedCategory,
  onCategoryChange,
}: BlogFilterProps) {
  const categories = getAllCategories();
  const allCategories = ["All Stories", ...categories];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {allCategories.map((category, index) => {
        const categoryValue = category === "All Stories" ? null : category;
        const isActive = 
          (category === "All Stories" && selectedCategory === null) ||
          (category !== "All Stories" && category === selectedCategory);

        return (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(categoryValue)}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
              isActive
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}
