"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import { BlogPost } from "@/content/blogs/blogs";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filteredPosts = posts.filter((post) => post.slug !== currentSlug).slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-20 py-12 border-t border-gray-200"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Related Posts
      </h2>
      <p className="text-gray-600 text-lg mb-12">
        Read more stories and insights from our blog
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/blog">
          <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all group">
            View All Posts
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </motion.section>
  );
}
