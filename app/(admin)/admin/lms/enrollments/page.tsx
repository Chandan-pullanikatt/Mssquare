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
  GraduationCap
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";

export default function EnrollmentLogsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await adminApi.getStudents(); // Reusing students data which includes enrollments
        // Flatten enrollments from students
        const allEnrollments = data.flatMap((student: any) => 
          (student.student_enrollments || []).map((e: any) => ({
            ...e,
            student_email: student.email,
            created_at: student.created_at // Fallback if enrollment date is missing
          }))
        ).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setEnrollments(allEnrollments);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const columns = [
    {
      header: "Student",
      accessor: "student_email",
      render: (email: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#8b5cf6] text-xs font-bold">
            {email?.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-gray-900">{email}</span>
        </div>
      )
    },
    {
      header: "Course",
      accessor: "courses.title",
      render: (title: string) => (
        <div className="flex items-center gap-2 text-gray-700">
          <BookOpen size={16} className="text-[#8b5cf6]" />
          <span className="font-medium">{title || "Unknown Course"}</span>
        </div>
      )
    },
    {
      header: "Date",
      accessor: "created_at",
      render: (date: string) => (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={14} />
          {new Date(date).toLocaleDateString()}
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
    </div>
  );
}
