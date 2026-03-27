"use client";

import { UserCheck, Search, Filter, ArrowUpRight, GraduationCap } from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api/admin";

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const columns = [
    {
      header: "Student",
      accessor: "student",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-600 border border-orange-100">
            {val?.charAt(0) || "S"}
          </div>
          <div>
            <span className="font-bold text-gray-900 block leading-none mb-1">{val}</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{row.studentEmail}</span>
          </div>
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 italic">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Accessing Student Directory...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
          <GraduationCap size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No enrollments yet</h3>
          <p className="text-gray-500 text-sm mb-6">When students enroll in courses, they will appear here.</p>
          <button 
            onClick={fetchEnrollments}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-all"
          >
            Refresh Data
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
}


