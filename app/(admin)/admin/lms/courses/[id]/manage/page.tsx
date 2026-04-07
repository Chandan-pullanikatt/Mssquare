"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  FolderGit2, 
  FileText, 
  Award,
  Video,
  Loader2,
  X,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  Clock,
  Upload,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { coursesApi } from "@/lib/api/courses";
import { projectsApi } from "@/lib/api/projects";
import { assignmentsApi } from "@/lib/api/assignments";
import { certificationMetadataApi } from "@/lib/api/certificationMetadata";
import { recordedSessionsApi } from "@/lib/api/recordedSessions";
import { storageApi } from "@/lib/api/storage";
import { sanitizeFilename } from "@/lib/utils";
import { Project, Assignment, CertificationMetadata, Course, RecordedSession } from "@/types/database";
import AssignmentForm from "@/components/courses/AssignmentForm";
import ProjectForm from "@/components/courses/ProjectForm";

export default function ManageCourseContent() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'assignments' | 'recordings' | 'certification'>('projects');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([]);
  const [certMetadata, setCertMetadata] = useState<CertificationMetadata | null>(null);

  // Modal/Editor states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSessionData, setNewSessionData] = useState({ title: "", video_url: "" });

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseData, projectsData, assignmentsData, recordingsData, certData] = await Promise.all([
        coursesApi.getCourseById(id),
        projectsApi.getProjectsByCourse(id),
        assignmentsApi.getAssignmentsByCourse(id),
        recordedSessionsApi.getRecordedSessionsByCourse(id),
        certificationMetadataApi.getCertificationByCourse(id)
      ]);
      setCourse(courseData);
      setProjects(projectsData);
      setAssignments(assignmentsData);
      setRecordedSessions(recordingsData);
      setCertMetadata(certData);
    } catch (err) {
      console.error("Failed to fetch course data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      const newProject = await projectsApi.createProject({
        course_id: id,
        title: "New Project",
        description: "Project description goes here",
        project_type: 'solo',
        team_size_min: null,
        team_size_max: null,
        cert_credit: false,
        tech_tags: ["React"],
        resources: []
      });
      setProjects([newProject, ...projects]);
      setEditingProject(newProject);
    } catch (err) {
      console.error("Failed to add project", err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Delete project?")) return;
    try {
      await projectsApi.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handleAddAssignment = async () => {
    try {
      const newAssignment = await assignmentsApi.createAssignment({
        course_id: id,
        title: "New Assignment",
        description: "Assignment instructions",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        available_from: new Date().toISOString(),
        pass_mark: 50,
        max_marks: 100,
        max_attempts: 1,
        allow_late: true,
        allowed_types: ["pdf", "zip"],
        max_file_mb: 10,
        peer_review: false
      });
      setAssignments([newAssignment, ...assignments]);
      setEditingAssignment(newAssignment);
    } catch (err) {
      console.error("Failed to add assignment", err);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm("Delete assignment?")) return;
    try {
      await assignmentsApi.deleteAssignment(assignmentId);
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (err) {
      console.error("Failed to delete assignment", err);
    }
  };

  const handleAddRecording = async () => {
    if (!newSessionData.title || !newSessionData.video_url) {
      alert("Please provide both title and video link");
      return;
    }
    try {
      setSaving(true);
      const newSession = await recordedSessionsApi.createRecordedSession({
        course_id: id,
        title: newSessionData.title,
        video_url: newSessionData.video_url,
        description: "",
        duration: ""
      });
      setRecordedSessions([...recordedSessions, newSession]);
      setNewSessionData({ title: "", video_url: "" });
      setIsAddingSession(false);
    } catch (err: any) {
      console.error("Failed to add recording", err);
      alert(err.message || "Failed to add recording. Please check the YouTube URL.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecording = async (sessionId: string) => {
    if (!confirm("Delete recorded session?")) return;
    try {
      await recordedSessionsApi.deleteRecordedSession(sessionId);
      setRecordedSessions(recordedSessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error("Failed to delete recorded session", err);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newSessions = [...recordedSessions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSessions.length) return;
    
    [newSessions[index], newSessions[targetIndex]] = [newSessions[targetIndex], newSessions[index]];
    
    // Update order_index locally
    const updated = newSessions.map((s, i) => ({ ...s, order_index: i }));
    setRecordedSessions(updated);
    
    try {
      await recordedSessionsApi.reorderSessions(updated.map(s => ({ id: s.id, order_index: s.order_index })));
    } catch (err) {
      console.error("Failed to reorder sessions", err);
      fetchData(); // Reset on error
    }
  };

  const updateSession = async (id: string, updates: Partial<RecordedSession>) => {
    try {
      await recordedSessionsApi.updateRecordedSession(id, updates);
    } catch (err: any) {
      alert(err.message || "Failed to update session");
      fetchData(); // Reset UI
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get('template_file') as File;
    
    try {
      setSaving(true);
      let templateUrl = formData.get('template_url') as string || null;

      if (file && file.size > 0) {
        const sanitizedName = sanitizeFilename(file.name);
        const fileName = `cert_${id}_${Date.now()}_${sanitizedName}`;
        templateUrl = await storageApi.uploadCertificateTemplate(file, fileName);
      }

      const data = {
        course_id: id,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        template_url: templateUrl,
      };
      
      const updated = await certificationMetadataApi.upsertCertification(data);
      setCertMetadata(updated);
      alert("Certification updated successfully!");
    } catch (err: any) {
      console.error("Failed to save certification", err);
      alert(`Failed to save certification: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{course?.title}</h1>
            <p className="text-gray-500 font-medium">Manage course-specific projects, assignments, and certificates.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 w-fit">
        {[
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'recordings', label: 'Recorded Sessions', icon: Video },
          { id: 'certification', label: 'Certification', icon: Award }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 min-h-[400px]">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Course Projects</h2>
              <button onClick={handleAddProject} className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-100 transition-colors">
                <PlusCircle size={18} />
                Add Project
              </button>
            </div>
            <div className="grid gap-4">
              {projects.map(project => (
                <div key={project.id} className="p-6 rounded-3xl border border-gray-100 bg-white group hover:shadow-xl hover:shadow-purple-100/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <FolderGit2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{project.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase tracking-wider">
                          {project.project_type?.replace("_", " ") || 'solo'}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {project.tech_tags?.join(" • ") || "No tags"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingProject(project)}
                      className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-100 transition-colors"
                    >
                      Manage Details
                    </button>
                    <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No projects added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Course Assignments</h2>
              <button onClick={handleAddAssignment} className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-100 transition-colors">
                <PlusCircle size={18} />
                Add Assignment
              </button>
            </div>
            <div className="grid gap-4">
              {assignments.map(assignment => (
                <div key={assignment.id} className="p-6 rounded-3xl border border-gray-100 bg-white group hover:shadow-xl hover:shadow-blue-100/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{assignment.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                          <Clock size={12} />
                          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No date'}
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium">•</span>
                        <div className="text-[11px] text-gray-400 font-medium tracking-tight">
                          {assignment.max_marks} Marks
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingAssignment(assignment)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                    >
                      Configure Assignment
                    </button>
                    <button onClick={() => handleDeleteAssignment(assignment.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No assignments added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'recordings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recorded Sessions</h2>
              {!isAddingSession && (
                <button onClick={() => setIsAddingSession(true)} className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-100 transition-colors">
                  <PlusCircle size={18} />
                  Add Session
                </button>
              )}
            </div>

            {isAddingSession && (
              <div className="p-6 rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/30 animate-in fade-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Session Title</label>
                    <input 
                      className="w-full text-sm font-bold text-gray-700 bg-white rounded-xl p-3 border-none outline-none focus:ring-2 focus:ring-purple-200 shadow-sm"
                      placeholder="e.g. Introduction to React"
                      value={newSessionData.title}
                      onChange={e => setNewSessionData({...newSessionData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">YouTube Link</label>
                    <input 
                      className="w-full text-sm font-bold text-gray-700 bg-white rounded-xl p-3 border-none outline-none focus:ring-2 focus:ring-purple-200 shadow-sm"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newSessionData.video_url}
                      onChange={e => setNewSessionData({...newSessionData, video_url: e.target.value})}
                    />
                    <div className="flex items-center gap-2 mt-2 ml-1">
                      <a 
                        href="https://studio.youtube.com/channel/upload" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md transition-colors"
                      >
                        <Upload size={10} />
                        Upload to YouTube
                      </a>
                      <span className="text-gray-300 text-[10px]">•</span>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Need help? <span className="text-purple-500 font-bold">Unlisted</span> is recommended.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button 
                    onClick={() => {
                      setIsAddingSession(false);
                      setNewSessionData({ title: "", video_url: "" });
                    }}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600 px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddRecording}
                    disabled={saving}
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-100"
                  >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    Create Session
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {recordedSessions.map((session, index) => (
                <div key={session.id} className="p-6 rounded-3xl border border-gray-50 bg-gray-50/30 group hover:border-purple-100 hover:bg-white transition-all">
                  <div className="flex items-start gap-4">
                    {/* Reorder controls */}
                    <div className="flex flex-col gap-1 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-purple-100 rounded text-gray-400 hover:text-purple-600 disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === recordedSessions.length - 1}
                        className="p-1 hover:bg-purple-100 rounded text-gray-400 hover:text-purple-600 disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Session Title</label>
                          <input 
                            className="bg-white border border-transparent rounded-xl px-4 py-2 outline-none focus:border-purple-200 transition-all font-bold w-full" 
                            defaultValue={session.title}
                            onBlur={(e) => {
                              if (e.target.value !== session.title) updateSession(session.id, { title: e.target.value });
                            }}
                          />
                        </div>
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">YouTube URL / ID</label>
                          <input 
                            className="bg-white border border-transparent rounded-xl px-4 py-2 outline-none focus:border-purple-200 transition-all font-medium w-full text-purple-600" 
                            defaultValue={session.video_url}
                            placeholder="https://www.youtube.com/watch?v=..."
                            onBlur={(e) => {
                              if (e.target.value !== session.video_url) updateSession(session.id, { video_url: e.target.value });
                            }}
                          />
                        </div>
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration (e.g. 1h 30m)</label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                              className="bg-white border border-transparent rounded-xl pl-9 pr-4 py-2 outline-none focus:border-purple-200 transition-all font-medium w-full" 
                              defaultValue={session.duration || ""}
                              placeholder="00:00"
                              onBlur={(e) => {
                                if (e.target.value !== session.duration) updateSession(session.id, { duration: e.target.value });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <textarea 
                        className="text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 w-full resize-none ml-1" 
                        defaultValue={session.description || ""}
                        placeholder="Add a brief description..."
                        rows={2}
                        onBlur={(e) => {
                          if (e.target.value !== session.description) updateSession(session.id, { description: e.target.value });
                        }}
                      />
                    </div>
                    <button onClick={() => handleDeleteRecording(session.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors pt-4">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {recordedSessions.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No recorded sessions added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'certification' && (
          <form onSubmit={handleSaveCert} className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                  <Award size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Certification Details</h2>
                  <p className="text-sm text-gray-500 font-medium">Configure the course completion certificate</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Certificate Title *</label>
                  <input 
                    name="title" 
                    defaultValue={certMetadata?.title || `${course?.title} Professional Certification`}
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-gray-700"
                    placeholder="e.g. Full-Stack Web Development Certificate"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Achievement Description *</label>
                  <textarea 
                    name="description" 
                    defaultValue={certMetadata?.description || `Earn this certificate by completing 100% of the ${course?.title} course material and submitting all required projects.`}
                    required
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium text-gray-600 resize-none"
                    placeholder="Describe the requirements for earning this certificate..."
                  />
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Certificate Template (PDF or Image)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input 
                        type="file" 
                        name="template_file"
                        accept=".pdf,image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-4 bg-gray-50 group-hover:bg-white group-hover:border-purple-300 transition-all">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-purple-600">
                          <Upload size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-600">Browse Files</p>
                          <p className="text-[10px] text-gray-400 font-medium">PDF, PNG, or JPG (Max 5MB)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <input 
                        name="template_url" 
                        defaultValue={certMetadata?.template_url || ''}
                        placeholder="Or paste external template URL..."
                        className="w-full h-[66px] bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all text-sm font-medium text-gray-500 italic"
                      />
                    </div>
                  </div>
                  {certMetadata?.template_url && (
                    <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-in slide-in-from-left-2">
                      <Award size={16} />
                      <span className="text-xs font-bold truncate flex-1">Current template: {certMetadata.template_url}</span>
                      <Link href={certMetadata.template_url} target="_blank" className="text-xs font-black underline hover:text-emerald-900 px-2 transition-colors">
                        View
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  disabled={saving}
                  className="flex items-center gap-2 bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-purple-100 hover:bg-purple-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Certification Details
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {editingProject && (
        <ProjectForm 
          project={editingProject}
          courseTitle={course?.title || ""}
          onClose={() => setEditingProject(null)}
          onSave={(updated) => {
            setProjects(projects.map(p => p.id === updated.id ? updated : p));
          }}
        />
      )}

      {editingAssignment && (
        <AssignmentForm 
          assignment={editingAssignment}
          courseTitle={course?.title || ""}
          onClose={() => setEditingAssignment(null)}
          onSave={(updated) => {
            setAssignments(assignments.map(a => a.id === updated.id ? updated : a));
          }}
        />
      )}
    </div>
  );
}
