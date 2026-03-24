"use client";

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  Settings, 
  FolderKanban, 
  GraduationCap,
  ChevronDown,
  Users,
  Code2
} from 'lucide-react';
import { Project, ProjectMilestone } from '../../types/database';
import { projectsApi } from '../../lib/api/projects';
import { supabase } from '../../lib/supabase/client';

interface ProjectFormProps {
  project: Project;
  courseTitle: string;
  onClose: () => void;
  onSave: (updated: Project) => void;
}

export default function ProjectForm({ project, courseTitle, onClose, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(project.milestones || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleMilestoneChange = (index: number, field: keyof ProjectMilestone, value: any) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { 
      id: Math.random().toString(36).substr(2, 9), 
      project_id: project.id, 
      title: '', 
      description: '', 
      due_date: null, 
      marks: 0, 
      requires_sub: true, 
      order_index: milestones.length 
    }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { milestones: _, ...projectData } = formData;
      const updated = await projectsApi.updateProject(project.id, projectData);
      
      // Handle Milestones: Delete all and re-insert
      await (supabase.from('project_milestones') as any).delete().eq('project_id', project.id);
      
      if (milestones.length > 0) {
        const milestonesToInsert = milestones.map(({ id: _, ...item }) => ({
          ...item,
          project_id: project.id
        }));
        await (supabase.from('project_milestones') as any).insert(milestonesToInsert);
      }
      
      onSave({ ...updated, milestones });
      onClose();
    } catch (error) {
      console.error("Failed to save project", error);
    } finally {
      setIsSaving(false);
    }
  };

  const milestonesTotal = milestones.reduce((sum, item) => sum + (Number(item.marks) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Project</h2>
            <p className="text-sm text-gray-500 mt-1">Configure project type, team settings, and milestones</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Basic & Team */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Basic Information */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <FolderKanban size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Title *</label>
                    <input 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Capstone E-commerce App"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all resize-none font-medium"
                      rows={4}
                      value={formData.description || ""}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Outline the project goals and expectations..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tech Stack Tags (comma separated)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Code2 size={18} />
                      </div>
                      <input 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 pl-12 outline-none transition-all font-bold text-gray-700"
                        value={formData.tech_tags?.join(", ") || ""}
                        onChange={e => setFormData({...formData, tech_tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)})}
                        placeholder="React, Next.js, PostgreSQL..."
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Team Settings */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Users size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Team Configuration</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Type *</label>
                    <select 
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none font-bold text-gray-700"
                      value={formData.project_type}
                      onChange={e => setFormData({...formData, project_type: e.target.value as any})}
                    >
                      <option value="solo">Solo Project</option>
                      <option value="team">Team Project</option>
                      <option value="optional_team">Optional Team</option>
                    </select>
                  </div>

                  {formData.project_type !== 'solo' && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Min Team Size</label>
                        <input 
                          type="number"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none font-bold text-gray-700 text-center"
                          value={formData.team_size_min || 2}
                          onChange={e => setFormData({...formData, team_size_min: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max Team Size</label>
                        <input 
                          type="number"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none font-bold text-gray-700 text-center"
                          value={formData.team_size_max || 4}
                          onChange={e => setFormData({...formData, team_size_max: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Milestones & Toggles */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Toggles */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                {[
                  { label: "Certificate Credit", sub: "Passing required for cert", key: "cert_credit" },
                  { label: "Team formation enabled", sub: "Students can create teams", key: "team_formation" },
                  { label: "Show milestones to student", sub: "Visible progress tracking", key: "show_milestones" }
                ].map((opt) => (
                  <div key={opt.key} className="flex items-center justify-between group">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{opt.label}</h4>
                      <p className="text-[11px] text-gray-400 font-medium">{opt.sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={(formData as any)[opt.key] || false}
                        onChange={e => setFormData({...formData, [opt.key]: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </section>

              {/* Milestones */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Milestones</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Phases</label>
                    <button onClick={addMilestone} className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline">
                      <Plus size={14} /> Add Milestone
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {milestones.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-2xl space-y-3 relative group/m">
                        <button 
                          onClick={() => removeMilestone(idx)} 
                          className="absolute -right-2 -top-2 opacity-0 group-hover/m:opacity-100 p-2 bg-white text-gray-400 hover:text-rose-500 rounded-xl shadow-sm border border-gray-100 transition-all z-10"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <div className="space-y-2">
                          <input 
                            className="w-full bg-white border-none rounded-xl p-2 text-sm font-bold"
                            placeholder="Milestone title (e.g. Design Phase)"
                            value={item.title}
                            onChange={e => handleMilestoneChange(idx, 'title', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <input 
                                type="datetime-local"
                                className="w-full bg-white border-none rounded-xl p-2 text-[10px] font-bold text-gray-500 text-center"
                                value={item.due_date ? new Date(item.due_date).toISOString().slice(0, 16) : ""}
                                onChange={e => handleMilestoneChange(idx, 'due_date', e.target.value)}
                              />
                            </div>
                            <input 
                              type="number"
                              className="w-16 bg-white border-none rounded-xl p-2 text-sm font-bold text-center"
                              placeholder="Pts"
                              value={item.marks || 0}
                              onChange={e => handleMilestoneChange(idx, 'marks', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {milestones.length === 0 && (
                    <p className="text-center py-6 text-gray-400 text-xs font-medium italic">No milestones defined yet.</p>
                  )}

                  <div className="mt-4 p-3 bg-gray-900 rounded-2xl flex items-center justify-between text-white">
                    <span className="text-xs font-bold text-gray-400">Total assigned marks</span>
                    <span className="text-sm font-black">{milestonesTotal} pts</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-white sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:scale-95 flex items-center gap-2"
          >
            {isSaving ? "Saving..." : "Update Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
