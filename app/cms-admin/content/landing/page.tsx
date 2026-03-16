"use client";

import { useState, useEffect } from "react";
import { Save, Layout, ArrowLeft, Image as ImageIcon, Plus, Trash2, Globe, TrendingUp, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";
import { websiteApi } from "@/lib/api/website";

export default function LandingPageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    hero: {
      badge: "Next cohort starts soon",
      title_line1: "Build. Learn. Launch.",
      title_line2: "With MSSquare.",
      subtitle: "We train developers and build real-world products for startups and businesses.",
      cta_primary: "Apply Now (Student)",
      cta_secondary: "Browse All Tracks",
      bg_video: "/assets/v1.webm",
    },
    stats: [
      { label: "Active Students", value: "1,200+" },
      { label: "Courses Offered", value: "45+" },
      { label: "Successful Placements", value: "95%" },
      { label: "Years of Excellence", value: "5+" },
    ],
    features: [
      { title: "Expert Mentorship", description: "Learn from industry professionals." },
      { title: "Real-world Projects", description: "Build products that matter." },
    ],
    testimonials: [
      { name: "Alex Johnson", content: "MSSquare changed my career path completely!", role: "Software Engineer" }
    ],
    partners: [
      { name: "Google", logo: "" },
      { name: "Microsoft", logo: "" }
    ],
    seo: {
      title: "MSSquare - Build. Learn. Launch.",
      description: "Premier platform for learning and building real-world software products.",
      keywords: "coding, software engineering, internship, placement, courses",
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing");
        if (data?.content_json) {
          // Merge with default content to ensure all keys exist
          const mergedContent = {
            ...content,
            ...data.content_json,
            hero: { ...content.hero, ...data.content_json.hero },
            seo: { ...content.seo, ...data.content_json.seo },
            stats: data.content_json.stats || content.stats,
            features: data.content_json.features || content.features,
            testimonials: data.content_json.testimonials || content.testimonials,
            partners: data.content_json.partners || content.partners,
          };
          setContent(mergedContent);
        }
      } catch (err) {
        console.error("Failed to fetch landing content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteApi.updateSection("landing", content);
      alert("Landing page updated successfully!");
    } catch (err) {
      console.error("Failed to update landing content", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading editor...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cms-admin/content" className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit Landing Page</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <Globe size={14} className="text-green-500" />
              Live changes to your home page
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layout size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Badge Text</label>
                <input
                  type="text"
                  value={content.hero.badge}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Heading Line 1</label>
                  <input
                    type="text"
                    value={content.hero.title_line1}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, title_line1: e.target.value } })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Heading Line 2 (Colored)</label>
                  <input
                    type="text"
                    value={content.hero.title_line2}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, title_line2: e.target.value } })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none text-[#8b5cf6]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subtitle</label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Primary CTA</label>
                  <input
                    type="text"
                    value={content.hero.cta_primary}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta_primary: e.target.value } })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Secondary CTA</label>
                  <input
                    type="text"
                    value={content.hero.cta_secondary}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta_secondary: e.target.value } })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Stats Section</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, stats: [...content.stats, { label: "New Stat", value: "0" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.stats.map((stat: any, index: number) => (
                <div key={index} className="p-4 rounded-2xl bg-gray-50 flex items-center gap-4 group">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...content.stats];
                        newStats[index].value = e.target.value;
                        setContent({ ...content, stats: newStats });
                      }}
                      className="w-full bg-transparent border-none p-0 text-lg font-bold text-gray-900 focus:ring-0"
                      placeholder="Value"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...content.stats];
                        newStats[index].label = e.target.value;
                        setContent({ ...content, stats: newStats });
                      }}
                      className="w-full bg-transparent border-none p-0 text-xs font-bold text-gray-400 uppercase tracking-widest focus:ring-0"
                      placeholder="Label"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newStats = content.stats.filter((_: any, i: number) => i !== index);
                      setContent({ ...content, stats: newStats });
                    }}
                    className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Features</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, features: [...content.features, { title: "New Feature", description: "" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {content.features.map((feature: any, index: number) => (
                <div key={index} className="p-6 rounded-2xl bg-gray-50 space-y-3 group">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...content.features];
                        newFeatures[index].title = e.target.value;
                        setContent({ ...content, features: newFeatures });
                      }}
                      className="bg-transparent border-none p-0 font-bold text-gray-900 focus:ring-0"
                      placeholder="Feature Title"
                    />
                    <button
                      onClick={() => {
                        const newFeatures = content.features.filter((_: any, i: number) => i !== index);
                        setContent({ ...content, features: newFeatures });
                      }}
                      className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...content.features];
                      newFeatures[index].description = e.target.value;
                      setContent({ ...content, features: newFeatures });
                    }}
                    rows={2}
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-500 focus:ring-0 resize-none"
                    placeholder="Feature Description"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, testimonials: [...content.testimonials, { name: "", content: "", role: "" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {content.testimonials.map((t: any, index: number) => (
                <div key={index} className="p-6 rounded-2xl bg-gray-50 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const newT = [...content.testimonials];
                          newT[index].name = e.target.value;
                          setContent({ ...content, testimonials: newT });
                        }}
                        className="bg-transparent border-none p-0 font-bold text-gray-900 focus:ring-0 text-sm"
                        placeholder="Student Name"
                      />
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => {
                          const newT = [...content.testimonials];
                          newT[index].role = e.target.value;
                          setContent({ ...content, testimonials: newT });
                        }}
                        className="bg-transparent border-none p-0 font-medium text-gray-400 focus:ring-0 text-xs"
                        placeholder="Job Role / Result"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newT = content.testimonials.filter((_: any, i: number) => i !== index);
                        setContent({ ...content, testimonials: newT });
                      }}
                      className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    value={t.content}
                    onChange={(e) => {
                      const newT = [...content.testimonials];
                      newT[index].content = e.target.value;
                      setContent({ ...content, testimonials: newT });
                    }}
                    rows={3}
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-600 focus:ring-0 resize-none italic"
                    placeholder="Their success story..."
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Partner Logos */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Partner Logos</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, partners: [...content.partners, { name: "", logo: "" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.partners.map((p: any, index: number) => (
                <div key={index} className="p-4 rounded-2xl bg-gray-50 flex flex-col gap-3 group relative">
                  <div className="w-full aspect-square rounded-xl bg-white flex items-center justify-center text-gray-300 border border-gray-100 overflow-hidden">
                    {p.logo ? <img src={p.logo} className="w-full h-full object-contain p-4" /> : <ImageIcon size={24} />}
                  </div>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const newP = [...content.partners];
                      newP[index].name = e.target.value;
                      setContent({ ...content, partners: newP });
                    }}
                    className="w-full bg-transparent border-none p-0 text-[10px] font-bold text-gray-900 focus:ring-0 text-center uppercase tracking-widest"
                    placeholder="Partner Name"
                  />
                  <input
                    type="text"
                    value={p.logo}
                    onChange={(e) => {
                      const newP = [...content.partners];
                      newP[index].logo = e.target.value;
                      setContent({ ...content, partners: newP });
                    }}
                    className="w-full bg-transparent border-none p-0 text-[8px] text-gray-400 focus:ring-0 text-center truncate"
                    placeholder="Logo URL"
                  />
                  <button
                    onClick={() => {
                      const newP = content.partners.filter((_: any, i: number) => i !== index);
                      setContent({ ...content, partners: newP });
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* SEO Controls */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">SEO Settings</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page Title</label>
                <input
                  type="text"
                  value={content.seo.title}
                  onChange={(e) => setContent({ ...content, seo: { ...content.seo, title: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Description</label>
                <textarea
                  rows={4}
                  value={content.seo.description}
                  onChange={(e) => setContent({ ...content, seo: { ...content.seo, description: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* Media Manager Quick View */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Hero Media</h2>
            </div>

            <div className="space-y-4">
              <div className="aspect-video rounded-2xl bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 group cursor-pointer hover:bg-gray-100 transition-all">
                <ImageIcon size={32} className="text-gray-300 group-hover:text-[#8b5cf6] transition-all mb-2" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-all">Upload New Asset</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center">
                Recommended size: 1920x1080px. Max 10MB.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
