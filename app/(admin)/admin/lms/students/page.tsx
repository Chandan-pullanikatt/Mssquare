"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  BookOpen, 
  Calendar,
  Loader2,
  GraduationCap
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { adminApi } from "@/lib/api/admin";

export default function StudentManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, statsData] = await Promise.all([
        adminApi.getStudents(),
        adminApi.getCourseStats()
      ]);
      setStudents(studentsData);
      setCourseStats(statsData);
    } catch (err) {
      console.error("Failed to fetch student management data", err);
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    {
      header: "Student",
      accessor: "email",
      render: (email: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#8b5cf6] font-bold">
            {email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 line-clamp-1">{email?.split('@')[0]}</span>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Mail size={12} />
              {email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Enrolled Courses",
      accessor: "student_enrollments",
      render: (enrollments: any[]) => (
        <div className="flex flex-wrap gap-2">
          {enrollments && enrollments.length > 0 ? (
            enrollments.slice(0, 2).map((e: any, i: number) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-bold border border-gray-100">
                {e.courses?.title}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
          {enrollments && enrollments.length > 2 && (
            <span className="text-[10px] text-gray-400 font-bold">+{enrollments.length - 2} more</span>
          )}
        </div>
      )
    },
    {
      header: "Joined On",
      accessor: "created_at",
      render: (date: string) => (
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
          <Calendar size={14} />
          {new Date(date).toLocaleDateString()}
        </div>
      )
    }
  ];

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Student Management</h1>
        <p className="text-gray-500 font-medium">Track your students, their enrollments, and course density.</p>
      </div>

      {/* Course Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseStats.map((course) => (
          <div key={course.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollments</div>
                <div className="text-2xl font-black text-gray-900">{course.enrollment_count}</div>
              </div>
            </div>
            <h3 className="text-sm font-bold text-gray-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          title="All Students"
          columns={studentColumns}
          data={students}
          searchPlaceholder="Search students by email..."
        />
        {students.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-bold">No students found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}


