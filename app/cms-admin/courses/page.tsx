"use client";

import { Plus, Layout, MoreHorizontal, BookOpen, Layers, Trash2, Globe } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { coursesApi } from "@/lib/api/courses";
import { seedDatabase } from "@/lib/seed";
import { Course } from "@/types/database";

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await coursesApi.getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await coursesApi.deleteCourse(id);
        setCourses(courses.filter(c => c.id !== id));
        alert("Course deleted successfully.");
      } catch (err: any) {
        console.error(err);
        alert(`Failed to delete course: ${err.message}`);
      }
    }
  };

  const handleSeed = async () => {
    if (confirm("This will add initial courses to your database (AI, ML, Data, etc.). Continue?")) {
      const btn = document.getElementById('seed-btn');
      if (btn) {
        btn.innerText = "Seeding...";
        btn.setAttribute('disabled', 'true');
      }
      try {
        const count = await seedDatabase();
        if (btn) {
          btn.innerText = `Added ${count} courses`;
        }
        alert(`Successfully added ${count} courses! Refreshing...`);
        window.location.reload();
      } catch (err: any) {
        console.error(err);
        alert(`Seeding failed: ${err.message}`);
        if (btn) {
          btn.innerText = "Seed Failed (Check Console)";
          btn.removeAttribute('disabled');
        }
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Course Management</h1>
          <p className="text-gray-500 font-medium">Create, edit and manage your platform's educational content.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            id="seed-btn"
            onClick={handleSeed}
            className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Layers size={18} />
            Seed Initial Data
          </button>
          <Link href="/cms-admin/courses/create">
            <button className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Plus size={18} />
              <span>New Course</span>
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] group hover:shadow-xl hover:border-[#8b5cf6]/20 transition-all flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={course.thumbnail || "/assets/courses/ArtificialIntelligence.jpg"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-green-500/80 text-white">
                    {course.category}
                  </span>
                  <button 
                    onClick={() => handleDelete(course.id, course.title)}
                    className="p-2 rounded-lg bg-red-500/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#8b5cf6] transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Expert Instructor</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Program Cost</div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      ₹{course.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Level</div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5 capitalize">
                      {course.level}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Link href={`/cms-admin/courses/edit/${course.id}`} className="flex-1">
                    <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-[#8b5cf6] hover:text-white transition-all flex items-center justify-center gap-2">
                       Edit Course
                    </button>
                  </Link>
                  <Link href={`/courses/${course.id}`} target="_blank">
                    <button className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-900 transition-all">
                      <Globe size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Create Placeholder */}
          <Link href="/cms-admin/courses/create" className="border-4 border-dashed border-gray-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group hover:border-[#8b5cf6]/30 transition-all hover:bg-purple-50/10 h-full min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all">
              <Plus size={32} />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Create New Product</h4>
            <p className="text-xs text-gray-400 font-medium">Build modern curricula for your students</p>
          </Link>
        </div>
      )}
    </div>
  );
}
