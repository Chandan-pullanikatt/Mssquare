"use client";

import {
    BookOpen,
    Play,
    Clock,
    ChevronRight,
    Search,
    Filter,
    Star,
    Loader2,
    GraduationCap,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";
import { lessonProgressApi } from "@/lib/api/lessonProgress";

export default function MyCoursesPage() {
    const { user, loading: authLoading } = useAuth();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const hasFetched = useRef<string | null>(null);

    useEffect(() => {
        if (user?.id && hasFetched.current === user.id) return;
        
        if (user?.id) {
            console.log("MyCoursesPage: Initializing enrollments fetch...");
            fetchEnrollments();
        }
    }, [user?.id]);

    const fetchEnrollments = async () => {
        if (!user?.id) return;
        try {
            console.log("MyCoursesPage: Starting fetchEnrollments...");
            if (!enrollments.length) {
                setLoading(true);
            }
            
            // Parallel fetch: All enrollments + All user lesson progress
            const [data, allProgress] = await Promise.all([
                enrollmentsApi.getEnrollmentsByUser(user.id),
                lessonProgressApi.getAllUserProgress(user.id)
            ]);
            
            console.log(`MyCoursesPage: Fetched ${data.length} enrollments and ${allProgress.length} progress markers.`);
            
            const enriched = data.map((enrollment: any) => {
                // Filter progress for THIS course from the pre-fetched list
                const courseProgress = allProgress.filter((p: any) => p.lessons?.course_id === enrollment.course_id);
                const totalLessons = enrollment.courses?.lessons?.length || 1;
                const progress = Math.min(Math.round((courseProgress.length / totalLessons) * 100), 100);
                
                return {
                    ...enrollment,
                    progress,
                    accent: enrollment.courses?.category === 'Tech' ? '#3b82f6' : 
                            enrollment.courses?.category === 'AI' ? '#8b5cf6' : 
                            enrollment.courses?.category === 'Design' ? '#f59e0b' : '#10b981'
                };
            });

            console.log("MyCoursesPage: Data enrichment complete.");
            setEnrollments(enriched);
            hasFetched.current = user.id;
        } catch (error) {
            console.error("MyCoursesPage: Error fetching enrollments:", error);
        } finally {
            setLoading(false);
            console.log("MyCoursesPage: Fetch cycle complete.");
        }
    };

    const filteredEnrollments = enrollments.filter(e => 
        e.courses?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || (loading && enrollments.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Your Academy Journey...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
        {/* Subtle loading bar for background re-fetches */}
        {loading && enrollments.length > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden z-50 rounded-full">
                <div className="h-full bg-[#8b5cf6] animate-progress-fast w-1/3"></div>
            </div>
        )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">My Courses</h1>
                    <p className="text-gray-500 font-medium">Continue your learning journey where you left off.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all min-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            {filteredEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEnrollments.map((enrollment, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-b-4" style={{ borderBottomColor: enrollment.accent }}>

                            <div className="h-40 bg-gray-900 relative overflow-hidden">
                                <img 
                                    src={enrollment.courses?.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"} 
                                    alt={enrollment.courses?.title} 
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white/40 backdrop-blur-md text-gray-900 text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                                        Enrolled
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold font-heading text-gray-900 mb-1 group-hover:text-[#8b5cf6] transition-colors leading-tight">
                                        {enrollment.courses?.title}
                                    </h3>
                                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                                        Modules: {enrollment.courses?.modules || 'TBA'}
                                    </p>
                                </div>

                                <div className="mt-auto space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold font-heading uppercase tracking-widest text-gray-400">
                                            <span>Progress</span>
                                            <span style={{ color: enrollment.accent }}>{enrollment.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-50 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${enrollment.progress}%`, backgroundColor: enrollment.accent }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-1">
                                        <Link
                                            href={`/student/courses/${enrollment.course_id}`}
                                            className="w-full py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg bg-white text-gray-900 border border-gray-200 hover:bg-[#8b5cf6] hover:text-white hover:border-[#8b5cf6] shadow-black/[0.02]"
                                        >
                                            {enrollment.progress > 0 ? "Resume Learning" : "Start Course"}
                                            <Play size={14} fill="currentColor" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 px-6 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <GraduationCap className="text-[#8b5cf6] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No courses found</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                            {searchQuery ? "Try searching for something else." : "You haven't enrolled in any courses yet. Start your journey today!"}
                        </p>
                        <Link 
                            href="/student/explore" 
                            className="inline-flex items-center gap-2 bg-[#8b5cf6] text-white px-8 py-4 rounded-2xl font-bold hover:-translate-y-1 transition-all"
                        >
                            <Sparkles size={20} />
                            Browse Programs
                        </Link>
                    </div>
                </div>
            )}

        </div>
    );
}
