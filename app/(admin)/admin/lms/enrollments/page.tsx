"use client";

import { Enrollment } from "@/types/database";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { 
  UserCheck, 
  Search, 
  Filter, 
  BookOpen, 
  Calendar,
  Loader2,
  Mail,
  GraduationCap,
  Plus
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { EnrollStudentModal } from "@/components/cms-admin/EnrollStudentModal";

export default function EnrollmentLogsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
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
      accessor: "studentEmail",
      render: (email: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#8b5cf6] text-xs font-bold font-heading">
            {email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">{email?.split('@')[0]}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Course",
      accessor: "course",
      render: (title: string) => (
        <div className="flex items-center gap-2.5 text-gray-700">
          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/5 flex items-center justify-center text-[#8b5cf6]">
            <BookOpen size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight">{title || "Unknown Course"}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (status: string) => (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          <div className={`w-1 h-1 rounded-full mr-2 ${status === 'Active' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
          {status}
        </div>
      )
    },
    {
      header: "Date",
      accessor: "date",
      render: (date: string) => (
        <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold">
          <Calendar size={14} className="text-gray-300" />
          {date}
        </div>
      )
    }
  ];

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Enrollment Logs</h1>
        <p className="text-gray-500 font-medium">Monitor real-time course enrollments across your platform.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          title="Recent Activity"
          columns={columns}
          data={enrollments}
          searchPlaceholder="Search by student email or course..."
          actions={
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#8b5cf6] text-white px-6 py-3 rounded-2xl font-bold hover:-translate-y-1 transition-all shadow-lg shadow-[#8b5cf6]/20 active:scale-95"
            >
              <Plus size={18} />
              Enroll Student
            </button>
          }
        />
        {enrollments.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-bold">No enrollment records found.</p>
          </div>
        )}
      </div>

      <EnrollStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEnrollments}
      />
    </div>
  );
}
