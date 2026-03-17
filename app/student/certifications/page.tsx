"use client";

import {
    Award,
    Download,
    Share2,
    CheckCircle2,
    Search,
    Filter,
    ExternalLink,
    ShieldCheck,
    Trophy,
    Loader2,
    Lock
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";
import { certificationMetadataApi } from "@/lib/api/certificationMetadata";
import { lessonProgressApi } from "@/lib/api/lessonProgress";
import { CertificationMetadata } from "@/types/database";

export default function CertificationsPage() {
    const { user, loading: authLoading } = useAuth();
    const [certs, setCerts] = useState<(CertificationMetadata & { progress: number, course_title: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCertifications();
        }
    }, [user]);

    const fetchCertifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const [enrollments, allProgress] = await Promise.all([
                enrollmentsApi.getEnrollmentsByUser(user.id),
                lessonProgressApi.getAllUserProgress(user.id)
            ]);
            
            // Group progress by course_id for efficient lookup
            const progressByCourse = allProgress.reduce((acc: any, curr: any) => {
                const courseId = curr.lessons?.course_id;
                if (courseId) {
                    if (!acc[courseId]) acc[courseId] = [];
                    acc[courseId].push(curr);
                }
                return acc;
            }, {});

            const results = await Promise.all(enrollments.map(async (enrollment: any) => {
                const metadata = await certificationMetadataApi.getCertificationByCourse(enrollment.course_id);
                if (!metadata) return null;
                
                const completedLessons = progressByCourse[enrollment.course_id] || [];
                const totalLessons = enrollment.courses?.lessons?.length || 1;
                const progress = Math.min(Math.round((completedLessons.length / totalLessons) * 100), 100);

                return {
                    ...metadata,
                    progress,
                    course_title: enrollment.courses?.title || 'Unknown Course'
                };
            }));

            setCerts(results.filter((c): c is (CertificationMetadata & { progress: number, course_title: string }) => c !== null));
        } catch (error) {
            console.error("Error fetching certifications:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">My Certifications</h1>
                    <p className="text-gray-500 font-medium">Official career milestones available once you hit 90% course progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Available</div>
                        <div className="text-xl font-extrabold text-gray-900">{certs.length} Certificates</div>
                    </div>
                </div>
            </div>

            {/* Certification Grid */}
            <div className="grid grid-cols-1 gap-8">
                {certs.length > 0 ? certs.map((cert, i) => {
                    const isUnlocked = cert.progress >= 90;
                    return (
                        <div key={i} className={`bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500 ${isUnlocked ? 'hover:border-[#8b5cf6]/20' : 'opacity-80'}`}>

                            {/* Left Status Section */}
                            <div className={`md:w-[200px] h-[160px] md:h-auto flex flex-col items-center justify-center relative shrink-0 ${isUnlocked ? 'bg-[#8b5cf6]' : 'bg-gray-100'}`}>
                                {isUnlocked ? (
                                    <Award size={64} className="text-white animate-pulse" />
                                ) : (
                                    <Lock size={64} className="text-gray-300" />
                                )}
                                <div className="absolute bottom-4 text-white font-bold text-xs uppercase tracking-widest">
                                    {isUnlocked ? 'Ready to Download' : `${cert.progress}% Complete`}
                                </div>
                            </div>

                            {/* Right Content Section */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest mb-2 ${isUnlocked ? 'bg-purple-50 text-[#8b5cf6]' : 'bg-gray-50 text-gray-400'}`}>
                                            {isUnlocked ? 'Unlocked' : 'Locked'}
                                        </div>
                                        <h2 className="text-xl font-extrabold font-heading text-gray-900 group-hover:text-[#8b5cf6] transition-colors leading-tight">
                                            {cert.title}
                                        </h2>
                                        <p className="text-xs text-gray-400 font-medium mt-1">{cert.course_title}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            disabled={!isUnlocked}
                                            className={`p-2.5 rounded-xl transition-all ${isUnlocked ? 'bg-purple-50 text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                                            title={isUnlocked ? 'Download Certificate' : 'Complete 90% to unlock'}
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                    {cert.description}
                                </p>

                                {!isUnlocked && (
                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress to Unlock</span>
                                            <span className="text-[10px] font-bold text-[#8b5cf6]">{cert.progress}/90%</span>
                                        </div>
                                        <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-[#8b5cf6] h-1.5 rounded-full transition-all duration-1000" 
                                                style={{ width: `${(cert.progress / 90) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[10px] font-bold text-amber-500 mt-2 flex items-center gap-1.5">
                                            <Lock size={10} />
                                            Complete 90% of the course to unlock your certificate.
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    );
                }) : (
                    <div className="py-20 px-6 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Award className="text-[#8b5cf6] w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No certifications available</h3>
                            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                                Certifications for your enrolled courses will appear here. Start learning to unlock your milestones.
                            </p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
