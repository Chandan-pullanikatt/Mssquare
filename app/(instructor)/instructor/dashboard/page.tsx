'use client';

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp,
  Loader2,
  ChevronRight,
  GraduationCap,
  Calendar,
  MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { coursesApi } from "@/lib/api/courses";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
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

      // Fetch timetable data
      const timetables = await coursesApi.getTimetables();
      const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
      
      // Filter for today's classes
      const today = timetables.filter((t: any) => t.day_of_week === currentDay);
      setTodayClasses(today);

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

      {/* Teaching Schedule Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Your Teaching Schedule (Today)</h2>
          <Link href="/instructor/timetable" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View Full Timetable <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayClasses.length > 0 ? (
            todayClasses.map((item, i) => (
              <div 
                key={i} 
                className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 truncate">
                      {item.course?.title}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3.5rem]">
                      {item.title}
                    </h3>
                  </div>

                  <div className="space-y-2 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Clock size={14} className="text-blue-500" />
                      {item.start_time} - {item.end_time}
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 relative z-10 w-full">
                        <MapPin size={14} className="flex-shrink-0" />
                        {item.location.startsWith('http') ? (
                          <a 
                            href={item.location} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline hover:text-blue-700 transition-colors font-bold truncate flex-1"
                            title={item.location}
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <span className="truncate flex-1">{item.location}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 py-12 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Calendar size={32} />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No sessions scheduled for today</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Enjoy your day or catch up on grading!</p>
            </div>
          )}
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
