"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost, getRecentPosts } from "@/content/blogs/blogs";

interface RecentPostsSidebarProps {
  excludeSlug?: string;
}

export default function RecentPostsSidebar({ excludeSlug }: RecentPostsSidebarProps) {
  const recentPosts = getRecentPosts(5).filter((post) => post.slug !== excludeSlug).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sticky top-24 h-fit"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h3>

      <div className="space-y-4">
        {recentPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:opacity-75 transition-opacity"
          >
            <Link href={`/blog/${post.slug}`}>
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link href="/blog">
        <button className="w-full mt-6 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group">
          View All Posts
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </Link>
    </motion.div>
  );
}
