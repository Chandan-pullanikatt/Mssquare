"use client";

import { useState, useEffect, use } from "react";
import { Save, ArrowLeft, Image as ImageIcon, FileText, Globe, SearchCode, Eye, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogsApi } from "@/lib/api/blogs";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    content: "",
    image: "",
    published: false,
    seo_title: "",
    seo_description: "",
    tags: ""
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await blogsApi.getBlogById(id);
        setBlogData({
          title: blog.title || "",
          slug: blog.slug || "",
          content: blog.content || "",
          image: blog.image || "",
          published: blog.published || false,
          seo_title: blog.title || "",
          seo_description: "",
          tags: ""
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

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
    setSaving(true);
    try {
      await blogsApi.updateBlog(id, {
        title: blogData.title,
        slug: blogData.slug,
        content: blogData.content,
        image: blogData.image || null,
        published: blogData.published
      });
      alert("Blog post updated successfully!");
      router.push("/admin/blog");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">Loading Blog Post...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 font-heading">Edit Blog Post</h1>
            <p className="text-gray-500 font-medium text-sm">Update your thoughts and share with the world.</p>
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
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Update Post
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
                placeholder="Image URL"
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-bold text-gray-500 outline-none"
              />
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
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all resize-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
