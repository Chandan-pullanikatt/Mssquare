"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Mail, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Course } from "@/types/database";

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnrollStudentModal({ isOpen, onClose, onSuccess }: EnrollStudentModalProps) {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      // Reset state when opening
      setEmail("");
      setCourseId("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    setFetchingCourses(true);
    try {
      const data = await adminApi.getCourses();
      setCourses(data || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setFetchingCourses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !courseId) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Check if user exists
      const user = await adminApi.getUserByEmail(email);

      if (!user) {
        setError(`Student not found. Please ask the student to create an account using "${email}" first.`);
        setLoading(false);
        return;
      }

      // 2. Perform enrollment
      // Use explicit type cast to any to resolve property 'id' does not exist on type 'never'
      await adminApi.manualEnroll((user as any).id, courseId);
      
      setSuccess(true);
      
      // Close after a short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to enroll student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6] flex items-center justify-center text-white shadow-lg shadow-[#8b5cf6]/20">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-none">Manual Enrollment</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
                Add existing student to course
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
            <X size={20} className="text-gray-400 group-hover:text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          {success ? (
            <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Enrollment Successful!</h3>
              <p className="text-gray-500">The student will now see this course in their portal.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex gap-3 text-rose-600 text-sm animate-in slide-in-from-top-2">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Student Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Select Course
                  </label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
                    <select
                      required
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      disabled={fetchingCourses}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="">{fetchingCourses ? "Loading courses..." : "Choose a course"}</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit"
                  disabled={loading || fetchingCourses}
                  className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    "Confirm Enrollment"
                  )}
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
