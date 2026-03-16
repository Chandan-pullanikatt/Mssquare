"use client";

import { Plus, FileText, Trash2, Edit, Globe, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { blogsApi } from "@/lib/api/blogs";
import { Blog } from "@/types/database";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const data = await blogsApi.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await blogsApi.deleteBlog(id);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete blog post.");
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Blog Management</h1>
          <p className="text-gray-500 font-medium">Create and manage articles for your community.</p>
        </div>
        <Link href="/admin/blog/create">
          <button className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>New Post</span>
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={blog.image || "/assets/blog/matchdayblog.png"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${blog.published ? 'bg-green-500/80' : 'bg-amber-500/80'} text-white`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2">{blog.title}</h3>
                
                <div className="flex items-center gap-4 mb-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Link href={`/admin/blog/edit/${blog.id}`} className="flex-1">
                    <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-[#8b5cf6] hover:text-white transition-all flex items-center justify-center gap-2">
                       <Edit size={14} />
                       Edit Post
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(blog.id, blog.title)}
                    className="p-3 rounded-xl border border-gray-100 text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 font-medium mb-6">Start sharing your thoughts with the world.</p>
              <Link href="/admin/blog/create">
                <button className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20">
                  Create First Post
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
