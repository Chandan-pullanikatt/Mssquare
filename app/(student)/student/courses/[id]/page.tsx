"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  ChevronLeft, 
  Loader2, 
  BookOpen,
  FolderGit2,
  FileText,
  Video,
  ExternalLink,
  Lock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { coursesApi } from "@/lib/api/courses";
import { lessonsApi } from "@/lib/api/lessons";
import { lessonProgressApi } from "@/lib/api/lessonProgress";
import { projectsApi } from "@/lib/api/projects";
import { assignmentsApi } from "@/lib/api/assignments";
import { recordedSessionsApi } from "@/lib/api/recordedSessions";
import { Course, Lesson, Project, Assignment, RecordedSession } from "@/types/database";
import VideoPlayer from "@/components/shared/VideoPlayer";

type TabType = "lessons" | "projects" | "assignments" | "recordings";

export default function CourseLearningPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [recordings, setRecordings] = useState<RecordedSession[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("lessons");
  const [loading, setLoading] = useState(true);
  const [markingLoading, setMarkingLoading] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchCourseData();
    }
  }, [user, id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [
        courseData, 
        lessonsData, 
        progressData, 
        projectsData, 
        assignmentsData,
        recordingsData
      ] = await Promise.all([
        coursesApi.getCourseById(id),
        lessonsApi.getLessonsByCourseId(id),
        lessonProgressApi.getUserProgress(user!.id, id),
        projectsApi.getProjectsByCourse(id),
        assignmentsApi.getAssignmentsByCourse(id),
        recordedSessionsApi.getRecordedSessionsByCourse(id)
      ]);

      setCourse(courseData);
      setLessons(lessonsData);
      setProjects(projectsData);
      setAssignments(assignmentsData);
      setRecordings(recordingsData);
      
      const completedSet = new Set(progressData.map((p: any) => p.lesson_id));
      setCompletedLessonIds(completedSet);

      // Set active lesson: find first incomplete, or first lesson
      if (lessonsData.length > 0) {
        const firstIncomplete = lessonsData.find(l => !completedSet.has(l.id));
        setActiveLesson(firstIncomplete || lessonsData[0]);
      } else if (recordingsData.length > 0) {
        // Fallback to recordings if no lessons but recordings exist
        setActiveTab("recordings");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsComplete = async () => {
    if (!user || !activeLesson || markingLoading) return;
    
    try {
      setMarkingLoading(true);
      await lessonProgressApi.markLessonAsCompleted(user.id, activeLesson.id);
      
      const newCompletedSet = new Set(completedLessonIds);
      newCompletedSet.add(activeLesson.id);
      setCompletedLessonIds(newCompletedSet);

      // Auto-switch to next lesson if available
      const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
      if (currentIndex < lessons.length - 1) {
        setActiveLesson(lessons[currentIndex + 1]);
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
    } finally {
      setMarkingLoading(false);
    }
  };

  const calculateProgress = () => {
    const totalCount = lessons.length;
    if (totalCount === 0) return 0;
    return Math.round((completedLessonIds.size / totalCount) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#8b5cf6] animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Building Your Learning Experience...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
        <Link href="/student/courses" className="text-[#8b5cf6] font-bold hover:underline flex items-center gap-2">
          <ChevronLeft size={20} /> Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto min-h-screen bg-transparent flex flex-col lg:flex-row gap-6 p-4 lg:p-8 animate-in fade-in duration-700">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/student/courses" 
            className="flex items-center gap-2 text-gray-500 hover:text-[#8b5cf6] font-bold text-sm transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:border-[#8b5cf6]/20 group-hover:shadow-sm transition-all">
              <ChevronLeft size={16} />
            </div>
            Back to Course List
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Course Progress</p>
              <p className="text-sm font-black text-gray-900 leading-none">{calculateProgress()}% Complete</p>
            </div>
            <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] transition-all duration-1000" 
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Video Player Card */}
        <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-1"> {/* Thin border padding */}
            {activeLesson?.video_url ? (
              <VideoPlayer 
                videoId={activeLesson.video_url} 
                title={activeLesson.title} 
              />
            ) : recordings.length > 0 && activeTab === "recordings" ? (
              <VideoPlayer 
                videoId={recordings[0].video_url} 
                title={recordings[0].title}
              />
            ) : (
              <div className="aspect-video bg-gray-900 flex flex-col items-center justify-center text-white p-8 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#8b5cf6]/5 animate-pulse" />
                <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 relative z-10">
                  <Video size={40} className="text-purple-400" />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-2xl font-black mb-3">Welcome to {course.title}</h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                    Select a lesson from the curriculum or check the recordings tab to start learning.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-50 px-8">
            {[
              { id: "lessons", label: `Lessons (${lessons?.length || 0})`, icon: Play },
              { id: "recordings", label: `Recordings (${recordings?.length || 0})`, icon: Video },
              { id: "projects", label: `Projects (${projects?.length || 0})`, icon: FolderGit2 },
              { id: "assignments", label: `Assignments (${assignments?.length || 0})`, icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold transition-all relative ${
                  activeTab === tab.id 
                    ? "text-[#8b5cf6]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8b5cf6] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Lesson Content / Description Area */}
          <div className="p-10">
            {activeTab === "lessons" && activeLesson ? (
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-purple-50 text-[#8b5cf6] text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider border border-purple-100">
                      Target Module
                    </span>
                    <span className="text-gray-200">•</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      Session {lessons.findIndex(l => l.id === activeLesson.id) + 1}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">
                    {activeLesson.title}
                  </h2>
                  <div className="prose prose-purple max-w-none text-gray-600 leading-loose">
                    {activeLesson.notes || "In this session, we'll dive deep into the core concepts of this module. Follow along with the video and take notes."}
                  </div>
                </div>
                
                <button
                  onClick={handleMarkAsComplete}
                  disabled={markingLoading || completedLessonIds.has(activeLesson.id)}
                  className={`shrink-0 flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] font-bold transition-all active:scale-95 shadow-xl min-w-[200px] ${
                    completedLessonIds.has(activeLesson.id)
                      ? "bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100 shadow-none"
                      : "bg-[#8b5cf6] text-white hover:shadow-purple-200 hover:-translate-y-1"
                  }`}
                >
                  {markingLoading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : completedLessonIds.has(activeLesson.id) ? (
                    <>
                      <CheckCircle2 size={24} />
                      Lesson Finished
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={24} />
                      Complete & Next
                    </>
                  )}
                </button>
              </div>
            ) : activeTab === "recordings" ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900">Recorded Replays</h3>
                <p className="text-gray-500 font-medium">Missed a live class? Catch up with the recordings below.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {recordings.map((rec) => (
                    <div key={rec.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-[#8b5cf6]/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8b5cf6] shadow-sm group-hover:scale-110 transition-transform">
                            <Video size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{rec.title}</p>
                            <p className="text-xs text-gray-400 font-medium">{rec.duration || "Session Replay"}</p>
                          </div>
                       </div>
                       <button className="p-3 bg-white text-gray-400 rounded-xl hover:text-[#8b5cf6] hover:bg-purple-50 transition-all">
                         <Play size={18} fill="currentColor" />
                       </button>
                    </div>
                  ))}
                  {recordings.length === 0 && <p className="text-gray-400 font-bold col-span-2 py-4">No recordings available yet.</p>}
                </div>
              </div>
            ) : activeTab === "projects" ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Practical Projects</h3>
                <p className="text-gray-500 font-medium">Apply your skills with hands-on labs and team assignments.</p>
                <div className="grid grid-cols-1 gap-4 pt-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-8 bg-white rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#8b5cf6]/20 transition-all shadow-sm">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                               {proj.project_type || 'Practical'}
                             </span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{proj.title}</h4>
                          <p className="text-sm text-gray-500 mt-2 max-w-xl">{proj.description || "Download project details to start working."}</p>
                       </div>
                       <Link href="/student/projects" className="shrink-0 flex items-center gap-2 bg-gray-50 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#8b5cf6] hover:text-white transition-all shadow-sm border border-gray-100">
                         View Details
                         <ArrowRight size={18} />
                       </Link>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                       <FolderGit2 className="mx-auto text-gray-300 mb-4" size={48} />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active projects linked to this course</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Assessments & Assignments</h3>
                <div className="grid grid-cols-1 gap-4 pt-4">
                  {assignments.map((asm) => (
                    <div key={asm.id} className="p-8 bg-white rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#8b5cf6]/20 transition-all shadow-sm">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-[#8b5cf6] shrink-0 border border-violet-100">
                             <FileText size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{asm.title}</h4>
                            <div className="flex items-center gap-4 mt-2">
                               <p className="text-xs text-rose-500 font-bold">Due: {asm.due_date ? new Date(asm.due_date).toLocaleDateString() : 'N/A'}</p>
                               <span className="text-gray-200">|</span>
                               <p className="text-xs text-gray-400 font-bold">{asm.max_marks || 100} Points Total</p>
                            </div>
                          </div>
                       </div>
                       <Link href="/student/assignments" className="shrink-0 flex items-center gap-2 bg-[#111827] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                         Go to Submission
                         <ExternalLink size={18} />
                       </Link>
                    </div>
                  ))}
                  {assignments.length === 0 && (
                    <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                       <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending assignments for this stage</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Sidebar (Sticky) */}
      <div className="lg:w-[420px] shrink-0">
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden sticky top-32">
          <div className="p-8 border-b border-gray-50 bg-gray-50/20">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Curriculum</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest bg-purple-50 px-2 py-1 rounded-lg">
                {lessons.length} Modules
              </p>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {completedLessonIds.size} Completed
              </p>
            </div>
          </div>
          
          <div className="p-4 max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isActive = activeLesson?.id === lesson.id;
                const isCompleted = completedLessonIds.has(lesson.id);
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson);
                      setActiveTab("lessons");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-start gap-5 p-5 rounded-[2rem] transition-all text-left group border ${
                      isActive 
                        ? "bg-purple-50/50 border-purple-100 ring-4 ring-purple-100/30" 
                        : "hover:bg-gray-50 border-transparent"
                    }`}
                  >
                    <div className="mt-1 shrink-0 relative">
                      {isCompleted ? (
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                          <CheckCircle2 size={14} />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isActive ? "border-[#8b5cf6] bg-white" : "border-gray-200 group-hover:border-gray-300"
                        }`}>
                          {isActive && <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-ping" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          isActive ? "text-[#8b5cf6]" : "text-gray-400"
                        }`}>
                          Session {index + 1}
                        </span>
                      </div>
                      <p className={`text-sm font-bold leading-snug truncate ${
                        isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                      }`}>
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
              
              {lessons.length === 0 && (
                <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                   <Lock size={24} className="mx-auto text-gray-300 mb-2" />
                   <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
                     Lessons for this cycle haven't been published yet.
                   </p>
                </div>
              )}
            </div>
          </div>

          {/* Gamification footer in sidebar */}
          <div className="p-8 bg-white border-t border-gray-50">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white overflow-hidden relative shadow-lg">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8b5cf6]/20 rounded-full blur-3xl" />
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Next Milestone</p>
                      <p className="text-sm font-black leading-none">Course Certification</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-gray-400">Completion</span>
                       <span className="text-[#8b5cf6]">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] transition-all duration-1000" 
                        style={{ width: `${calculateProgress()}%` }} 
                      />
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraduationCap({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
