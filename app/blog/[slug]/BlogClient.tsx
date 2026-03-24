"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react";
import ShareButtons from "@/components/blog/ShareButtons";
import RelatedPosts from "@/components/blog/RelatedPosts";
import RecentPostsSidebar from "@/components/blog/RecentPostsSidebar";
import { BlogPost } from "@/content/blogs/blogs";

interface BlogClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  formattedDate: string;
}

export default function BlogClient({ post, relatedPosts, formattedDate }: BlogClientProps) {
  return (
    <div className="bg-white min-h-screen">
      <Container className="py-12">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/blog">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </button>
          </Link>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-xl mb-8 h-96 md:h-[500px]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f70a504f4?w=1200&h=600&fit=crop";
                }}
              />
            </motion.div>

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
                {/* Category */}
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-blue-600" />
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={18} />
                  <span className="font-medium">{post.author}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>{formattedDate}</span>
                </div>

                {/* Read Time */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} />
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-gray-600 italic">{post.excerpt}</p>
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none text-gray-700 mb-12"
            >
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace("# ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h3 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                      {paragraph.replace("## ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-6 mb-2 text-gray-700">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.trim() === "") {
                  return null;
                }
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="py-6 border-t border-b border-gray-200 my-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-gray-900">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {["technology", "insights", post.category.toLowerCase()]
                    .filter((tag) => tag !== "")
                    .map((tag) => (
                      <Link key={tag} href={`/blog?category=${tag}`}>
                        <span className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-full transition-all cursor-pointer">
                          #{tag}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="py-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Comments</h2>
              <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Comments are coming soon. Stay tuned for community discussions!
                </p>
                <Link href="/contact">
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </motion.section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} currentSlug={post.slug} />
            )}
          </motion.article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RecentPostsSidebar excludeSlug={post.slug} />
          </div>
        </div>
      </Container>
    </div>
  );
}
