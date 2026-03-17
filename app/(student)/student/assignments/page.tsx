"use client";

import {
    FileText,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowRight,
    Loader2,
    Search,
    Filter,
    ChevronRight,
    PlayCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";
import { assignmentsApi } from "@/lib/api/assignments";
import { Assignment } from "@/types/database";
import Link from "next/link";

export default function StudentAssignmentsPage() {
    const { user, loading: authLoading } = useAuth();
    const [assignments, setAssignments] = useState<(Assignment & { course_title: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        console.log("StudentAssignmentsPage: Effect triggered. user.id:", user?.id);

        // Safety timeout to unlock the UI even if fetch hangs
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("StudentAssignmentsPage: Safety timeout reached. Forcing loading to false.");
                setLoading(false);
            }
        }, 8000);

        if (user) {
            fetchAssignments();
        }

        return () => clearTimeout(timeoutId);
    }, [user]);

    const fetchAssignments = async () => {
        if (!user) return;
        try {
            console.log("StudentAssignmentsPage: Starting fetchAssignments...");
            setLoading(true);
            const enrollments = await enrollmentsApi.getEnrollmentsByUser(user.id);
            console.log(`StudentAssignmentsPage: Fetched ${enrollments.length} enrollments.`);
            
            const allAssignments = await Promise.all(enrollments.map(async (enrollment: any) => {
                const courseAssignments = await assignmentsApi.getAssignmentsByCourse(enrollment.course_id);
                return courseAssignments.map(a => ({
                    ...a,
                    course_title: enrollment.courses?.title || 'Unknown Course'
                }));
            }));

            setAssignments(allAssignments.flat());
        } catch (error) {
            console.error("StudentAssignmentsPage: Error fetching assignments:", error);
        } finally {
            setLoading(false);
            console.log("StudentAssignmentsPage: Fetch cycle complete.");
        }
    };

    const filteredAssignments = assignments.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.course_title.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">My Assignments</h1>
                    <p className="text-gray-500 font-medium">Manage your coursework and upcoming deadlines.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all min-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {/* Assignments List */}
            {filteredAssignments.length > 0 ? (
                <div className="space-y-4">
                    {filteredAssignments.map((assignment, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl transition-all duration-500 hover:border-[#8b5cf6]/20">
                            
                            <div className="flex items-center gap-5 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-[#8b5cf6] shrink-0 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold font-heading text-gray-900 group-hover:text-[#8b5cf6] transition-colors leading-tight">{assignment.title}</h3>
                                        <span className="bg-gray-50 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider group-hover:bg-purple-50 group-hover:text-purple-600">
                                            {assignment.course_title}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{assignment.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 pl-14 md:pl-0">
                                <div className="hidden sm:block">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        Due Date
                                    </div>
                                    <div className="text-sm font-bold text-gray-700">
                                        {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No deadline'}
                                    </div>
                                </div>
                                <button className="flex items-center justify-center gap-2 bg-[#f5f3ff] text-[#8b5cf6] px-6 py-3 rounded-xl font-bold hover:bg-[#8b5cf6] hover:text-white transition-all">
                                    <span>Open</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 px-6 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="text-[#8b5cf6] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No assignments found</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                            {searchQuery ? "Try searching for something else." : "Assignments for your enrolled courses will appear here."}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}
