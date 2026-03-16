"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  Layout, 
  Video, 
  FileText, 
  Info,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Award,
  Target,
  Rocket
} from "lucide-react";
import { useRouter } from "next/navigation";
import { coursesApi } from "@/lib/api/courses";
import { modulesApi } from "@/lib/api/modules";
import { lessonsApi } from "@/lib/api/lessons";

type ModuleInput = {
  title: string;
  lessons: { title: string; video_url: string; notes: string }[];
};

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: "",
    category: "Certification",
    level: "Beginner",
    overview: "",
    skills: [""],
    outcomes: [""],
    duration: ""
  });

  const [modules, setModules] = useState<ModuleInput[]>([]);

  const handleAddModule = () => {
    setModules([...modules, { title: "", lessons: [] }]);
  };

  const handleAddLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({ title: "", video_url: "", notes: "" });
    setModules(newModules);
  };

  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      // 1. Create Course
      const newCourse = await coursesApi.createCourse({
        ...courseData,
        price: Number(courseData.price),
        skills: courseData.skills.filter(s => s !== ""),
        outcomes: courseData.outcomes.filter(o => o !== ""),
        category: courseData.category as any,
        level: courseData.level as any
      });

      // 2. Create Modules and Lessons
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        const createdModule = await modulesApi.createModule({
          course_id: newCourse.id,
          title: mod.title,
          order_index: i + 1
        });

        for (let j = 0; j < mod.lessons.length; j++) {
          const lesson = mod.lessons[j];
          await lessonsApi.createLesson({
            course_id: newCourse.id,
            module_id: createdModule.id,
            title: lesson.title,
            video_url: lesson.video_url,
            notes: lesson.notes,
            order_index: j + 1
          });
        }
      }

      router.push("/cms-admin/courses");
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Course Builder</h1>
          <p className="text-gray-500 font-medium">Create a premium learning experience for your students.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveCourse}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Publish Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Basic Info */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <Info size={20} className="text-blue-500" />
               Basic Information
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Course Title</label>
                <input 
                  type="text" 
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  placeholder="e.g. Artificial Intelligence Masterclass"
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:border-[#8b5cf6] focus:bg-white transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={courseData.price}
                    onChange={(e) => setCourseData({...courseData, price: e.target.value})}
                    placeholder="7999"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:border-[#8b5cf6] focus:bg-white transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={courseData.category}
                    onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:border-[#8b5cf6] focus:bg-white transition-all font-bold"
                  >
                    <option>Certification</option>
                    <option>Mentorship</option>
                    <option>Placement</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Short Description</label>
                <textarea 
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  rows={3}
                  placeholder="Summarize the course in 2-3 sentences..."
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:border-[#8b5cf6] focus:bg-white transition-all font-bold"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <Layout size={20} className="text-purple-500" />
               Curriculum Structure
            </h2>
            
            <div className="space-y-6">
              {modules.map((mod, mIdx) => (
                <div key={mIdx} className="border border-gray-100 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <input 
                      type="text" 
                      value={mod.title}
                      onChange={(e) => {
                        const newModules = [...modules];
                        newModules[mIdx].title = e.target.value;
                        setModules(newModules);
                      }}
                      placeholder={`Module ${mIdx + 1} Title`}
                      className="bg-transparent border-b border-gray-100 font-bold text-gray-900 outline-none focus:border-[#8b5cf6] pb-1 w-full mr-4"
                    />
                    <button 
                      onClick={() => setModules(modules.filter((_, i) => i !== mIdx))}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3 pl-4">
                    {mod.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <input 
                            type="text"
                            value={lesson.title}
                            onChange={(e) => {
                              const newModules = [...modules];
                              newModules[mIdx].lessons[lIdx].title = e.target.value;
                              setModules(newModules);
                            }}
                            placeholder="Lesson Title"
                            className="bg-transparent font-medium text-sm outline-none w-full"
                          />
                          <button 
                             onClick={() => {
                               const newModules = [...modules];
                               newModules[mIdx].lessons = newModules[mIdx].lessons.filter((_, i) => i !== lIdx);
                               setModules(newModules);
                             }}
                             className="text-gray-300 hover:text-red-500"
                          >
                             <Trash2 size={14} />
                          </button>
                        </div>
                        <input 
                          type="text"
                          value={lesson.video_url}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[mIdx].lessons[lIdx].video_url = e.target.value;
                            setModules(newModules);
                          }}
                          placeholder="Video URL (Vimeo/YouTube)"
                          className="bg-white border-transparent rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#8b5cf6] border"
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => handleAddLesson(mIdx)}
                      className="text-[#8b5cf6] font-bold text-xs flex items-center gap-1 hover:underline mt-2"
                    >
                      <Plus size={14} /> Add Lesson
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={handleAddModule}
                className="w-full py-4 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-bold text-sm hover:border-[#8b5cf6]/30 hover:bg-purple-50/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add New Module
              </button>
            </div>
          </section>
        </div>

        {/* Right: Insights & Preview */}
        <div className="lg:col-span-5 space-y-8">
           <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                   <Target size={18} className="text-blue-500" />
                   Course Outcomes
                </h3>
                <div className="space-y-3">
                  {courseData.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex gap-2">
                       <input 
                         type="text" 
                         value={outcome}
                         onChange={(e) => {
                           const newOutcomes = [...courseData.outcomes];
                           newOutcomes[idx] = e.target.value;
                           setCourseData({...courseData, outcomes: newOutcomes});
                         }}
                         placeholder="What will they achieve?"
                         className="flex-1 bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8b5cf6] font-medium"
                       />
                       <button 
                         onClick={() => setCourseData({...courseData, outcomes: courseData.outcomes.filter((_, i) => i !== idx)})}
                         className="text-gray-300 hover:text-red-500"
                        >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setCourseData({...courseData, outcomes: [...courseData.outcomes, ""]})}
                    className="text-sm font-bold text-[#8b5cf6] hover:underline"
                  >
                    + Add Outcome
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-50" />

              <div className="space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                   <ImageIcon size={18} className="text-orange-500" />
                   Thumbnail URL
                </h3>
                <input 
                  type="text" 
                  value={courseData.thumbnail}
                  onChange={(e) => setCourseData({...courseData, thumbnail: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:border-[#8b5cf6] font-medium"
                />
                {courseData.thumbnail && (
                  <div className="aspect-video relative rounded-2xl overflow-hidden border border-gray-100">
                     <img src={courseData.thumbnail} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
           </section>

           <section className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6">
              <h3 className="text-lg font-black tracking-tight">Pro Tips</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                   <Sparkles size={18} className="text-yellow-500 shrink-0" />
                   Use high-quality Unsplash images for better conversion.
                </li>
                <li className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                   <Award size={18} className="text-green-500 shrink-0" />
                   Clear outcomes help students understand the value proposition.
                </li>
              </ul>
           </section>
        </div>
      </div>
    </div>
  );
}
