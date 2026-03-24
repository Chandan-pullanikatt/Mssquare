"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Plus, Trash2, Briefcase, MapPin, Zap, Users, Target, FileText } from "lucide-react";
import Link from "next/link";
import { websiteApi } from "@/lib/api/website";

export default function CareersPageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    hero: {
      badge: "We are hiring",
      title: "Build the Future of Tech With Us",
      subtitle: "Join a team of passionate educators, builders, and innovators dedicated to bridging the gap between learning and building.",
    },
    benefits: [
      { title: "High Impact Work", desc: "Build products that scale and train developers who will shape the future." },
      { title: "Incredible Culture", desc: "A flat hierarchy where best ideas win. No bureaucracy, just pure building." },
      { title: "Continuous Growth", desc: "Unlimited access to our courses, mentorship, and a generous learning stipend." },
    ],
    jobs: [
      { id: 1, role: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-Time" },
      { id: 2, role: "UI/UX Product Designer", department: "Design", location: "Hybrid / New York", type: "Full-Time" },
      { id: 3, role: "Full-Stack Instructor", department: "Education", location: "Remote", type: "Contract" },
      { id: 4, role: "Developer Advocate", department: "Marketing", location: "Remote", type: "Full-Time" },
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await websiteApi.getSection("careers_content");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch careers content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteApi.updateSection("careers_content", content);
      alert("Careers page updated successfully!");
    } catch (err) {
      console.error("Failed to update careers content", err);
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
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit Careers Page</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <FileText size={14} className="text-cyan-500" />
              Manage job openings and page content
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
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <FileText size={20} />
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
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                  className="w-full bg-gray-50 border-none rounded-2xl py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* Job Openings */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Job Openings</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, jobs: [...content.jobs, { id: Date.now(), role: "New Role", department: "Engineering", location: "Remote", type: "Full-Time" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {content.jobs.map((job: any, index: number) => (
                <div key={job.id} className="p-6 rounded-2xl bg-gray-50 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={job.role}
                      onChange={(e) => {
                        const newJobs = [...content.jobs];
                        newJobs[index].role = e.target.value;
                        setContent({ ...content, jobs: newJobs });
                      }}
                      className="bg-transparent border-none p-0 font-bold text-gray-900 focus:ring-0 text-lg w-full"
                      placeholder="Job Role"
                    />
                    <button
                      onClick={() => {
                        const newJobs = content.jobs.filter((_: any, i: number) => i !== index);
                        setContent({ ...content, jobs: newJobs });
                      }}
                      className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Department</label>
                        <input
                            type="text"
                            value={job.department}
                            onChange={(e) => {
                                const newJobs = [...content.jobs];
                                newJobs[index].department = e.target.value;
                                setContent({ ...content, jobs: newJobs });
                            }}
                            className="w-full bg-white/50 border-none rounded-xl py-2 px-4 text-xs font-bold text-gray-600 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Location</label>
                        <input
                            type="text"
                            value={job.location}
                            onChange={(e) => {
                                const newJobs = [...content.jobs];
                                newJobs[index].location = e.target.value;
                                setContent({ ...content, jobs: newJobs });
                            }}
                            className="w-full bg-white/50 border-none rounded-xl py-2 px-4 text-xs font-bold text-gray-600 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Type</label>
                        <input
                            type="text"
                            value={job.type}
                            onChange={(e) => {
                                const newJobs = [...content.jobs];
                                newJobs[index].type = e.target.value;
                                setContent({ ...content, jobs: newJobs });
                            }}
                            className="w-full bg-white/50 border-none rounded-xl py-2 px-4 text-xs font-bold text-gray-600 outline-none"
                        />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Benefits Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Target size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Benefits</h2>
              </div>
            </div>

            <div className="space-y-6">
              {content.benefits.map((benefit: any, index: number) => (
                <div key={index} className="space-y-2 p-4 rounded-2xl bg-gray-50">
                  <input
                    type="text"
                    value={benefit.title}
                    onChange={(e) => {
                      const newBenefits = [...content.benefits];
                      newBenefits[index].title = e.target.value;
                      setContent({ ...content, benefits: newBenefits });
                    }}
                    className="w-full bg-transparent border-none p-0 font-bold text-gray-900 focus:ring-0 text-sm"
                  />
                  <textarea
                    rows={2}
                    value={benefit.desc}
                    onChange={(e) => {
                      const newBenefits = [...content.benefits];
                      newBenefits[index].desc = e.target.value;
                      setContent({ ...content, benefits: newBenefits });
                    }}
                    className="w-full bg-transparent border-none p-0 text-xs text-gray-500 focus:ring-0 resize-none"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
