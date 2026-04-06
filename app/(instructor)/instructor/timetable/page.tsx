"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  Loader2, 
  MapPin,
  BookOpen,
  Users
} from "lucide-react";
import { coursesApi } from "@/lib/api/courses";
import { useAuth } from "@/components/providers/AuthProvider";

export default function InstructorTimetablePage() {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTimetable();
    }
  }, [user?.id]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const data = await coursesApi.getTimetables();
      setTimetables(data);
    } catch (err) {
      console.error("Failed to fetch instructor timetable", err);
    } finally {
      setLoading(false);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading your teaching schedule...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Teaching Timetable</h1>
          <p className="text-gray-500 font-medium">View your assigned classes and course schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {days.map(day => {
          const dayClasses = timetables.filter(t => t.day_of_week === day);
          return (
            <div key={day} className="space-y-4">
              <div className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{day}</span>
              </div>
              
              <div className="space-y-3">
                {dayClasses.length > 0 ? (
                  dayClasses.map((item, i) => (
                    <div 
                      key={i} 
                      className="group bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1 truncate">
                            {item.course?.title}
                          </p>
                          <h4 className="text-sm font-bold text-gray-900 leading-tight">
                            {item.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                            <Clock size={12} className="text-gray-400" />
                            {item.start_time} - {item.end_time}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                             {item.instructor && (
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-blue-100">
                                <Users size={10} />
                                {item.instructor.email?.split('@')[0]} (Lead)
                              </div>
                            )}
                            {item.instructors?.map((inst: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-1 bg-purple-50 text-[#8b5cf6] px-2 py-0.5 rounded-full text-[9px] font-bold border border-purple-100">
                                <Users size={10} />
                                {inst.profile?.email?.split('@')[0]}
                              </div>
                            ))}
                          </div>

                          {item.location && (
                            <div className="flex items-center gap-2 text-[11px] font-medium text-blue-600 mt-1 relative z-10">
                              <MapPin size={12} className="flex-shrink-0" />
                              {item.location.startsWith('http') ? (
                                <a 
                                  href={item.location} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="underline hover:text-blue-700 transition-colors font-bold truncate max-w-[150px]"
                                  title={item.location}
                                >
                                  Join Meeting
                                </a>
                              ) : (
                                <span className="truncate max-w-[120px]">{item.location}</span>
                              )}
                            </div>
                          )}
                          <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                               <Users size={12} className="text-gray-400" />
                               <span className="text-[10px] font-bold text-gray-400 uppercase">Class session</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No Classes</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {timetables.length === 0 && (
        <div className="py-20 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Calendar size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Schedule Assigned</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            You don't have any classes assigned to you in the timetable yet. Please contact the administrator for any queries.
          </p>
        </div>
      )}
    </div>
  );
}
