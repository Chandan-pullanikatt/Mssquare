"use client";

import {
    FolderGit2,
    ExternalLink,
    Github,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowRight,
    Code2,
    FileText
} from "lucide-react";

const projects = [
    {
        title: "Eco-Friendly E-commerce Platform",
        category: "Full Stack Development",
        date: "Oct 15, 2024",
        status: "In Development",
        progress: 85,
        description: "Building a sustainable marketplace for eco-friendly products using Next.js and Tailwind CSS.",
        tags: ["React", "Node.js", "PostgreSQL"],
        color: "text-[#8b5cf6]",
        bg: "bg-purple-50"
    },
    {
        title: "AI Personal Portfolio",
        category: "Final Year Project",
        date: "Sep 28, 2024",
        status: "Planning",
        progress: 20,
        description: "Developing a dynamic portfolio that uses AI to showcase skills and projects based on visitor intent.",
        tags: ["AI/ML", "Next.js", "Framer Motion"],
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        title: "FinTech Dashboard Mockup",
        category: "UI/UX Design",
        date: "Aug 12, 2024",
        status: "Completed",
        progress: 100,
        description: "A high-fidelity design prototype for a modern financial management application.",
        tags: ["Figma", "UI/UX", "Prototyping"],
        color: "text-emerald-500",
        bg: "bg-emerald-50"
    },
    {
        title: "Real-time Chat Application",
        category: "Web Sockets Lab",
        date: "Jul 05, 2024",
        status: "Completed",
        progress: 100,
        description: "Implemented a socket-based chat system with real-time notifications and message history.",
        tags: ["Socket.io", "Express", "Redis"],
        color: "text-amber-500",
        bg: "bg-amber-50"
    }
];

export default function StudentProjectsPage() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">My Projects</h1>
                    <p className="text-gray-500 font-medium">Tracking your build progress and technical achievements.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-[#111827] text-white px-6 py-3.5 rounded-full font-bold shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-transform">
                    <FolderGit2 size={18} className="text-[#8b5cf6]" />
                    <span>Post New Project</span>
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500 hover:border-[#8b5cf6]/20">

                        <div className="flex items-center justify-between mb-6">
                            <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${project.bg} ${project.color} border border-transparent group-hover:border-current transition-colors`}>
                                {project.category}
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <Github size={16} className="hover:text-gray-900 cursor-pointer transition-colors" />
                                <ExternalLink size={16} className="hover:text-gray-900 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold font-heading text-gray-900 mb-2 group-hover:text-[#8b5cf6] transition-colors leading-tight">{project.title}</h3>
                        <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-2">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {project.tags.slice(0, 3).map((tag, j) => (
                                <span key={j} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-3 pt-3 border-t border-gray-50">
                            <div className="flex justify-between items-center text-[10px] font-bold font-heading uppercase tracking-widest">
                                <div className="text-gray-400">{project.progress}% Done</div>
                            </div>
                            <div className="w-full bg-gray-50 rounded-full h-1 overflow-hidden">
                                <div
                                    className={`h-1 rounded-full transition-all duration-1000 ${project.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-6">
                            <button className="py-2.5 rounded-xl border border-gray-100 text-gray-900 font-bold text-[12px] hover:bg-gray-50 transition-colors">
                                Brief
                            </button>
                            <button className="py-2.5 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] font-bold text-[12px] hover:bg-[#8b5cf6] hover:text-white transition-all">
                                Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
