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
  Loader2,
  X,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { coursesApi } from "@/lib/api/courses";
import { projectsApi } from "@/lib/api/projects";
import { assignmentsApi } from "@/lib/api/assignments";
import { certificationMetadataApi } from "@/lib/api/certificationMetadata";
import { Project, Assignment, CertificationMetadata, Course } from "@/types/database";

export default function ManageCourseContent() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'assignments' | 'certification'>('projects');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [certMetadata, setCertMetadata] = useState<CertificationMetadata | null>(null);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseData, projectsData, assignmentsData, certData] = await Promise.all([
        coursesApi.getCourseById(id),
        projectsApi.getProjectsByCourse(id),
        assignmentsApi.getAssignmentsByCourse(id),
        certificationMetadataApi.getCertificationByCourse(id)
      ]);
      setCourse(courseData);
      setProjects(projectsData);
      setAssignments(assignmentsData);
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
        tags: ["React"]
      });
      setProjects([newProject, ...projects]);
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
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      setAssignments([newAssignment, ...assignments]);
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

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setSaving(true);
      const data = {
        course_id: id,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        template_url: formData.get('template_url') as string || null,
      };
      const updated = await certificationMetadataApi.upsertCertification(data);
      setCertMetadata(updated);
      alert("Certification updated!");
    } catch (err) {
      console.error("Failed to save certification", err);
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
                <div key={project.id} className="p-6 rounded-3xl border border-gray-50 bg-gray-50/30 group hover:border-purple-100 hover:bg-white transition-all">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <input 
                        className="text-lg font-bold bg-transparent border-none p-0 focus:ring-0 w-full" 
                        defaultValue={project.title}
                        onBlur={async (e) => {
                          if (e.target.value !== project.title) {
                            await projectsApi.updateProject(project.id, { title: e.target.value });
                          }
                        }}
                      />
                      <textarea 
                        className="text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 w-full resize-none" 
                        defaultValue={project.description}
                        rows={2}
                        onBlur={async (e) => {
                          if (e.target.value !== project.description) {
                            await projectsApi.updateProject(project.id, { description: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
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
                <div key={assignment.id} className="p-6 rounded-3xl border border-gray-50 bg-gray-50/30 group hover:border-purple-100 hover:bg-white transition-all">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <input 
                        className="text-lg font-bold bg-transparent border-none p-0 focus:ring-0 w-full" 
                        defaultValue={assignment.title}
                        onBlur={async (e) => {
                          if (e.target.value !== assignment.title) {
                            await assignmentsApi.updateAssignment(assignment.id, { title: e.target.value });
                          }
                        }}
                      />
                      <textarea 
                        className="text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 w-full resize-none" 
                        defaultValue={assignment.description}
                        rows={2}
                        onBlur={async (e) => {
                          if (e.target.value !== assignment.description) {
                            await assignmentsApi.updateAssignment(assignment.id, { description: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <button onClick={() => handleDeleteAssignment(assignment.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No assignments added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'certification' && (
          <form onSubmit={handleSaveCert} className="max-w-2xl space-y-6">
            <h2 className="text-xl font-bold">Certification Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Certificate Title</label>
                <input 
                  name="title" 
                  defaultValue={certMetadata?.title || `${course?.title} Professional Certification`}
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea 
                  name="description" 
                  defaultValue={certMetadata?.description || `Earn this certificate by completing 90% of the ${course?.title} course.`}
                  required
                  rows={4}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Certificate Template URL (Optional)</label>
                <input 
                  name="template_url" 
                  defaultValue={certMetadata?.template_url || ''}
                  placeholder="https://example.com/template.pdf"
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
                />
              </div>
            </div>
            <button 
              disabled={saving}
              className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Save Certification Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
