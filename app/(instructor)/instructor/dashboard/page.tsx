'use client';

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp,
  Loader2,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInstructorData();
    }
  }, [user]);

  const fetchInstructorData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Fetch courses assigned to this instructor
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          student_enrollments (count)
        `)
        .eq('instructor_id', user.id);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);
    } catch (err) {
      console.error("Error fetching instructor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
    </div>
  );

  const totalStudents = courses.reduce((acc, course) => acc + (course.student_enrollments?.[0]?.count || 0), 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Here's an overview of your assigned courses and student engagement.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <BookOpen size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your Courses</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">{courses.length}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b5cf6] mb-4 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all">
            <Users size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Students</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">{totalStudents}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
            <TrendingUp size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Growth</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">+0%</div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Your Assigned Courses</h2>
          <Link href="/instructor/courses" className="text-sm font-bold text-[#8b5cf6] hover:underline flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Users size={12} /> {course.student_enrollments?.[0]?.count || 0} Students</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {course.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/instructor/courses/${course.id}`}
                  className="bg-gray-50 hover:bg-[#8b5cf6] hover:text-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm transition-all text-center"
                >
                  Manage Course
                </Link>
              </div>
            ))
          ) : (
            <div className="py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No courses assigned yet</p>
              <p className="text-sm text-gray-500 mt-2">Contact the LMS Admin to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
