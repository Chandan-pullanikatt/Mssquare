"use client";

import { UserCheck, Search, Filter, ArrowUpRight, GraduationCap } from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";

export default function EnrollmentManagement() {
  const enrollments = [
    { id: 1, student: "Alex Rivera", course: "UI/UX Masterclass", date: "Oct 12, 2025", progress: 85, status: "Active" },
    { id: 2, student: "Sarah Connor", course: "Fullstack Web Dev", date: "Oct 10, 2025", progress: 42, status: "Active" },
    { id: 3, student: "John Doe", course: "AI Fundamentals", date: "Oct 08, 2025", progress: 12, status: "Pending" },
    { id: 4, student: "Emily Blunt", course: "UI/UX Masterclass", date: "Oct 05, 2025", progress: 100, status: "Completed" },
  ];

  const columns = [
    {
      header: "Student",
      accessor: "student",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-100">
            {val.charAt(0)}
          </div>
          <span className="font-bold text-gray-900">{val}</span>
        </div>
      ),
    },
    { header: "Course", accessor: "course" },
    {
      header: "Progress",
      accessor: "progress",
      render: (val: number) => (
        <div className="flex items-center gap-3 min-w-[120px]">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${val === 100 ? 'bg-green-500' : 'bg-[#8b5cf6]'}`} 
              style={{ width: `${val}%` }} 
            />
          </div>
          <span className="text-xs font-bold text-gray-900">{val}%</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "Completed"
              ? "bg-green-50 text-green-600 border border-green-100"
              : val === "Active"
              ? "bg-blue-50 text-blue-600 border border-blue-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          }`}
        >
          {val}
        </span>
      ),
    },
    { header: "Date", accessor: "date" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Enrollments</h1>
          <p className="text-gray-500 font-medium">Track student progress and manage course access.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <UserCheck size={18} />
          <span>Manual Enroll</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={enrollments}
        searchPlaceholder="Filter enrollments..."
        actions={
          <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Filter size={16} />
            Filter by Course
          </button>
        }
      />
    </div>
  );
}


