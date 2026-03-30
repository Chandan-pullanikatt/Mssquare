"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  Loader2, 
  X, 
  Trash2,
  BookOpen,
  SearchCode
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { adminApi } from "@/lib/api/admin";

export default function GroupSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    course_id: "",
    title: "",
    description: "",
    scheduled_at: "",
    duration_minutes: 60,
    meeting_link: ""
  });
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data independently so one error doesn't block others
      const [sessionsResult, coursesResult, instructorsResult] = await Promise.allSettled([
        adminApi.getGroupSessions(),
        adminApi.getCourses(),
        adminApi.getInstructors()
      ]);

      if (sessionsResult.status === 'fulfilled') setSessions(sessionsResult.value);
      else console.error("Failed to fetch sessions:", sessionsResult.reason);

      if (coursesResult.status === 'fulfilled') setCourses(coursesResult.value);
      else console.error("Failed to fetch courses:", coursesResult.reason);

      if (instructorsResult.status === 'fulfilled') setInstructors(instructorsResult.value);
      else console.error("Failed to fetch instructors:", instructorsResult.reason);

    } catch (err) {
      console.error("Critical failure during session data fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.createGroupSession(formData, selectedInstructorIds);
      setShowAddModal(false);
      setFormData({
        course_id: "",
        title: "",
        description: "",
        scheduled_at: "",
        duration_minutes: 60,
        meeting_link: ""
      });
      setSelectedInstructorIds([]);
      fetchData();
    } catch (err: any) {
      console.error("Failed to create session", err);
      alert(err.message || "Failed to create session");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    try {
      await adminApi.deleteGroupSession(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const toggleInstructor = (id: string) => {
    setSelectedInstructorIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const sessionColumns = [
    {
      header: "Session Details",
      accessor: "title",
      render: (title: string, row: any) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-900">{title}</span>
          <span className="text-[11px] text-[#8b5cf6] font-bold uppercase tracking-tight">{row.course?.title}</span>
        </div>
      )
    },
    {
      header: "Schedule",
      accessor: "scheduled_at",
      render: (date: string, row: any) => (
        <div className="flex flex-col text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({row.duration_minutes}m)
          </div>
        </div>
      )
    },
    {
      header: "Instructors",
      accessor: "instructors",
      render: (sessionInstructors: any[]) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {sessionInstructors?.map((si: any, i: number) => {
            const displayName = si.profile?.email 
              ? si.profile.email.split('@')[0] 
              : `Instructor ${si.instructor_id.slice(0,4)}`;
            return (
              <span key={i} className="px-2 py-0.5 rounded-full bg-purple-50 text-[#8b5cf6] text-[10px] font-bold border border-purple-100 capitalize">
                {displayName}
              </span>
            );
          })}
        </div>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string) => (
        <button 
          onClick={() => handleDeleteSession(id)}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={18} />
        </button>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Group Sessions</h1>
          <p className="text-gray-500 font-medium tracking-tight">Schedule live training sessions with multiple faculty members.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#8b5cf6] hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Session</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          title="Scheduled Sessions"
          columns={sessionColumns}
          data={sessions}
          searchPlaceholder="Search sessions..."
        />
        {sessions.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <SearchCode size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No group sessions scheduled</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !submitting && setShowAddModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Schedule Group Session</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSession} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Session Title</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Advanced System Architecture Deep Dive"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Related Course</label>
                <select 
                  required
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Scheduled Date & Time</label>
                <input 
                  required
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-4 md:col-span-2 border-t border-gray-50 pt-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Instructors</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                  {instructors.map(instructor => (
                    <button
                      key={instructor.id}
                      type="button"
                      onClick={() => toggleInstructor(instructor.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        selectedInstructorIds.includes(instructor.id)
                          ? 'bg-purple-50 border-[#8b5cf6] text-[#8b5cf6]'
                          : 'bg-white border-gray-50 text-gray-500 hover:border-gray-100'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${selectedInstructorIds.includes(instructor.id) ? 'bg-[#8b5cf6]' : 'bg-gray-200'}`} />
                      <span className="text-xs font-bold truncate">{instructor.email}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meeting Link (Zoom/Google Meet)</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit" 
                  disabled={submitting || selectedInstructorIds.length === 0}
                  className="w-full bg-[#8b5cf6] text-white py-4 rounded-3xl font-bold shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Schedule Group Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
