"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Rocket, 
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  Terminal,
  PenTool
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/courses/CourseCard";
import { CoursesNavbar } from "@/components/layout/CoursesNavbar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

// Local Course Images
const images = {
  ai: "/assets/courses/ArtificialIntelligence.jpg",
  ml: "/assets/courses/machinelearning.jpg",
  data: "/assets/courses/dataanalytics.jpg",
  cyber: "/assets/courses/cybersecurity.jpg",
  cloud: "/assets/courses/cloudcomputing.jpg",
  web: "/assets/courses/webdevelopment.jpg",
  marketing: "/assets/courses/digitalmarketing.jpg",
  hr: "/assets/courses/humanresources.jpg",
  autocad: "/assets/courses/autocad.jpg",
  car: "/assets/courses/cardesign.jpg"
};

const subjects = [
  { id: "ai", name: "Artificial Intelligence", category: "AI", level: "Intermediate", desc: "Learn how to build intelligent systems using machine learning, neural networks, and natural language processing.", img: images.ai },
  { id: "ml", name: "Machine Learning", category: "AI", level: "Advanced", desc: "Master the algorithms that power modern technology, from predictive models to advanced computer vision.", img: images.ml },
  { id: "data", name: "Data Analytics", category: "Data", level: "Beginner", desc: "Transform raw data into meaningful insights using powerful tools like SQL, Python, and Tableau.", img: images.data },
  { id: "cyber", name: "Cyber Security", category: "Tech", level: "Intermediate", desc: "Defend systems against sophisticated cyber threats and master the art of ethical hacking.", img: images.cyber },
  { id: "cloud", name: "Cloud Computing", category: "Tech", level: "Intermediate", desc: "Build scalable and secure infrastructure using leading cloud platforms like AWS and Azure.", img: images.cloud },
  { id: "web", name: "Web Development", category: "Development", level: "Beginner", desc: "Build modern, responsive, and high-performance websites from scratch using the latest web technologies.", img: images.web },
  { id: "marketing", name: "Digital Marketing", category: "Business", level: "Beginner", desc: "Grow brands online through SEO, content strategy, social media, and data-driven advertising.", img: images.marketing },
  { id: "hr", name: "Human Resources", category: "Business", level: "Beginner", desc: "Master people management, talent acquisition, and modern corporate HR strategies.", img: images.hr },
  { id: "autocad", name: "AutoCAD", category: "Design", level: "Intermediate", desc: "Master architectural and engineering drawings with industry-standard 2D and 3D modeling tools.", img: images.autocad },
  { id: "car", name: "Car Designing", category: "Design", level: "Advanced", desc: "Learn the fundamentals of automotive design, from conceptual sketching to digital surfacing.", img: images.car }
];

const programTypes = [
  { id: "Certification", price: 7999, modules: 12, label: "Certification Mastery" },
  { id: "Mentorship", price: 4999, modules: 18, label: "Global Mentorship" },
  { id: "Placement", price: 80000, modules: 24, label: "Placement Guarantee" }
];

const categories = [
  { id: "Certification", title: "Certification Programs", desc: "Industry-recognized certificates to boost your career.", img: "/assets/courses/mentorship.png", color: "from-blue-500 to-indigo-600" },
  { id: "Mentorship", title: "Mentorship Programs", desc: "One-on-one guidance from industry professionals.", img: "/assets/courses/placement.png", color: "from-purple-500 to-pink-600" },
  { id: "Placement", title: "Placement Programs", desc: "Job-guaranteed training for top-tier companies.", img: "/assets/courses/internship.png", color: "from-emerald-500 to-teal-600" }
];

// Generate courses (only for internal ref if needed, but we'll filter by category now)
const coursesData = programTypes.flatMap(pt => subjects.map(s => ({
  id: `${pt.id}-${s.id}`,
  title: `${s.name} ${pt.id === 'Certification' ? 'Certification' : pt.id === 'Mentorship' ? 'Mastery' : 'Professional'}`,
  programType: pt.id as "Certification" | "Mentorship" | "Placement",
  image: s.img,
  description: s.desc,
  modules: pt.modules,
  level: s.level as "Beginner" | "Intermediate" | "Advanced",
  price: pt.price,
  category: s.category
})));


import { coursesApi } from "@/lib/api/courses";
import { Course } from "@/types/database";

// ... images mapping remains for fallback/initial icon mapping ...

import { useSearch } from "@/components/providers/SearchProvider";

