"use client";

import { useState, useEffect } from "react";
import { Save, Info, ArrowLeft, Image as ImageIcon, Plus, Trash2, Globe, Users } from "lucide-react";
import Link from "next/link";
import { websiteApi } from "@/lib/api/website";

export default function AboutUsEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    mission: "To empower the next generation of software engineers.",
    vision: "Building a world where everyone has the tools to create impact.",
    description: "MSSquare is a premier platform for learning and building real-world software products.",
    team: [
      { name: "John Doe", role: "CEO", image: "" },
      { name: "Jane Smith", role: "CTO", image: "" }
    ],
    images: [
      { label: "Main Office", url: "" },
      { label: "Team Photo", url: "" }
    ],
    seo: {
      title: "About Us - MSSquare",
      description: "Learn about our mission and the team behind MSSquare.",
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("about");
        if (data?.content_json) {
          // Merge with defaults to ensure stability
          const mergedContent = {
            ...content,
            ...data.content_json,
            team: data.content_json.team || content.team,
            images: data.content_json.images || content.images,
            seo: { ...content.seo, ...data.content_json.seo }
          };
          setContent(mergedContent);
        }
      } catch (err) {
        console.error("Failed to fetch about content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteApi.updateSection("about", content);
      alert("About Us page updated successfully!");
    } catch (err) {
      console.error("Failed to update about content", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const addTeamMember = () => {
    setContent({ ...content, team: [...content.team, { name: "New Member", role: "Role", image: "" }] });
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
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit About Us</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <Info size={14} className="text-indigo-500" />
              Manage your company profile
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Mission & Vision */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Company Overview</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Company Description</label>
                <textarea
                  rows={4}
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Our Mission</label>
                  <textarea
                    rows={3}
                    value={content.mission}
                    onChange={(e) => setContent({ ...content, mission: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Our Vision</label>
                  <textarea
                    rows={3}
                    value={content.vision}
                    onChange={(e) => setContent({ ...content, vision: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
              </div>
              <button
                onClick={addTeamMember}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.team.map((member: any, index: number) => (
                <div key={index} className="p-4 rounded-2xl bg-gray-50 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gray-300 overflow-hidden border border-gray-100">
                    {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <Users size={24} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newTeam = [...content.team];
                        newTeam[index].name = e.target.value;
                        setContent({ ...content, team: newTeam });
                      }}
                      className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        const newTeam = [...content.team];
                        newTeam[index].role = e.target.value;
                        setContent({ ...content, team: newTeam });
                      }}
                      className="w-full bg-transparent border-none p-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest focus:ring-0"
                      placeholder="Role"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newTeam = content.team.filter((_: any, i: number) => i !== index);
                      setContent({ ...content, team: newTeam });
                    }}
                    className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Company Images */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Company Images</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, images: [...content.images, { label: "New Image", url: "" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.images.map((img: any, index: number) => (
                <div key={index} className="space-y-3 group relative">
                  <div className="aspect-video rounded-2xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-100 overflow-hidden relative group-hover:bg-gray-100 transition-all">
                    {img.url ? (
                      <img src={img.url} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-200" />
                    )}
                    <button
                      onClick={() => {
                        const newImages = content.images.filter((_: any, i: number) => i !== index);
                        setContent({ ...content, images: newImages });
                      }}
                      className="absolute top-2 right-2 p-2 rounded-xl bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={img.label}
                      onChange={(e) => {
                        const newImages = [...content.images];
                        newImages[index].label = e.target.value;
                        setContent({ ...content, images: newImages });
                      }}
                      className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0"
                      placeholder="Image Label (e.g. Office Exterior)"
                    />
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const newImages = [...content.images];
                        newImages[index].url = e.target.value;
                        setContent({ ...content, images: newImages });
                      }}
                      className="w-full bg-transparent border-none p-0 text-[10px] text-gray-400 focus:ring-0 truncate"
                      placeholder="Public Image URL"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SEO & Sidebar */}
        <div className="space-y-8">
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
        </div>
      </div>
    </div>
  );
}
