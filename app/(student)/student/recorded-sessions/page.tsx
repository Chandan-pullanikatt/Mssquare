"use client";

import {
    Video,
    Loader2,
    Search,
    Play,
    Calendar,
    Clock,
    Info,
    Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";
import { recordedSessionsApi } from "@/lib/api/recordedSessions";
import { RecordedSession } from "@/types/database";
import VideoPlayer from "@/components/shared/VideoPlayer";

export default function StudentRecordedSessionsPage() {
    const { user, loading: authLoading } = useAuth();
    const [sessions, setSessions] = useState<(RecordedSession & { course_title: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    const fetchSessions = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const enrollments = await enrollmentsApi.getEnrollmentsByUser(user.id);
            
            const allSessions = await Promise.all(enrollments.map(async (enrollment: any) => {
                const courseSessions = await recordedSessionsApi.getRecordedSessionsByCourse(enrollment.course_id);
                return courseSessions.map(s => ({
                    ...s,
                    course_title: enrollment.courses?.title || 'Unknown Course'
                }));
            }));

            setSessions(allSessions.flat());
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (sessionId: string, videoId: string) => {
        setActiveVideo(sessionId);
        if (user) {
            recordedSessionsApi.trackView(sessionId, user.id);
        }
    };

    const filteredSessions = sessions.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course_title.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">Recorded Sessions</h1>
                    <p className="text-gray-500 font-medium">Watch past class recordings and catch up on missed sessions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all min-w-[240px]"
                        />
                    </div>
                </div>
            </div>

            {/* Sessions Grid */}
            {filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredSessions.map((session, i) => {
                        const isPlaying = activeVideo === session.id;
                        return (
                            <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500 hover:border-[#8b5cf6]/20">
                                <div className="aspect-video bg-gray-900 relative">
                                    {isPlaying ? (
                                        <VideoPlayer videoId={session.video_url} title={session.title} />
                                    ) : (
                                        <button 
                                            onClick={() => handlePlay(session.id, session.video_url)}
                                            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-white gap-4 group/play"
                                        >
                                            <img 
                                                src={`https://img.youtube.com/vi/${session.video_url}/maxresdefault.jpg`} 
                                                alt={session.title}
                                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover/play:scale-110 group-hover/play:bg-[#8b5cf6] transition-all duration-300 shadow-xl">
                                                <Play size={32} fill="currentColor" className="ml-1" />
                                            </div>
                                            <span className="relative z-10 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover/play:opacity-100 transition-all duration-300 translate-y-2 group-hover/play:translate-y-0 text-white">
                                                Click to Play
                                            </span>
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-purple-50 text-[#8b5cf6] text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                                            {session.course_title}
                                        </span>
                                        <div className="flex items-center gap-3 text-gray-400 text-xs font-bold">
                                            {session.duration && (
                                                <div className="flex items-center gap-1.5 text-purple-600 bg-purple-50/50 px-2 py-0.5 rounded-md">
                                                    <Clock size={12} />
                                                    {session.duration}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(session.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 group-hover:text-[#8b5cf6] transition-colors line-clamp-1">{session.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                        {session.description || "No description provided for this session."}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => handlePlay(session.id, session.video_url)}
                                                className="flex items-center gap-2 text-[#8b5cf6] font-bold text-sm hover:opacity-80 transition-opacity"
                                            >
                                                <Play size={16} fill="currentColor" />
                                                {isPlaying ? "Now Playing" : "Watch Now"}
                                            </button>
                                        </div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                                            <Eye size={12} />
                                            Recorded
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 px-6 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Video className="text-[#8b5cf6] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No recordings found</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                            {searchQuery ? "Try searching for something else." : "Class recordings for your enrolled courses will appear here."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
