"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/content/blogs/blogs";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const categoryColors: { [key: string]: string } = {
  Entertainment: "bg-purple-500",
  News: "bg-blue-500",
  Culture: "bg-teal-500",
  Founder: "bg-amber-500",
  Tech: "bg-green-500",
  Community: "bg-emerald-500",
};

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryColor = categoryColors[post.category] || "bg-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full`}
    >
      {/* Blog Image */}
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? "h-64 md:h-80" : "h-48"}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className={`absolute top-4 left-4 ${categoryColor} text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-md z-10`}>
          {post.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 transition-colors line-clamp-2 group-hover:text-purple-600">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-gray-400" />
                <span className="font-medium">{post.author}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Read More Button */}
          <Link href={`/blog/${post.slug}`}>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors inline-flex items-center gap-1 group/btn mt-2">
              Read More
              <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
