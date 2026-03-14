"use client";

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
  Award
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/admin/StatsCard";
import DataTable from "@/components/admin/DataTable";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,284",
      trend: "+12%",
      icon: GraduationCap,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Instructors",
      value: "48",
      trend: "+4",
      icon: Users,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Courses",
      value: "156",
      trend: "+8%",
      icon: BookOpen,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      trend: "+18%",
      icon: DollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const recentEnrollments = [
    {
      id: 1,
      student: "Sarah Connor",
      course: "UI/UX Masterclass",
      date: "2 hours ago",
      status: "Successful",
      amount: "$199",
    },
    {
      id: 2,
      student: "John Doe",
      course: "Fullstack Web Dev",
      date: "5 hours ago",
      status: "Successful",
      amount: "$249",
    },
    {
      id: 3,
      student: "Emily Blunt",
      course: "AI Fundamentals",
      date: "1 day ago",
      status: "Pending",
      amount: "$150",
    },
  ];

  const enrollmentColumns = [
    {
      header: "Student",
      accessor: "student",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
            {val.charAt(0)}
          </div>
          <span className="font-bold text-gray-900">{val}</span>
        </div>
      ),
    },
    { header: "Course", accessor: "course" },
    { header: "Date", accessor: "date" },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "Successful"
              ? "bg-green-50 text-green-600 border border-green-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          }`}
        >
          {val}
        </span>
      ),
    },
    { header: "Amount", accessor: "amount" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>Add Instructor</span>
          </button>
          <button className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={18} />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enrollments */}
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Enrollments"
            columns={enrollmentColumns}
            data={recentEnrollments}
            searchPlaceholder="Search enrollments..."
            actions={
              <Link href="/admin/enrollments" className="text-[#8b5cf6] text-sm font-bold hover:underline">
                View All
              </Link>
            }
          />
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Platform Activity</h2>
            <TrendingUp size={20} className="text-[#8b5cf6]" />
          </div>

          <div className="space-y-8">
            {[
              {
                icon: CheckCircle2,
                color: "text-green-500",
                bg: "bg-green-50",
                title: "Course Published",
                desc: "Advanced React Patterns by Sarah Jenkins",
                time: "1 hour ago",
              },
              {
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "New Instructor Application",
                desc: "Michael Chen applied for Backend role",
                time: "3 hours ago",
              },
              {
                icon: Award,
                color: "text-orange-500",
                bg: "bg-orange-50",
                title: "Certificate Issued",
                desc: "UI Design certificate for Alex Rivera",
                time: "5 hours ago",
              },
              {
                icon: Clock,
                color: "text-purple-500",
                bg: "bg-purple-50",
                title: "System Update",
                desc: "Backend infrastructure optimized",
                time: "Yesterday",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div className="flex-1 border-b border-gray-50 pb-6 group-last:border-0 group-last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-3 rounded-2xl bg-gray-50 text-gray-500 font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
            <span>View All Activity</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
