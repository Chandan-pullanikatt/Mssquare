"use client";

import { useState, useEffect } from "react";
import { coursesApi } from "@/lib/api/courses";
import { Course } from "@/types/database";
import { BookOpen, ArrowRight, ChevronDown, Search, Sparkles } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ExploreCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("None");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "Certification", title: "Certification", count: 12, color: "bg-blue-500" },
    { id: "Mentorship", title: "Mentorship", count: 8, color: "bg-purple-500" },
    { id: "Placement", title: "Placement", count: 5, color: "bg-emerald-500" },
  ];

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await coursesApi.getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = (activeCategory === "None" ? courses : courses.filter(c => c.category === activeCategory))
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Explore Courses</h1>
          <p className="text-gray-500 font-medium">Discover new skills and advance your career path.</p>
        </div>
        <div className="relative w-full md:w-72">
          <input 
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-purple-500/5 outline-none transition-all shadow-sm font-bold"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {activeCategory === "None" && searchQuery === "" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-500/20 transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{cat.title}</h3>
              <p className="text-gray-500 font-medium mb-4">
                {courses.filter(c => c.category === cat.id).length} Programs Available
              </p>
              <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                <span>Browse Category</span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {setActiveCategory("None"); setSearchQuery("");}}
              className="flex items-center gap-2 text-gray-400 font-bold hover:text-purple-600 transition-colors"
            >
              <ChevronDown className="rotate-90" size={18} />
              Back to Categories
            </button>
            <div className="text-sm font-bold text-gray-400">
              Showing {filteredCourses.length} results
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  programType={course.category as any}
                  image={course.thumbnail || "/assets/courses/ArtificialIntelligence.jpg"}
                  description={course.description || ""}
                  modules={12}
                  level={course.level}
                  price={course.price}
                  category={course.category}
                />
              ))}
              {filteredCourses.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 italic text-gray-400 font-medium">
                  No courses match your criteria yet.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
