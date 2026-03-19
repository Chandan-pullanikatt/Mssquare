"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  ExternalLink,
  BookOpen,
  Loader2,
  Users
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function InstructorSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('group_sessions')
        .select(`
          *,
          course:courses(title),
          instructors:group_session_instructors!inner(instructor_id)
        `)
        .eq('group_session_instructors.instructor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Group Sessions</h1>
        <p className="text-gray-500 font-medium tracking-tight">Your scheduled live classes and collaborative training sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b5cf6]">
                <Users size={24} />
              </div>
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                Upcoming
              </span>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{session.title}</h3>
            <p className="text-[11px] text-[#8b5cf6] font-bold uppercase tracking-tight mb-4 flex items-center gap-1">
              <BookOpen size={12} />
              {session.course?.title}
            </p>

            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                <Calendar size={18} className="text-gray-400" />
                {new Date(session.scheduled_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                <Clock size={18} className="text-gray-400" />
                {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes} minutes)
              </div>
            </div>

            {session.meeting_link && (
              <a 
                href={session.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                <Video size={18} />
                Join Session
                <ExternalLink size={14} className="opacity-50" />
              </a>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Calendar size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No sessions assigned to you yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
