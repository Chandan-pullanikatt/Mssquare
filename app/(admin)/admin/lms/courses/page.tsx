"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search,
  BookMarked,
  Layers,
  Clock,
  ExternalLink,
  Settings as SettingsIcon,
  FileCode,
  Pencil
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api/admin";
import DataTable from "@/components/cms-admin/DataTable";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCourses();
      setCourses(data || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    try {
      await adminApi.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete course", err);
      alert("Failed to delete course. It might have active enrollments.");
    }
  };

  const columns = [
    {
      header: "Course Info",
      accessor: "title",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0 overflow-hidden border border-purple-100 shadow-sm">
            {row.thumbnail ? (
              <img src={row.thumbnail} alt={val} className="w-full h-full object-cover" />
            ) : (
              <BookMarked size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{val}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <Layers size={10} /> {row.category} • <Clock size={10} /> {row.duration || "N/A"}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Price",
      accessor: "price",
      render: (val: number) => (
        <span className="font-bold text-gray-900">${val.toFixed(2)}</span>
      )
    },
    {
      header: "Level",
      accessor: "level",
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          val === 'Beginner' ? 'bg-green-50 text-green-600' :
          val === 'Intermediate' ? 'bg-blue-50 text-blue-600' :
          'bg-orange-50 text-orange-600'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Date Created",
      accessor: "created_at",
      render: (val: string) => (
        <span className="text-gray-500 font-medium text-sm">
          {new Date(val).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
          <Link 
            href={`/courses/${row.id}`}
            target="_blank"
            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            title="View Course"
          >
            <ExternalLink size={18} />
          </Link>
          <Link 
            href={`/admin/lms/courses/${row.id}/edit`}
            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            title="Edit Info"
          >
            <Pencil size={18} />
          </Link>
          <Link 
            href={`/admin/lms/courses/${row.id}/manage`}
            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-all"
            title="Manage Content"
          >
            <FileCode size={18} />
          </Link>
          <button 
            onClick={() => handleDelete(id)}
            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
            title="Delete Course"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Manage Courses
            <span className="text-sm font-bold bg-purple-100 text-purple-600 px-3 py-1 rounded-full">{courses.length} Total</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Create, edit, and manage your academy curriculum.</p>
        </div>
        
        <Link 
          href="/admin/lms/courses/create" 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-3xl font-bold shadow-xl shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} />
          <span>New Course</span>
        </Link>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          title="Academy Courses"
          columns={columns}
          data={courses}
          searchPlaceholder="Filter courses by name, level..."
          isLoading={loading}
          actions={
            <div className="flex items-center gap-2">
               {/* Optional filters can go here */}
            </div>
          }
        />
      </div>

      {/* Quick Tips or Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-100">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
             <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Curriculum Growth</h3>
          <p className="text-blue-50 font-medium text-sm">You have added {courses.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} courses this month. Keep it up!</p>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1">Upcoming Feature</span>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Course Bundles</h3>
          <p className="text-gray-400 font-medium text-sm">Coming soon: Group multiple courses into specialized learning paths.</p>
        </div>

        <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">LMS Tip</span>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Rich Content</h3>
          <p className="text-gray-400 font-medium text-sm">Add clear descriptions and high-quality thumbnails to increase enrollment rates.</p>
        </div>
      </div>
    </div>
  );
}


