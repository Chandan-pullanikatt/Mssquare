"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Loader2, 
  X, 
  Trash2,
  BookOpen,
  SearchCode,
  Edit2,
  MapPin
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { adminApi } from "@/lib/api/admin";

export default function TimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    course_id: "",
    instructor_id: "",
    title: "",
    description: "",
    day_of_week: "Monday",
    scheduled_at: "",
    start_time: "09:00",
    end_time: "10:00",
    location: ""
  });
  const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>([]);

  // Clear additional instructors if the primary instructor matches one of them
  useEffect(() => {
    if (formData.instructor_id && selectedInstructorIds.includes(formData.instructor_id)) {
      setSelectedInstructorIds(prev => prev.filter(id => id !== formData.instructor_id));
    }
  }, [formData.instructor_id, selectedInstructorIds]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [timetablesResult, coursesResult, instructorsResult] = await Promise.allSettled([
        adminApi.getTimetables(),
        adminApi.getCourses(),
        adminApi.getInstructors()
      ]);

      if (timetablesResult.status === 'fulfilled') setTimetables(timetablesResult.value);
      if (coursesResult.status === 'fulfilled') setCourses(coursesResult.value);
      if (instructorsResult.status === 'fulfilled') setInstructors(instructorsResult.value);

    } catch (err) {
      console.error("Critical failure during timetable data fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const submissionData = {
      ...formData,
      instructor_id: formData.instructor_id || null,
      scheduled_at: formData.scheduled_at || null
    };

    try {
      if (editingItem) {
        await adminApi.updateTimetable(editingItem.id, submissionData, selectedInstructorIds);
      } else {
        await adminApi.createTimetable(submissionData, selectedInstructorIds);
      }
      setShowAddModal(false);
      setEditingItem(null);
      setFormData({
        course_id: "",
        instructor_id: "",
        title: "",
        description: "",
        day_of_week: "Monday",
        scheduled_at: "",
        start_time: "09:00",
        end_time: "10:00",
        location: ""
      });
      setSelectedInstructorIds([]);
      fetchData();
    } catch (err: any) {
      console.error("Failed to save timetable", err);
      alert(err.message || "Failed to save timetable");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) return;
    try {
      await adminApi.deleteTimetable(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete timetable", err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      course_id: item.course_id,
      instructor_id: item.instructor_id || "",
      title: item.title,
      description: item.description || "",
      day_of_week: item.day_of_week || "Monday",
      scheduled_at: item.scheduled_at || "",
      start_time: item.start_time,
      end_time: item.end_time,
      location: item.location || ""
    });
    setSelectedInstructorIds(item.instructors?.map((i: any) => i.instructor_id) || []);
    setShowAddModal(true);
  };

  const timetableColumns = [
    {
      header: "Class Details",
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
      accessor: "day_of_week",
      render: (day: string, row: any) => (
        <div className="flex flex-col text-[11px] font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {day} {row.scheduled_at && `(${row.scheduled_at})`}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {row.start_time} - {row.end_time}
          </div>
        </div>
      )
    },
    {
      header: "Instructors",
      accessor: "instructor",
      render: (primary: any, row: any) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {primary && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold border border-blue-100">
              {primary.email?.split('@')[0]} (Lead)
            </span>
          )}
          {row.instructors?.map((inst: any, idx: number) => (
            <span key={idx} className="px-2 py-0.5 rounded-full bg-purple-50 text-[#8b5cf6] text-[9px] font-bold border border-purple-100">
              {inst.profile?.email?.split('@')[0]}
            </span>
          ))}
          {!primary && (!row.instructors || row.instructors.length === 0) && (
            <span className="text-[10px] text-gray-400 font-medium italic">Unassigned</span>
          )}
        </div>
      )
    },
    {
      header: "Location",
      accessor: "location",
      render: (loc: string) => (
        <div className="flex items-center gap-1 text-[11px] text-gray-500 max-w-[150px] truncate">
          <MapPin size={12} />
          {loc || "Online"}
        </div>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
           <button 
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Course Timetable</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manage recurring class schedules and instructors.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({
              course_id: "",
              instructor_id: "",
              title: "",
              description: "",
              day_of_week: "Monday",
              scheduled_at: "",
              start_time: "09:00",
              end_time: "10:00",
              location: ""
            });
            setShowAddModal(true);
          }}
          className="bg-[#8b5cf6] hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          title="Class Schedule"
          columns={timetableColumns}
          data={timetables}
          searchPlaceholder="Search timetable..."
        />
        {timetables.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Calendar size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No timetable entries found</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !submitting && setShowAddModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 flex-none">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {editingItem ? "Edit Timetable Entry" : "Add Timetable Entry"}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar flex-1">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class Title</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Intro to React"
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Instructor</label>
                <select 
                  required
                  value={formData.instructor_id}
                  onChange={(e) => setFormData({...formData, instructor_id: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>{instructor.email}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                <div className="relative group/date">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/date:text-[#8b5cf6] transition-colors flex items-center gap-2 pointer-events-none">
                      <Calendar size={18} />
                      {formData.scheduled_at && (
                        <span className="text-xs font-black text-[#8b5cf6] uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100/50">
                          {formData.day_of_week}
                        </span>
                      )}
                   </div>
                   <input 
                    required
                    type="date"
                    value={formData.scheduled_at || ""}
                    onChange={(e) => {
                      const dateVal = e.target.value;
                      if (!dateVal) {
                        setFormData({...formData, scheduled_at: "", day_of_week: ""});
                        return;
                      }
                      const [year, month, day] = dateVal.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                      setFormData({...formData, scheduled_at: dateVal, day_of_week: days[date.getDay()]});
                    }}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-[140px] pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all cursor-pointer box-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Time</label>
                <input 
                  required
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Time</label>
                <input 
                  required
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-4 md:col-span-2 border-t border-gray-50 pt-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Instructors (Group Class)</label>
                
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value=""
                      onChange={(e) => {
                        const id = e.target.value;
                        if (id && !selectedInstructorIds.includes(id)) {
                          setSelectedInstructorIds(prev => [...prev, id]);
                        }
                      }}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Add Additional Instructor...</option>
                      {instructors
                        .filter(i => i.id !== formData.instructor_id && !selectedInstructorIds.includes(i.id))
                        .map(instructor => (
                          <option key={instructor.id} value={instructor.id}>{instructor.email}</option>
                        ))
                      }
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Plus size={18} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[40px] p-1">
                    {selectedInstructorIds.map(id => {
                      const instructor = instructors.find(i => i.id === id);
                      if (!instructor) return null;
                      return (
                        <div 
                          key={id} 
                          className="flex items-center gap-2 bg-purple-50 text-[#8b5cf6] px-3 py-1.5 rounded-xl border border-purple-100 text-xs font-bold animate-in zoom-in-95 duration-200"
                        >
                          <span className="truncate max-w-[150px]">{instructor.email}</span>
                          <button 
                            type="button"
                            onClick={() => setSelectedInstructorIds(prev => prev.filter(i => i !== id))}
                            className="hover:bg-purple-200 rounded-lg p-0.5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                    {selectedInstructorIds.length === 0 && (
                      <p className="text-[11px] text-gray-400 italic ml-1 mt-2">No additional instructors selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / link</label>
                <input 
                  type="text"
                  placeholder="e.g. Zoom Link or Room 402"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#8b5cf6] text-white py-4 rounded-3xl font-bold shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingItem ? <Edit2 size={18} /> : <Plus size={18} />)}
                  {editingItem ? "Update Timetable Entry" : "Create Timetable Entry"}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
