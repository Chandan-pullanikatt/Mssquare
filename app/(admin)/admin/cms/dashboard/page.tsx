"use client";

import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Award,
  FileText,
  Globe,
  ImageIcon,
  SearchCode
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/cms-admin/StatsCard";
import DataTable from "@/components/cms-admin/DataTable";
import { adminApi } from "@/lib/api/admin";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
      title: "Blog Posts",
      value: statsData?.totalBlogs || "0",
      trend: "+0",
      icon: FileText,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Leads",
      value: statsData?.totalLeads || "0",
      trend: "+0",
      icon: TrendingUp,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const enrollmentColumns = [
    {
      header: "Student",
      accessor: "users.name",
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
      accessor: "enrolled_at",
      render: (val: string) => new Date(val).toLocaleDateString()
    },
  ];

  const signupColumns = [
    {
      header: "User",
      accessor: "name",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-500">
            {val?.charAt(0) || "U"}
          </div>
          <span className="font-bold text-gray-900">{val || "New User"}</span>
        </div>
      ),
    },
    { 
      header: "Role", 
      accessor: "role",
      render: (val: string) => (
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
          {val}
        </span>
      )
    },
    { 
      header: "Joined", 
      accessor: "created_at",
      render: (val: string) => new Date(val).toLocaleDateString()
    },
  ];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/cms/blog/create" className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>Write Blog</span>
          </Link>
          <Link href="/admin/cms/courses/create" className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>Create Course</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <DataTable
          title="Recent Enrollments"
          columns={enrollmentColumns}
          data={statsData?.recentActivity || []}
          searchPlaceholder="Search enrollments..."
          actions={
            <Link href="/admin/cms/enrollments" className="text-[#8b5cf6] text-sm font-bold hover:underline">
              View All
            </Link>
          }
        />

        {/* Recent Signups */}
        <DataTable
          title="Recent Signups"
          columns={signupColumns}
          data={statsData?.recentSignups || []}
          searchPlaceholder="Search signups..."
          actions={
            <Link href="/admin/cms/users" className="text-[#8b5cf6] text-sm font-bold hover:underline">
              View All
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Website Management</h2>
            <TrendingUp size={20} className="text-[#8b5cf6]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Edit Landing Page", href: "/admin/cms/content/landing", icon: Globe },
              { label: "Manage Courses", href: "/admin/cms/courses", icon: BookOpen },
              { label: "Blog Management", href: "/admin/cms/blog", icon: FileText },
              { label: "Media Library", href: "/admin/cms/media", icon: ImageIcon },
              { label: "FAQ & Legal", href: "/admin/cms/faq-legal", icon: SearchCode },
              { label: "Leads & Contacts", href: "/admin/cms/leads", icon: Users },
              { label: "User Management", href: "/admin/cms/users", icon: Users },
              { label: "SEO & Settings", href: "/admin/cms/settings", icon: SearchCode },
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

        {/* System Health / Summary */}
        <div className="bg-[#8b5cf6] rounded-[2rem] p-8 text-white shadow-[0_20px_40px_rgba(139,92,246,0.2)]">
          <h2 className="text-xl font-bold mb-6">Business Summary</h2>
          <div className="space-y-6">
            <div>
              <div className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-1">Total Registered</div>
              <div className="text-3xl font-extrabold">{statsData?.totalUsers || 0}</div>
            </div>
            <div>
              <div className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-1">New Enrollments</div>
              <div className="text-3xl font-extrabold">{statsData?.totalEnrollments || 0}</div>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-purple-100 mb-4 leading-relaxed">
                Your platform is growing! You have {statsData?.totalLeads || 0} active leads waiting for response.
              </p>
              <Link href="/admin/cms/leads" className="w-full py-3 bg-white text-[#8b5cf6] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-50 transition-all">
                Handle Leads
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


