"use client";

import { Container } from "@/components/ui/Container";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogFilter from "@/components/blog/BlogFilter";
import { BLOG_POSTS } from "@/content/blogs/blogs";
import { motion } from "framer-motion";

function BlogPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS;

    // Apply category filter
    if (selectedCategory) {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return posts;
  }, [selectedCategory, searchQuery]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-0">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20 pb-12 text-center"
        >
          <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-4">
            Our Blog
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-urbanist">
            Insights & Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Stay updated with the latest news, culture, and tech innovations from the heart of MSSquare Technologies.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pb-16 space-y-8"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto w-full">
            <BlogSearch onSearch={handleSearch} placeholder="Search articles, tags, authors..." />
          </div>

          {/* Category Filter */}
          <div className="flex justify-center">
            <BlogFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </motion.div>
      </Container>

      {/* Blog Grid */}
      <Container className="pb-20">
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No posts found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