export function CoursesContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const [activeProgram, setActiveProgram] = useState<string>(typeParam || "None");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const { searchQuery, setSearchQuery } = useSearch();
  const [liveCourses, setLiveCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    
    async function fetchCourses() {
      try {
        const data = await coursesApi.getCourses();
        setLiveCourses(data);
        hasFetched.current = true;
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (typeParam) {
      setActiveProgram(typeParam);
    } else {
      setActiveProgram("None");
    }
  }, [typeParam]);

  const filteredCourses = useMemo(() => {
    return liveCourses.filter(course => {
      const matchProgram = activeProgram === "All" || course.category === activeProgram; // Map category to activeProgram (Certification/Mentorship/Placement)
      const matchCategory = activeCategory === "All" || (course as any).tech_category === activeCategory; // Assuming tech_category is a field or just filter by title
      const matchLevel = activeLevel === "All" || course.level === activeLevel;
      const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (course.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchProgram && matchCategory && matchLevel && matchSearch;
    });
  }, [activeProgram, activeCategory, activeLevel, searchQuery, liveCourses]);

  return (
    <div className="bg-[#f8f9fb] min-h-screen font-sans">
      <CoursesNavbar />
      
      {/* Hero Section */}
      <section className="relative bg-[#06070a] pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden" style={{ paddingTop: "calc(1.5rem + 70px)" }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-[#7C3AED]/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#3B82F6]/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[#06070a] opacity-[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[#7C3AED] text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} fill="currentColor" />
            <span>Future-Ready Education</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-black text-white mb-6 lg:mb-8 font-heading tracking-tight"
          >
            Explore Our <span className="text-[#7C3AED]">Courses</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-12"
          >
            Gain industry-ready skills through expert-designed certification, mentorship, and placement programs tailored for the digital age.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6"
          >
            <button 
               onClick={() => setActiveProgram("Certification")}
               className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-sm lg:text-base rounded-2xl shadow-2xl shadow-[#7C3AED]/30 transition-all flex items-center justify-center gap-3 group"
            >
              Browse Certification Programs
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
               onClick={() => setActiveProgram("Placement")}
               className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-5 bg-white/5 hover:bg-white/10 text-white font-black text-sm lg:text-base rounded-2xl border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-3"
            >
              Browse Placement Programs
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filter Section */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 lg:py-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
            {["All", "Certification", "Mentorship", "Placement"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  if (type === "All" || type === "None") {
                    params.delete("type");
                  } else {
                    params.set("type", type);
                  }
                  router.push(`/courses${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
                }}
                className={`flex-shrink-0 px-5 lg:px-6 py-2.5 rounded-full text-xs lg:text-sm font-black transition-all ${
                  activeProgram === type 
                  ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/20" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {type === "All" ? "All Courses" : type}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <input 
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f9fb] border border-gray-200 rounded-full py-2.5 lg:py-3 pl-12 pr-6 text-sm focus:ring-4 focus:ring-[#7C3AED]/5 focus:border-[#7C3AED] outline-none transition-all placeholder:text-gray-400 font-bold"
              />
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-[#f8f9fb] border border-gray-200 rounded-full py-2.5 lg:py-3 px-6 text-sm font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/5 transition-all appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJncmF5IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-[length:20px_20px] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="All">All Categories</option>
                <option value="AI">AI & ML</option>
                <option value="Data">Data Science</option>
                <option value="Tech">Tech Infrastructure</option>
                <option value="Development">Development</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
              </select>

              <select 
                value={activeLevel}
                onChange={(e) => setActiveLevel(e.target.value)}
                className="bg-[#f8f9fb] border border-gray-200 rounded-full py-2.5 lg:py-3 px-6 text-sm font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/5 transition-all appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJncmF5IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-[length:20px_20px] bg-[right_15px_center] bg-no-repeat"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section or Category Selector */}
      {activeProgram === "None" ? (
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 font-heading">
              Choose Your <span className="text-[#7C3AED]">Path</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Select a category to explore our specialized programs. We've organized our courses to help you find the perfect fit for your career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -10 }}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("type", cat.id);
                  router.push(`/courses?${params.toString()}`, { scroll: false });
                }}
                className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-black/5 flex flex-col h-[500px]"
              >
                <div className="h-2/3 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 group-hover:opacity-40 transition-opacity z-10`}></div>
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
                  <div className="absolute bottom-6 left-8 right-8 z-30">
                    <h3 className="text-2xl font-black text-white font-heading">{cat.title}</h3>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1 justify-between">
                  <p className="text-gray-500 font-medium">{cat.desc}</p>
                  <div className="flex items-center gap-2 text-[#7C3AED] font-black group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                    <span>Explore Products</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <section className="py-12 lg:py-20 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => {
                router.push("/courses", { scroll: false });
              }}
              className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#7C3AED] transition-colors"
            >
              <ChevronDown className="rotate-90" size={20} />
              Back to Path Selection
            </button>
            <div className="text-sm font-bold text-gray-400">
              Showing {filteredCourses.length} programs in <span className="text-gray-900">{activeProgram}</span>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              >
                {filteredCourses.map((course) => (
                  <CourseCard 
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    programType={course.category as any}
                    image={course.thumbnail || "/assets/courses/ArtificialIntelligence.jpg"}
                    description={course.description || ""}
                    modules={12} // Fallback or fetch from module count
                    level={course.level}
                    price={course.price}
                    category={course.category}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 font-heading">No courses found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => { setActiveProgram("All"); setActiveCategory("All"); setActiveLevel("All"); setSearchQuery(""); }}
                  className="mt-6 text-[#7C3AED] font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 lg:py-32 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-10 lg:p-20 text-center shadow-2xl shadow-[#7C3AED]/40">
          <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl">
            <Sparkles size={200} fill="white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 font-heading leading-tight">
              Start Your Learning<br className="hidden lg:block" /> Journey Today
            </h2>
            <p className="text-white/80 text-lg lg:text-xl font-medium mb-10 max-w-2xl mx-auto">
              Join thousands of students building their careers with MSsquare Technologies. Unlock your potential with global experts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
              <button 
                onClick={() => {
                  if (user) {
                    router.push("/courses");
                  } else {
                    router.push("/auth");
                  }
                }}
                className="w-full sm:w-auto px-10 py-5 bg-white text-[#7C3AED] font-black rounded-2xl shadow-xl hover:scale-105 transition-all"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center text-gray-400 font-bold">Loading Courses...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
