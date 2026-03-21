"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { websiteApi } from "@/lib/api/website";

export default function BecomeInstructorEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    hero: {
      title: "Become An Instructor",
      subtitle: "Share your expertise and help shape the next generation of developers. Join our elite circle of mentors and instructors.",
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await websiteApi.getSection("become_instructor_content");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch become-instructor content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteApi.updateSection("become_instructor_content", content);
      alert("Become Instructor page updated successfully!");
    } catch (err) {
      console.error("Failed to update become-instructor content", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center pt-20">Loading editor...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/cms/content" className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit Become Instructor</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <Users size={14} className="text-emerald-500" />
              Manage instructor page branding
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="max-w-2xl space-y-8">
          {/* Hero Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Heading Title</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subtitle</label>
                <textarea
                  rows={4}
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </section>
      </div>
    </div>
  );
}
