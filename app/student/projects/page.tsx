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
    FileText,
    Loader2,
    Search,
    Filter
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";
import { projectsApi } from "@/lib/api/projects";
import { Project } from "@/types/database";
import Link from "next/link";

export default function StudentProjectsPage() {
    const { user, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState<(Project & { course_title: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const enrollments = await enrollmentsApi.getEnrollmentsByUser(user.id);
            
            const allProjects = await Promise.all(enrollments.map(async (enrollment: any) => {
                const courseProjects = await projectsApi.getProjectsByCourse(enrollment.course_id);
                return courseProjects.map(p => ({
                    ...p,
                    course_title: enrollment.courses?.title || 'Unknown Course'
                }));
            }));

            setProjects(allProjects.flat());
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.course_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">My Projects</h1>
                    <p className="text-gray-500 font-medium">Tracking your build progress and technical achievements for enrolled courses.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all min-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500 hover:border-[#8b5cf6]/20">

                            <div className="flex items-center justify-between mb-6">
                                <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-purple-50 text-[#8b5cf6] border border-transparent group-hover:border-current transition-colors`}>
                                    {project.course_title}
                                </div>
                                <div className="flex items-center gap-2.5 text-gray-400">
                                    <Github size={16} className="hover:text-gray-900 cursor-pointer transition-colors" />
                                    <ExternalLink size={16} className="hover:text-gray-900 cursor-pointer transition-colors" />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold font-heading text-gray-900 mb-2 group-hover:text-[#8b5cf6] transition-colors leading-tight">{project.title}</h3>
                            <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-6">
                                {project.tags?.map((tag, j) => (
                                    <span key={j} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-50">
                                <button className="py-2.5 rounded-xl border border-gray-100 text-gray-900 font-bold text-[12px] hover:bg-gray-50 transition-colors">
                                    Brief
                                </button>
                                <button className="py-2.5 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] font-bold text-[12px] hover:bg-[#8b5cf6] hover:text-white transition-all">
                                    Submit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 px-6 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FolderGit2 className="text-[#8b5cf6] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No projects found</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                            {searchQuery ? "Try searching for something else." : "Projects for your enrolled courses will appear here once added by the admin."}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}
