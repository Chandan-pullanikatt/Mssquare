"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <PageButton page={1} currentPage={currentPage} onPageChange={onPageChange} />
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {visiblePages.map((page) => (
          <PageButton
            key={page}
            page={page}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <PageButton
              page={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </motion.button>
    </div>
  );
}

function PageButton({
  page,
  currentPage,
  onPageChange,
}: {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const isActive = page === currentPage;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onPageChange(page)}
      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {page}
    </motion.button>
  );
}
