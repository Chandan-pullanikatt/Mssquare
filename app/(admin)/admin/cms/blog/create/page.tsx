"use client";

import { useState } from "react";
import { Save, ArrowLeft, Image as ImageIcon, FileText, Globe, SearchCode, Eye, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogsApi } from "@/lib/api/blogs";

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "Technology",
    author: "MSSquare Team",
    read_time: 5,
    date: new Date().toISOString().split('T')[0],
    published: false,
    seo_title: "",
    seo_description: "",
    tags: ""
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlogData({
      ...blogData,
      title,
      slug: generateSlug(title),
      seo_title: title
    });
  };

  const handleSave = async () => {
    if (!blogData.title || !blogData.slug) {
      alert("Please enter a title and slug.");
      return;
    }
    setLoading(true);
    try {
      await blogsApi.createBlog({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        image: blogData.image || null,
        category: blogData.category,
        author: blogData.author,
        date: blogData.date,
        read_time: blogData.read_time,
        published: blogData.published
      });
      router.push("/admin/cms/blog");
    } catch (err) {
      console.error(err);
      alert("Failed to create blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/cms/blog" className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 font-heading">New Blog Post</h1>
            <p className="text-gray-500 font-medium text-sm">Share knowledge and updates with your community.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Publish Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Post Title</label>
                <input 
                  type="text" 
                  value={blogData.title}
                  onChange={handleTitleChange}
                  placeholder="The Future of AI in Modern Software..."
                  className="w-full text-4xl font-extrabold bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-200 text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-[#8b5cf6] bg-purple-50 w-fit px-4 py-2 rounded-xl">
                <Globe size={14} />
                <span>mssquare.com/blog/{blogData.slug}</span>
              </div>

              <div className="space-y-4 pt-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Excerpt</label>
                <textarea 
                  value={blogData.excerpt}
                  onChange={(e) => setBlogData({...blogData, excerpt: e.target.value})}
                  rows={3}
                  placeholder="A brief summary for the blog card..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Content</label>
                <textarea 
                  value={blogData.content}
                  onChange={(e) => setBlogData({...blogData, content: e.target.value})}
                  rows={20}
                  placeholder="Start writing your story..."
                  className="w-full bg-gray-50 border-none rounded-[2rem] p-8 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all font-medium text-lg leading-relaxed text-gray-700"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          {/* Publishing Controls */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Eye size={20} className="text-blue-500" />
              Visibility
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setBlogData({...blogData, published: !blogData.published})}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                  blogData.published 
                  ? "bg-green-50 border-green-500 text-green-700 shadow-[0_4px_15px_rgba(34,197,94,0.1)]" 
                  : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200"
                }`}
              >
                {blogData.published ? "Live on Website" : "Save as Draft"}
              </button>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                Drafts are only visible to admins
              </p>
            </div>
          </section>

          {/* Featured Image */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-orange-500" />
              Featured Image
            </h3>
            <div className="space-y-4">
              <div className="aspect-video rounded-3xl bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 group cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative">
                {blogData.image ? (
                  <>
                    <img src={blogData.image} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.preventDefault(); setBlogData({...blogData, image: ""}) }}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-gray-300 group-hover:text-[#8b5cf6] transition-all mb-2" />
                    <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-all">Upload Image</span>
                  </>
                )}
              </div>
              <input 
                type="text" 
                value={blogData.image}
                onChange={(e) => setBlogData({...blogData, image: e.target.value})}
                placeholder="Image URL (temporary)"
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-bold text-gray-500 outline-none"
              />
            </div>
          </section>

          {/* Blog Metadata */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-purple-500" />
              Metadata
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={blogData.category}
                  onChange={(e) => setBlogData({...blogData, category: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all appearance-none"
                >
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Business">Business</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Author Name</label>
                <input 
                  type="text" 
                  value={blogData.author}
                  onChange={(e) => setBlogData({...blogData, author: e.target.value})}
                  placeholder="MSSquare Team"
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Read Time (min)</label>
                  <input 
                    type="number" 
                    value={blogData.read_time}
                    onChange={(e) => setBlogData({...blogData, read_time: parseInt(e.target.value) || 0})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date" 
                    value={blogData.date}
                    onChange={(e) => setBlogData({...blogData, date: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEO Controls */}
          <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SearchCode size={20} className="text-[#8b5cf6]" />
              SEO Optimization
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Meta Description</label>
                <textarea 
                  value={blogData.seo_description}
                  onChange={(e) => setBlogData({...blogData, seo_description: e.target.value})}
                  rows={4}
                  placeholder="Enter a compelling summary for search results..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={blogData.tags}
                  onChange={(e) => setBlogData({...blogData, tags: e.target.value})}
                  placeholder="React, AI, Technology"
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

