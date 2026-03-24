"use client";

import { useEffect, useState, useRef } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  Award,
  BarChart3,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/cms-admin/StatsCard";
import DataTable from "@/components/cms-admin/DataTable";
import { adminApi } from "@/lib/api/admin";

export default function LMSAdminDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    
    let mounted = true;
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        if (mounted) {
          setStatsData(data);
          hasFetched.current = true;
        }
      } catch (err) {
        console.error("Failed to fetch LMS stats", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: statsData?.totalStudents || "0",
      trend: "+0%",
      icon: GraduationCap,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Courses",
      value: statsData?.totalCourses || "0",
      trend: "+0",
      icon: BookOpen,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Enrollments",
      value: statsData?.totalEnrollments || "0",
      trend: "+0%",
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const enrollmentColumns = [
    {
      header: "Student",
      accessor: "profiles.email",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
            {val?.charAt(0) || "U"}
          </div>
          <span className="font-bold text-gray-900">{val || "Unknown"}</span>
        </div>
      ),
    },
    { header: "Course", accessor: "courses.title" },
    { 
      header: "Date", 
      accessor: "created_at",
      render: (val: string) => new Date(val).toLocaleDateString()
    },
  ];

  if (loading && !statsData) return (
    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing LMS Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 relative">
      {/* Subtle loading bar for background re-fetches */}
      {loading && statsData && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden z-50">
          <div className="h-full bg-[#8b5cf6] animate-progress-fast w-1/3"></div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">LMS Overview</h1>
          <p className="text-gray-500 font-medium">Manage your academy, students, and curriculum.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/lms/courses/create" className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>New Course</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Enrollments"
            columns={enrollmentColumns}
            data={statsData?.recentActivity || []}
            searchPlaceholder="Search students or courses..."
            actions={
              <Link href="/admin/lms/enrollments" className="text-[#8b5cf6] text-sm font-bold hover:underline">
                View All
              </Link>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">LMS Management</h2>
            <BarChart3 size={20} className="text-[#8b5cf6]" />
          </div>

          <div className="space-y-4">
            {[
              { label: "Manage Courses", href: "/admin/lms/courses", icon: BookOpen },
              { label: "Student List", href: "/admin/lms/students", icon: Users },
              { label: "Enrollment Logs", href: "/admin/lms/enrollments", icon: UserCheck },
            ].map((item: any, i) => (
              <Link key={i} href={item.href} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-[#f5f3ff] group transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#8b5cf6] shadow-sm transition-all">
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


