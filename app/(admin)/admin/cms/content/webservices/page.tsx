"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Plus, Trash2, Globe, Rocket, Zap, Code2, Layout, Database, Smartphone, Cloud, Github, Terminal, PenTool, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { websiteApi } from "@/lib/api/website";

export default function WebServicesPageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    hero: {
      badge: "SOFTWARE DEVELOPMENT STUDIO",
      title: "Build Your Product With MSSquare",
      subtitle: "We help startups and businesses design, build, and launch digital products that people love. From ideation to deployment.",
    },
    services: [
      { title: "Startup MVP Development", desc: "Fast-track your idea to market with a lean, functional, and scalable MVP.", image: "/assets/services/startup-mvp.png" },
      { title: "Business Websites", desc: "High-converting websites that represent your brand and drive actual business results.", image: "/assets/services/website-dev.png" },
      { title: "Custom Web Apps", desc: "Powerful internal tools and SaaS applications built for speed and reliability.", image: "/assets/services/webapp-dev.png" },
      { title: "Product Consulting", desc: "Strategic guidance on architecture, UX design, and scaling your tech infrastructure.", image: "/assets/services/product-consulting.png" }
    ],
    projects: [
      { title: "Our Home Tuition", headline: "A complete ecosystem for online tutoring.", desc: "Connecting thousands of students with expert tutors in real-time.", image: "/assets/projects/home-tuition-v2.png", link: "https://our-home-tuition.vercel.app/", stats: "50k+ Users" },
      { title: "SwiftShop", headline: "Luxury fashion e-commerce platform.", desc: "A high-performance luxury marketplace with seamless checkout flows.", image: "/assets/projects/cloth-shop.png", link: "#", stats: "Global Reach" },
      { title: "Examineer", headline: "Secure & scalable examination portal.", desc: "A robust testing platform with proctoring for large-scale assessments.", image: "/assets/projects/exam-lms.png", link: "#", stats: "Proctoring Enabled" }
    ],
    techStack: [
      { name: "React / Next.js", color: "text-blue-600" },
      { name: "Tailwind CSS", color: "text-cyan-500" },
      { name: "Node.js", color: "text-green-600" },
      { name: "Python", color: "text-blue-700" },
      { name: "TypeScript", color: "text-blue-500" },
      { name: "PostgreSQL", color: "text-indigo-600" }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await websiteApi.getSection("webservices_content");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch webservices content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await websiteApi.updateSection("webservices_content", content);
      alert("WebServices page updated successfully!");
    } catch (err) {
      console.error("Failed to update webservices content", err);
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
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Edit WebServices Page</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <Globe size={14} className="text-violet-500" />
              Manage dynamic services and projects
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
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Rocket size={20} />
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

          {/* Services Section */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Services</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, services: [...content.services, { title: "New Service", desc: "", image: "" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {content.services.map((service: any, index: number) => (
                <div key={index} className="p-6 rounded-2xl bg-gray-50 space-y-4 group">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        const newServices = [...content.services];
                        newServices[index].title = e.target.value;
                        setContent({ ...content, services: newServices });
                      }}
                      className="bg-transparent border-none p-0 font-bold text-gray-900 focus:ring-0 text-lg w-full"
                    />
                    <button
                      onClick={() => {
                        const newServices = content.services.filter((_: any, i: number) => i !== index);
                        setContent({ ...content, services: newServices });
                      }}
                      className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    value={service.desc}
                    onChange={(e) => {
                      const newServices = [...content.services];
                      newServices[index].desc = e.target.value;
                      setContent({ ...content, services: newServices });
                    }}
                    rows={2}
                    className="w-full bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 resize-none"
                    placeholder="Service description"
                  />
                   <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300">
                        {service.image ? <img src={service.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} />}
                    </div>
                    <input
                        type="text"
                        value={service.image}
                        onChange={(e) => {
                            const newServices = [...content.services];
                            newServices[index].image = e.target.value;
                            setContent({ ...content, services: newServices });
                        }}
                        className="flex-1 bg-white/50 border-none rounded-xl py-2 px-4 text-xs font-medium text-gray-500 outline-none"
                        placeholder="Image URL (e.g. /assets/services/name.png)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Showcase */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Layout size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Projects Showcase</h2>
              </div>
              <button
                onClick={() => setContent({ ...content, projects: [...content.projects, { title: "", headline: "", desc: "", image: "", link: "", stats: "" }] })}
                className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-6">
                {content.projects.map((project: any, index: number) => (
                    <div key={index} className="p-6 rounded-2xl bg-gray-50 space-y-4 group">
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                    const newProjects = [...content.projects];
                                    newProjects[index].title = e.target.value;
                                    setContent({ ...content, projects: newProjects });
                                }}
                                className="bg-transparent border-none p-0 font-bold text-gray-400 uppercase tracking-widest text-[10px] w-full"
                                placeholder="Project Name (e.g. SwiftShop)"
                            />
                            <button
                                onClick={() => {
                                    const newProjects = content.projects.filter((_: any, i: number) => i !== index);
                                    setContent({ ...content, projects: newProjects });
                                }}
                                className="p-2 rounded-lg bg-white text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={project.headline}
                            onChange={(e) => {
                                const newProjects = [...content.projects];
                                newProjects[index].headline = e.target.value;
                                setContent({ ...content, projects: newProjects });
                            }}
                            className="bg-transparent border-none p-0 font-extrabold text-gray-900 text-lg w-full"
                            placeholder="Headline Quote"
                        />
                        <textarea
                            value={project.desc}
                            onChange={(e) => {
                                const newProjects = [...content.projects];
                                newProjects[index].desc = e.target.value;
                                setContent({ ...content, projects: newProjects });
                            }}
                            rows={2}
                            className="w-full bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 resize-none"
                            placeholder="Project description"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={project.image}
                                onChange={(e) => {
                                    const newProjects = [...content.projects];
                                    newProjects[index].image = e.target.value;
                                    setContent({ ...content, projects: newProjects });
                                }}
                                className="bg-white border-none rounded-xl py-2 px-4 text-xs font-medium text-gray-500 outline-none"
                                placeholder="Image URL"
                            />
                            <input
                                type="text"
                                value={project.link}
                                onChange={(e) => {
                                    const newProjects = [...content.projects];
                                    newProjects[index].link = e.target.value;
                                    setContent({ ...content, projects: newProjects });
                                }}
                                className="bg-white border-none rounded-xl py-2 px-4 text-xs font-medium text-gray-500 outline-none"
                                placeholder="External Link"
                            />
                            <input
                                type="text"
                                value={project.stats}
                                onChange={(e) => {
                                    const newProjects = [...content.projects];
                                    newProjects[index].stats = e.target.value;
                                    setContent({ ...content, projects: newProjects });
                                }}
                                className="bg-white border-none rounded-xl py-2 px-4 text-xs font-bold text-violet-600 outline-none"
                                placeholder="Stats (e.g. 50k+ Users)"
                            />
                        </div>
                    </div>
                ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
            {/* Tech Stack */}
            <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Code2 size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Tech Stack</h2>
                    </div>
                </div>
                <div className="space-y-3">
                    {content.techStack.map((tech: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                            <input
                                type="text"
                                value={tech.name}
                                onChange={(e) => {
                                    const newStack = [...content.techStack];
                                    newStack[index].name = e.target.value;
                                    setContent({ ...content, techStack: newStack });
                                }}
                                className="flex-1 bg-transparent border-none p-0 text-sm font-bold text-gray-800 outline-none focus:ring-0"
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
