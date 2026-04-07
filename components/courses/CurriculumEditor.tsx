import { useState, useEffect } from "react";
import { Plus, Trash2, Layout, Video, FileText, ChevronDown, ChevronRight, GripVertical } from "lucide-react";

export type LessonInput = {
  id?: string;
  title: string;
  video_url: string;
  notes: string;
};

export type ModuleInput = {
  id?: string;
  title: string;
  lessons: LessonInput[];
};

interface CurriculumEditorProps {
  initialModules?: ModuleInput[];
  onChange: (modules: ModuleInput[]) => void;
}

export default function CurriculumEditor({ initialModules = [], onChange }: CurriculumEditorProps) {
  const [modules, setModules] = useState<ModuleInput[]>(initialModules);

  // Sync with initialModules when they load (for edit mode)
  useEffect(() => {
    if (initialModules && initialModules.length > 0) {
      setModules(initialModules);
    }
  }, [initialModules]);

  const handleAddModule = () => {
    const newModules = [...modules, { title: "", lessons: [] }];
    setModules(newModules);
    onChange(newModules);
  };

  const handleRemoveModule = (moduleIndex: number) => {
    const newModules = modules.filter((_, i) => i !== moduleIndex);
    setModules(newModules);
    onChange(newModules);
  };

  const handleModuleTitleChange = (moduleIndex: number, title: string) => {
    const newModules = [...modules];
    newModules[moduleIndex].title = title;
    setModules(newModules);
    onChange(newModules);
  };

  const handleAddLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({ title: "", video_url: "", notes: "" });
    setModules(newModules);
    onChange(newModules);
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(newModules);
    onChange(newModules);
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof LessonInput, value: string) => {
    const newModules = [...modules];
    (newModules[moduleIndex].lessons[lessonIndex] as any)[field] = value;
    setModules(newModules);
    onChange(newModules);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layout size={20} className="text-purple-500" />
          Course Curriculum
        </h2>
        <button 
          type="button"
          onClick={handleAddModule}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-100 transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Module
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((mod, mIdx) => (
          <div key={mIdx} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <GripVertical size={16} />
                </div>
                <input 
                  type="text" 
                  value={mod.title}
                  onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                  placeholder={`Module ${mIdx + 1} Title (e.g., Introduction to React)`}
                  className="bg-transparent border-b-2 border-gray-50 font-bold text-gray-900 outline-none focus:border-purple-600/20 pb-1 w-full transition-all"
                />
              </div>
              <button 
                type="button"
                onClick={() => handleRemoveModule(mIdx)}
                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Remove Module"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-3 pl-8">
              {mod.lessons.map((lesson, lIdx) => (
                <div key={lIdx} className="bg-gray-50/50 rounded-2xl p-4 space-y-4 group transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <input 
                        type="text"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(mIdx, lIdx, 'title', e.target.value)}
                        placeholder="Lesson Title"
                        className="bg-transparent font-medium text-sm text-gray-700 outline-none w-full"
                      />
                    </div>
                    <button 
                       type="button"
                       onClick={() => handleRemoveLesson(mIdx, lIdx)}
                       className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                       <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <Video size={10} /> Video URL
                      </label>
                      <input 
                        type="text"
                        value={lesson.video_url}
                        onChange={(e) => handleLessonChange(mIdx, lIdx, 'video_url', e.target.value)}
                        placeholder="YouTube/Vimeo Link"
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-purple-600/20 focus:ring-4 focus:ring-purple-600/5 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <FileText size={10} /> Notes/Resources
                      </label>
                      <input 
                        type="text"
                        value={lesson.notes}
                        onChange={(e) => handleLessonChange(mIdx, lIdx, 'notes', e.target.value)}
                        placeholder="Link to PDF or markdown content"
                        className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-purple-600/20 focus:ring-4 focus:ring-purple-600/5 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button"
                onClick={() => handleAddLesson(mIdx)}
                className="w-full py-3 border-2 border-dashed border-gray-50 rounded-2xl text-gray-400 font-bold text-xs hover:border-purple-600/20 hover:bg-purple-50/30 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} /> 
                Add Lesson to {mod.title || `Module ${mIdx + 1}`}
              </button>
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="py-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
              <Layout size={32} />
            </div>
            <div>
              <p className="text-gray-900 font-bold">No modules added yet</p>
              <p className="text-gray-400 text-sm font-medium">Click "Add Module" to start building your course curriculum.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
