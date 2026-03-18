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
  UserPlus,
  Plus,
  CheckCircle2,
  X,
  GraduationCap
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { adminApi } from "@/lib/api/admin";

export default function InstructorManagementPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instructorsData, coursesData] = await Promise.all([
        adminApi.getInstructors(),
        adminApi.getCourses()
      ]);
      setInstructors(instructorsData);
      setCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch instructor management data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.addInstructor(email);
      setEmail("");
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      console.error("Failed to add instructor", err);
      alert("Failed to add instructor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedInstructor) return;
    setSubmitting(true);
    try {
      await adminApi.assignCourseToInstructor(selectedCourseId, selectedInstructor.id);
      setSelectedCourseId("");
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      console.error("Failed to assign course", err);
      alert("Failed to assign course");
    } finally {
      setSubmitting(false);
    }
  };

  const instructorColumns = [
    {
      header: "Instructor",
      accessor: "email",
      render: (email: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold uppercase">
            {email?.charAt(0)}
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
      header: "Assigned Courses",
      accessor: "courses",
      render: (assignedCourses: any[]) => (
        <div className="flex flex-wrap gap-2">
          {assignedCourses && assignedCourses.length > 0 ? (
            assignedCourses.slice(0, 2).map((c: any, i: number) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-bold border border-gray-100">
                {c.title}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
          {assignedCourses && assignedCourses.length > 2 && (
            <span className="text-[10px] text-gray-400 font-bold">+{assignedCourses.length - 2} more</span>
          )}
        </div>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string, row: any) => (
        <button 
          onClick={() => {
            setSelectedInstructor(row);
            setShowAssignModal(true);
          }}
          className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6] hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl transition-all"
        >
          Assign Course
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Instructor Management</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manage your faculty and their course assignments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#8b5cf6] hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-purple-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Add Instructor</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Users size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Instructors</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">{instructors.length}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b5cf6] mb-4 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all">
            <BookOpen size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Assigned Courses</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {instructors.reduce((acc, i) => acc + (i.courses?.length || 0), 0)}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-all">
            <CheckCircle2 size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Faculty</div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">
            {instructors.filter(i => i.courses?.length > 0).length}
          </div>
        </div>
      </div>

      {/* Instructor List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <DataTable
          title="All Instructors"
          columns={instructorColumns}
          data={instructors}
          searchPlaceholder="Search instructors by name or email..."
        />
        {instructors.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No instructors found</p>
          </div>
        )}
      </div>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !submitting && setShowAddModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Add Instructor</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddInstructor} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="email"
                    placeholder="instructor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#8b5cf6] text-white py-4 rounded-3xl font-bold shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Add Instructor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assign Course Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !submitting && setShowAssignModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Assign Course</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase">To: {selectedInstructor?.email}</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAssignCourse} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Course</label>
                <select 
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#8b5cf6] text-white py-4 rounded-3xl font-bold shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                Assign Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
