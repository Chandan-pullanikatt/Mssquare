"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  BarChart, 
  Timer,
  Info,
  CheckCircle2,
  Loader2,
  Layout,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { adminApi } from "@/lib/api/admin";
import { storageApi } from "@/lib/api/storage";
import { modulesApi } from "@/lib/api/modules";
import { lessonsApi } from "@/lib/api/lessons";
import { sanitizeFilename } from "@/lib/utils";
import CurriculumEditor, { ModuleInput } from "@/components/courses/CurriculumEditor";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: 0,
    category: "Certification",
    level: "Beginner",
    duration: "",
    overview: "",
  });
  const [modules, setModules] = useState<ModuleInput[]>([]);
  const [initialModules, setInitialModules] = useState<ModuleInput[]>([]);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCourseById(id) as any;
      setFormData({
        title: data.title || "",
        description: data.description || "",
        thumbnail: data.thumbnail || "",
        price: data.price || 0,
        category: data.category || "Certification",
        level: data.level || "Beginner",
        duration: data.duration || "",
        overview: data.overview || "",
      });

      // Fetch Curriculum
      const modulesData = await modulesApi.getModulesByCourse(id);
      const formattedModules: ModuleInput[] = modulesData.map((m: any) => ({
        id: m.id,
        title: m.title,
        lessons: (m.lessons || []).map((l: any) => ({
          id: l.id,
          title: l.title,
          video_url: l.video_url || "",
          notes: l.notes || ""
        }))
      }));
      setInitialModules(formattedModules);
      setModules(formattedModules);
    } catch (err) {
      console.error("Failed to fetch course data", err);
      alert("Failed to load course details.");
      router.push("/admin/lms/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to edit a course.");
      return;
    }
    setSaving(true);
    try {
      const updates = {
        ...formData,
        price: Number(formData.price) || 0
      };
      await adminApi.updateCourse(id, updates);

      // --- Curriculum Sync Logic ---
      
      // 1. Get current DB state for comparison
      const existingModules: any[] = await modulesApi.getModulesByCourse(id);
      const existingModuleIds = existingModules.map((m: any) => m.id);
      const existingLessonIds = (existingModules.flatMap((m: any) => m.lessons || []) as any[]).map((l: any) => l.id);

      // 2. Track what to keep (to find what to delete)
      const localModuleIds = modules.map(m => m.id).filter(Boolean) as string[];
      const localLessonIds = modules.flatMap(m => m.lessons).map(l => l.id).filter(Boolean) as string[];

      // 3. Delete removed lessons
      const lessonsToDelete = existingLessonIds.filter((id: string) => !localLessonIds.includes(id));
      for (const lId of lessonsToDelete) {
        await lessonsApi.deleteLesson(lId);
      }

      // 4. Delete removed modules
      const modulesToDelete = existingModuleIds.filter(id => !localModuleIds.includes(id));
      for (const mId of modulesToDelete) {
        await modulesApi.deleteModule(mId);
      }

      // 5. Upsert Modules and Lessons
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        let moduleId = mod.id;

        if (moduleId) {
          // Update existing module
          await modulesApi.updateModule(moduleId, {
            title: mod.title,
            order_index: i + 1
          });
        } else {
          // Create new module
          const newMod = await modulesApi.createModule({
            course_id: id,
            title: mod.title,
            order_index: i + 1
          });
          moduleId = newMod.id;
        }

        // Handle lessons for this module
        for (let j = 0; j < mod.lessons.length; j++) {
          const lesson = mod.lessons[j];
          if (lesson.id) {
            // Update existing lesson
            await lessonsApi.updateLesson(lesson.id, {
              title: lesson.title,
              video_url: lesson.video_url,
              notes: lesson.notes,
              order_index: j + 1,
              module_id: moduleId
            });
          } else {
            // Create new lesson
            await lessonsApi.createLesson({
              course_id: id,
              module_id: moduleId,
              title: lesson.title,
              video_url: lesson.video_url,
              notes: lesson.notes,
              order_index: j + 1
            });
          }
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/lms/courses");
      }, 1500);
    } catch (err) {
      console.error("Failed to update course", err);
      alert("Failed to update course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const sanitizedName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;
      const publicUrl = await storageApi.uploadCourseThumbnail(file, fileName);
      setFormData({ ...formData, thumbnail: publicUrl });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 mb-8 shadow-sm">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Course Updated Successfully!</h1>
        <p className="text-gray-500 font-medium">Redirecting you to the course list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Back Button */}
      <Link 
        href="/admin/lms/courses" 
        className="flex items-center gap-2 text-gray-400 hover:text-purple-600 font-bold text-sm mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Course List
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <Layout size={24} />
          </div>
          Edit Course Settings
        </h1>
        <p className="text-gray-500 font-medium mt-4 max-w-xl">
          Modify the core details of your course. Changes will be reflected immediately across the platform for all students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Info size={18} className="text-purple-500" />
                Course Details
              </h2>
              
              <div className="space-y-2">
                <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g., Advanced React Patterns & Performance"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-purple-600/20 focus:ring-4 focus:ring-purple-600/5 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="A brief summary of what students will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-3xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-purple-600/20 focus:ring-4 focus:ring-purple-600/5 outline-none transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Overview (JSON/Text)</label>
                <textarea 
                  rows={6}
                  placeholder="In-depth details, curriculum highlights, or a detailed breakdown..."
                  value={formData.overview}
                  onChange={(e) => setFormData({...formData, overview: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-3xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-purple-600/20 focus:ring-4 focus:ring-purple-600/5 outline-none transition-all placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Config Section */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-green-500" />
                Pricing
              </h2>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors">
                  <DollarSign size={20} />
                </span>
                <input 
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setFormData({...formData, price: 0});
                    } else {
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setFormData({...formData, price: num});
                      }
                    }
                  }}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-xl font-black text-gray-900 focus:bg-white focus:border-green-600/20 focus:ring-4 focus:ring-green-600/5 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Thumbnail Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                <ImageIcon size={18} className="text-blue-500" />
                Media
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <input 
                    type="text"
                    placeholder="Thumbnail Image URL"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3 px-5 text-xs font-bold text-gray-900 focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-gray-100" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">or</span>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                  </div>
                  <label className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-2xl text-xs font-bold border-2 border-dashed border-blue-200 cursor-pointer hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    <span>{uploading ? "Uploading..." : "Browse Local File"}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                
                {formData.thumbnail && (
                   <div className="aspect-video w-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex items-center justify-center group relative">
                     <img 
                       src={formData.thumbnail} 
                       alt="Thumbnail Preview" 
                       className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                       onError={(e) => {
                         (e.target as any).src = "";
                         alert("Invalid Image URL");
                       }}
                     />
                     <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Current Preview</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories and Settings Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                <Tag size={16} className="text-orange-500" />
                Category
              </h3>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-orange-600/20 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Certification">Certification</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Placement">Placement</option>
              </select>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                <BarChart size={16} className="text-blue-500" />
                Level
              </h3>
              <select 
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-600/20 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                <Timer size={16} className="text-purple-500" />
                Duration
              </h3>
              <input 
                type="text"
                placeholder="e.g., 12 Weeks"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-purple-600/20 focus:ring-4 focus:ring-purple-600/5 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Curriculum Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <CurriculumEditor 
            initialModules={initialModules} 
            onChange={setModules} 
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link 
            href="/admin/lms/courses"
            className="px-8 py-4 rounded-3xl font-bold text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-5 rounded-3xl font-bold shadow-2xl shadow-purple-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0"
          >
            {saving ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={24} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
