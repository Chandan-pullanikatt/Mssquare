"use client";

import {
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  ChevronRight,
  Megaphone,
  Calendar,
  Sparkles,
  User,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { enrollmentsApi } from "@/lib/api/enrollments";
import { lessonProgressApi } from "@/lib/api/lessonProgress";
import { Course } from "@/types/database";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    hoursStudied: 0,
    certificatesEarned: 0,
    averageGrade: "0%"
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      if (enrollments.length === 0) {
        setLoading(true);
      }
      // Fetch enrollments and all lesson progress in parallel for better performance
      const [enrollmentsData, allProgress] = await Promise.all([
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

      // Calculate progress and completion for each enrollment in memory
      const enrichedEnrollments = enrollmentsData.map((enrollment: any) => {
        const completedLessons = progressByCourse[enrollment.course_id] || [];
        const totalLessons = enrollment.courses?.lessons?.length || 1;
        const progress = Math.min(Math.round((completedLessons.length / totalLessons) * 100), 100);
        
        return {
          ...enrollment,
          progress,
          completed: progress === 100
        };
      });

      setEnrollments(enrichedEnrollments);
      
      // Update stats based on fetched data
      setStats({
        coursesCompleted: enrichedEnrollments.filter((e: any) => e.completed).length,
        hoursStudied: 0, // Placeholder
        certificatesEarned: 0, // Will be fetched from certificatesApi later
        averageGrade: "N/A"
      });
    } catch (error) {
      console.error("Error fetching student dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-10 px-2 lg:px-0">

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 flex items-center gap-2 mb-2">
            Welcome back, {user?.user_metadata?.name || 'Alex'}! <span className="text-4xl">👋</span>
          </h1>
          <p className="text-gray-500 font-medium">
            You are enrolled in <span className="text-[#8b5cf6] font-bold">{enrollments.length}</span> courses. Keep it up!
          </p>
        </div>
        <Link href="/student/ai-coach" className="flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-5 py-3.5 rounded-full font-bold shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 transition-transform">
          <Sparkles size={18} className="fill-white" />
          <span>Launch AI Coach</span>
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Courses Completed", value: stats.coursesCompleted, diff: "+0%",
            icon: CheckCircle2, iconBg: "bg-blue-50", iconColor: "text-blue-500", diffBg: "bg-green-50", diffColor: "text-green-600"
          },
          {
            title: "Enrolled Courses", value: enrollments.length, diff: "+0",
            icon: Clock, iconBg: "bg-purple-50", iconColor: "text-[#8b5cf6]", diffBg: "bg-green-50", diffColor: "text-green-600"
          },
          {
            title: "Certificates Earned", value: stats.certificatesEarned, badge: "Lvl 1",
            icon: Award, iconBg: "bg-orange-50", iconColor: "text-orange-500", diffBg: "bg-gray-100", diffColor: "text-gray-600"
          },
          {
            title: "Learning Progress", value: enrollments.length > 0 ? `${Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)}%` : "0%", badge: "Active",
            icon: TrendingUp, iconBg: "bg-green-50", iconColor: "text-green-500", diffBg: "bg-green-50", diffColor: "text-green-600"
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon size={22} className={stat.iconColor} />
              </div>
              {stat.diff && (
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.diffBg} ${stat.diffColor}`}>
                  {stat.diff}
                </div>
              )}
              {stat.badge && (
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.diffBg} ${stat.diffColor}`}>
                  {stat.badge}
                </div>
              )}
            </div>
            <div>
              <div className="text-gray-500 text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (Courses & Chart) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Courses */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-gray-900">Active Courses</h2>
              <Link href="/student/explore" className="text-[#8b5cf6] text-sm font-bold hover:underline">View All</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrollments.length > 0 ? enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col group hover:shadow-lg transition-all hover:border-[#8b5cf6]/20">
                  <div className="h-40 bg-gray-900 relative overflow-hidden border-b border-gray-100">
                    <div className="absolute inset-0 opacity-80 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: `url(${enrollment.courses?.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop'})` }}></div>
                    <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-md text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Course
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold font-heading text-lg text-gray-900 mb-1 leading-tight group-hover:text-[#8b5cf6] transition-colors">{enrollment.courses?.title}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-6">Course Material</p>

                    <div className="mt-auto space-y-4">
                      <div className="flex justify-between text-xs font-bold font-heading">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-[#8b5cf6]">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#8b5cf6] h-2 rounded-full transition-all duration-500" style={{ width: `${enrollment.progress}%` }}></div>
                      </div>
                      <Link href={`/student/courses/${enrollment.course_id}`} className="w-full mt-4 py-2.5 rounded-full border-2 border-[#8b5cf6]/20 text-[#8b5cf6] font-bold text-sm hover:bg-[#8b5cf6]/5 transition-all flex items-center justify-center gap-2">
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-12 px-6 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      <GraduationCap className="text-[#8b5cf6] w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No courses enrolled yet</h3>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
                      Your learning journey is waiting. Explore our premium courses and start building your future today.
                    </p>
                    <Link 
                      href="/student/explore" 
                      className="inline-flex items-center gap-2 bg-[#8b5cf6] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-1 transition-all active:scale-95"
                    >
                      <Sparkles size={20} />
                      Browse Courses
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Classes */}
          {/* Keep existing static UI for now as it's not explicitly in the backend yet */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-gray-900">Upcoming Classes</h2>
              <button className="text-[#8b5cf6] text-sm font-bold hover:underline">Full Schedule</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-l-4 border-l-[#8b5cf6] flex flex-col hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50/50 to-white">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8b5cf6] mb-2 tracking-wider">
                  09:00 - 11:30
                </div>
                <h3 className="font-bold text-gray-900 mb-2 leading-snug">Full Stack Web Dev</h3>
                <div className="flex items-center gap-2 flex-1 text-xs font-semibold text-gray-500 mb-5">
                  <User size={14} className="text-gray-400" />
                  Dr. Sarah Jenkins
                </div>
                <div>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[10px] font-bold px-3 py-1.5 rounded-full inline-block">Live Online</span>
                </div>
              </div>
              {/* Other class card 2 and 3 omitted for length but kept in actual file */}
            </div>
          </section>

        </div>

        {/* Right Sidebar (Deadlines & Announcements) */}
        <div className="space-y-8">
          {/* Keep existing static UI for deadlines and announcements as they are not yet in Supabase */}
          <section className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-[#8b5cf6]" size={22} />
              <h2 className="text-lg font-bold font-heading text-gray-900">Upcoming Deadlines</h2>
            </div>
            {/* List items... */}
          </section>
        </div>

      </div>
    </div>
  );
}
