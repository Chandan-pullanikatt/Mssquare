"use client";

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Clock, 
  Settings, 
  ClipboardCheck, 
  GraduationCap,
  ChevronDown,
  Info
} from 'lucide-react';
import { Assignment, AssignmentRubric } from '../../types/database';
import { assignmentsApi } from '../../lib/api/assignments';
import { supabase } from '../../lib/supabase/client';

interface AssignmentFormProps {
  assignment: Assignment;
  courseTitle: string;
  onClose: () => void;
  onSave: (updated: Assignment) => void;
}

export default function AssignmentForm({ assignment, courseTitle, onClose, onSave }: AssignmentFormProps) {
  const [formData, setFormData] = useState<Assignment>(assignment);
  const [rubric, setRubric] = useState<AssignmentRubric[]>(assignment.rubric || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleRubricChange = (index: number, field: keyof AssignmentRubric, value: any) => {
    const newRubric = [...rubric];
    newRubric[index] = { ...newRubric[index], [field]: value };
    setRubric(newRubric);
  };

  const addRubricItem = () => {
    setRubric([...rubric, { 
      id: Math.random().toString(36).substr(2, 9), 
      assignment_id: assignment.id, 
      criterion: '', 
      max_marks: 0, 
      order_index: rubric.length 
    }]);
  };

  const removeRubricItem = (index: number) => {
    setRubric(rubric.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update the assignment itself
      const { rubric: _, ...assignmentData } = formData;
      const updated = await assignmentsApi.updateAssignment(assignment.id, assignmentData);
      
      // 2. Handle Rubric: For simplicity, delete all existing and re-insert
      // This ensures the order and content match exactly what's in the state
      await (supabase.from('assignment_rubric') as any).delete().eq('assignment_id', assignment.id);
      
      if (rubric.length > 0) {
        const rubricToInsert = rubric.map(({ id: _, ...item }) => ({
          ...item,
          assignment_id: assignment.id
        }));
        await (supabase.from('assignment_rubric') as any).insert(rubricToInsert);
      }
      
      onSave({ ...updated, rubric });
      onClose();
    } catch (error) {
      console.error("Failed to save assignment", error);
    } finally {
      setIsSaving(false);
    }
  };

  const rubricTotal = rubric.reduce((sum, item) => sum + (Number(item.max_marks) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Assignment</h2>
            <p className="text-sm text-gray-500 mt-1">Configure details, grading, and rubric</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Basic & Submission */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Basic Information */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <ClipboardCheck size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assignment Title *</label>
                    <input 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Build a REST API with Node.js"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course *</label>
                    <div className="relative">
                      <select 
                        disabled
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none appearance-none font-medium text-gray-500 italic"
                      >
                        <option>{courseTitle}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instructions</label>
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all resize-none font-medium"
                      rows={4}
                      value={formData.description || ""}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe what students must build..."
                    />
                    <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-1">
                      <Info size={12} />
                      Describe the deliverables, requirements, and submission format.
                    </p>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Instructions file (optional)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-white hover:border-purple-300 transition-all cursor-pointer group">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-purple-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-500 text-center">
                        Upload brief PDF or doc — <span className="text-purple-600">drag & drop or click</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Submission Settings */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Settings size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Submission Settings</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Submission Type *</label>
                    <select className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none font-bold text-gray-700">
                      <option>File upload</option>
                      <option>Text entry</option>
                      <option>External link</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max Attempts</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none font-bold"
                      value={formData.max_attempts || 0}
                      onChange={e => setFormData({...formData, max_attempts: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max File Size (MB)</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none font-bold"
                      value={formData.max_file_mb || 25}
                      onChange={e => setFormData({...formData, max_file_mb: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Allowed Formats</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['PDF', 'ZIP', 'PNG', 'DOCX'].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100">
                          {tag}
                        </span>
                      ))}
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-200 transition-colors">
                        + Add Format
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Schedule, Options & Grading */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Schedule */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Schedule</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available from</label>
                    <input 
                      type="datetime-local"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-gray-700"
                      value={formData.available_from ? new Date(formData.available_from).toISOString().slice(0, 16) : ""}
                      onChange={e => setFormData({...formData, available_from: e.target.value ? new Date(e.target.value).toISOString() : null})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due date *</label>
                    <input 
                      type="datetime-local"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-2xl p-4 outline-none transition-all font-bold text-gray-700"
                      value={formData.due_date ? new Date(formData.due_date).toISOString().slice(0, 16) : ""}
                      onChange={e => setFormData({...formData, due_date: e.target.value ? new Date(e.target.value).toISOString() : null})}
                    />
                  </div>
                </div>
              </section>

              {/* Options (Toggles) */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                {[
                  { label: "Allow late submissions", sub: "Accept after due date", key: "allow_late" },
                  { label: "Peer review", sub: "Students review each other", key: "peer_review" },
                  { label: "Count toward certificate", sub: "Passing required for cert", key: "cert_credit" },
                  { label: "Show marks to student", sub: "Visible after grading", key: "show_marks" }
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

              {/* Grading & Rubric */}
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Grading</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-center"
                      value={formData.max_marks || 0}
                      onChange={e => setFormData({...formData, max_marks: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pass</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-center"
                      value={formData.pass_mark || 0}
                      onChange={e => setFormData({...formData, pass_mark: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weight %</label>
                    <input 
                      type="number"
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-center"
                      defaultValue={20}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rubric</label>
                    <button onClick={addRubricItem} className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline">
                      <Plus size={14} /> Add Criterion
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {rubric.map((item, idx) => (
                      <div key={item.id} className="flex gap-2">
                        <input 
                          className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sm font-medium"
                          placeholder="Criterion name"
                          value={item.criterion}
                          onChange={e => handleRubricChange(idx, 'criterion', e.target.value)}
                        />
                        <input 
                          type="number"
                          className="w-20 bg-gray-50 border-none rounded-xl p-3 text-sm font-bold text-center"
                          placeholder="Marks"
                          value={item.max_marks}
                          onChange={e => handleRubricChange(idx, 'max_marks', e.target.value)}
                        />
                        <button onClick={() => removeRubricItem(idx)} className="p-3 text-gray-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 p-3 rounded-2xl flex items-center justify-between ${rubricTotal === formData.max_marks ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    <span className="text-xs font-bold">Rubric total allocated</span>
                    <span className="text-sm font-black">{rubricTotal} / {formData.max_marks || 0} pts</span>
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
            {isSaving ? "Saving..." : "Save Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
