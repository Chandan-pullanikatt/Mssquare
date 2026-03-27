"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Star, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Rocket, 
  Target, 
  ShieldCheck,
  ArrowRight,
  Sparkles,
  PlayCircle as PlayIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { coursesApi } from "@/lib/api/courses";
import { modulesApi } from "@/lib/api/modules";
import { Course, Module, Lesson } from "@/types/database";
import { CoursesNavbar } from "@/components/layout/CoursesNavbar";

export default function CourseDetailPage() {
  const params = useParams() as any;
  const id = params?.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const courseData = await coursesApi.getCourseById(id);
        const modulesData = await modulesApi.getModulesByCourse(id) as (Module & { lessons: Lesson[] })[];
        setCourse(courseData);
        setModules(modulesData);
        if (modulesData && modulesData.length > 0) {
          setExpandedModules([modulesData[0].id]);
        }
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <CoursesNavbar />
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-gray-300 mb-6">
          <BookOpen size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Course Not Found</h1>
        <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been moved.</p>
        <Link href="/student/explore" className="px-6 py-3 rounded-xl bg-[#8b5cf6] text-white font-bold hover:shadow-lg transition-all">
          Explore Courses
        </Link>
      </div>
    );
  }

  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(course.price);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#8b5cf6]/10">
      <CoursesNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-100/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-100/50 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Left Column: Content */}
            <div className="flex-1 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-[#8b5cf6] text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>{course.category} Program</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-[1.1] text-gray-900">
                {course.title}
              </h1>

              <p className="text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#8b5cf6]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Duration</div>
                    <div className="text-sm font-bold text-gray-900">{course.duration || "12 Weeks"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-500">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Certificate</div>
                    <div className="text-sm font-bold text-gray-900">Industry Recognized</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
                <Link 
                  href={`/student/payment/${id}`}
                  className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] bg-[#8b5cf6] text-white font-black text-xs md:text-sm uppercase tracking-wider hover:bg-[#7c3aed] hover:shadow-xl hover:shadow-[#8b5cf6]/25 transition-all group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Enroll Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center px-4 gap-2 sm:gap-0 border sm:border-0 border-gray-100 rounded-xl py-3 sm:py-0">
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Pricing</div>
                  <div className="text-2xl md:text-3xl font-black text-gray-900">{priceFormatted}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Image Card */}
            <div className="w-full lg:w-[450px] shrink-0 mt-8 lg:mt-0">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-blue-200 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl p-2 md:p-3">
                   <div className="h-56 md:h-80 relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                     {course.thumbnail ? (
                       <Image 
                         src={course.thumbnail} 
                         alt={course.title} 
                         fill 
                         className="object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                     ) : (
                       <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                         <BookOpen size={80} />
                       </div>
                     )}
                     <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/40 transition-colors flex items-center justify-center group">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 border border-white/40 shadow-xl">
                          <Play size={24} fill="white" />
                        </div>
                     </div>
                   </div>
                   <div className="p-6 md:p-8 space-y-4 md:space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-xs md:text-sm font-black text-gray-900 uppercase">Difficulty Level</div>
                        <div className="px-3 py-1 rounded-full bg-purple-50 text-[10px] font-black text-[#8b5cf6] uppercase tracking-wider">
                          {course.level}
                        </div>
                      </div>
                      <div className="h-[1px] bg-gray-100" />
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden relative shadow-sm">
                               <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User" fill />
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                           Over <span className="text-gray-900 font-black">1,200+</span> graduates<br/>from top companies
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Insights Column */}
            <div className="lg:col-span-7 space-y-12 md:space-y-16">
              {/* Overview */}
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-3 text-gray-900">
                  <div className="w-1 bg-[#8b5cf6] h-6 md:h-8 rounded-full" />
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Program Overview</h2>
                </div>
                <div className="text-gray-500 text-sm md:text-lg leading-relaxed font-medium">
                  {course.overview || "This program is architected to deliver high-impact results, combining foundational theory with real-world execution. Students will engage with modern toolsets and industry-standard workflows to build a competitive edge in today's digital economy."}
                </div>
              </div>

              {/* Curriculum Section */}
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-3 text-gray-900">
                   <div className="w-1 bg-[#8b5cf6] h-6 md:h-8 rounded-full" />
                   <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Structured Curriculum</h2>
                </div>
                
                <div className="space-y-4 md:space-y-5">
                  {modules.length > 0 ? modules.map((module, mIdx) => (
                    <div key={module.id} className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:border-[#8b5cf6]/10 shadow-sm">
                      <button 
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center text-[#8b5cf6] font-black text-xs md:text-sm">
                            {String(mIdx + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <h3 className="font-[800] text-gray-900 tracking-tight text-base md:text-lg">{module.title}</h3>
                            <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest">{module.lessons?.length || 0} Modules • Professional HD Content</p>
                          </div>
                        </div>
                        {expandedModules.includes(module.id) ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </button>

                      {expandedModules.includes(module.id) && (
                        <div className="border-t border-gray-50 bg-slate-50/30">
                          {module.lessons?.map((lesson, lIdx) => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 md:p-5 px-6 md:px-8 hover:bg-white transition-colors border-b border-gray-50 last:border-0 group cursor-pointer">
                              <div className="flex items-center gap-4 md:gap-5">
                                <div className="text-[10px] md:text-xs font-black text-gray-300 group-hover:text-[#8b5cf6] transition-colors w-4">{lIdx + 1}</div>
                                <div className="text-xs md:text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{lesson.title}</div>
                              </div>
                              <PlayIcon size={14} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-8 md:p-12 text-center bg-slate-50 border-2 border-dashed border-gray-200 rounded-2xl md:rounded-3xl text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      Curriculum updates in progress...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Information Column */}
            <div className="lg:col-span-5 space-y-8 md:space-y-10">
               <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-8 md:space-y-10 shadow-xl shadow-slate-200/50">
                  <div className="space-y-6 md:space-y-8">
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-3">
                       <Target size={24} className="text-[#8b5cf6]" />
                       Core Learning Objectives
                    </h3>
                    <div className="space-y-4 md:space-y-5">
                      {(course.skills || ["Industry Mastery", "Practical Engineering", "Scalable Systems", "Creative Problem Solving"]).map((skill, idx) => (
                        <div key={idx} className="flex items-start gap-4 group">
                          <div className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-purple-50 flex items-center justify-center text-[#8b5cf6] shrink-0 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all shadow-sm">
                             <CheckCircle2 size={12} />
                          </div>
                          <span className="text-xs md:text-sm text-gray-500 font-bold group-hover:text-gray-900 transition-colors">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-100" />

                  <div className="space-y-6 md:space-y-8">
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 flex items-center gap-3">
                       <Award size={24} className="text-blue-500" />
                       Program Outcomes
                    </h3>
                    <div className="space-y-4 md:space-y-5">
                      {(course.outcomes || ["Verified PDF Certificate", "Global Alumni Network", "Portfolio Ready Projects", "Career Acceleration Support"]).map((outcome, idx) => (
                        <div key={idx} className="flex items-start gap-4 md:gap-5">
                          <div className="text-[10px] md:text-xs font-black text-gray-300 pt-1">0{idx+1}</div>
                          <span className="text-xs md:text-sm text-gray-500 font-bold leading-relaxed">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (course.syllabus_url) {
                        window.open(course.syllabus_url, '_blank');
                      } else {
                        alert("Syllabus not available yet.");
                      }
                    }}
                    className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-100 hover:border-[#8b5cf6] hover:bg-slate-50 text-gray-900 text-[10px] font-[900] uppercase tracking-[0.2em] transition-all"
                  >
                    Access Syllabus PDF
                  </button>
               </div>

               {/* Support Modal */}
               <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Connect with Admission Teams</p>
                  <h4 className="text-base md:text-lg font-black mb-4 relative z-10">Questions about this track?</h4>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-xs md:text-sm font-black text-[#8b5cf6] hover:text-white transition-colors relative z-10">
                    Schedule a Consultation <ArrowRight size={16} />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
