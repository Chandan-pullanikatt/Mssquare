"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Settings, 
  ChevronRight, 
  Clock, 
  User, 
  AlertCircle, 
  TrendingUp,
  Mail,
  MoreVertical,
  Activity,
  CheckCircle2,
  Search
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi, BusinessProject } from "@/lib/api/business";

import { useSearch } from "@/components/providers/SearchProvider";

export default function AdminProjectsPage() {
  const { user, role, loading: authLoading } = useAuth() as any;
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      if (user?.id && hasFetched.current === user.id) return;
      
      try {
        setLoading(true);
        const data = await businessApi.getAdminProjects();
        setProjects(data || []);
        if (user?.id) hasFetched.current = user.id;
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load active projects.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && (role === 'business_admin' || role === 'cms_admin' || role === 'lms_admin')) {
      fetchProjects();
    }
  }, [user?.id, role, authLoading]);

  const handleUpdateProgress = async (id: string, progress: number) => {
    setUpdatingId(id);
    try {
      const status = progress === 100 ? 'Delivered' : 'Active';
      await businessApi.updateProjectProgress(id, progress, status);
      
      // Local update
      setProjects(prev => prev.map(p => p.id === id ? { ...p, progress, status } : p));
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update progress.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p as any).profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading active projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">Project Management</h1>
          <p className="text-gray-500 font-medium">Monitor delivery progress and manage client expectations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter">
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="lg:col-span-2 bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 italic">No Active Projects</h3>
            <p className="text-gray-500">There are no projects currently under your management.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:border-[#8b5cf6]/30 transition-all group overflow-hidden relative">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6]">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 italic leading-tight mb-1">{project.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <User size={12} />
                       {(project as any).profiles?.email || 'Unknown Client'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 text-gray-400 hover:text-[#8b5cf6] hover:bg-gray-50 rounded-lg transition-all">
                      <Mail size={18} />
                   </button>
                   <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                      <MoreVertical size={18} />
                   </button>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-400">Delivery Status</span>
                     <span className="text-[#8b5cf6]">{project.progress}% Complete</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8b5cf6] to-purple-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {[25, 50, 75, 100].map(val => (
                    <button 
                      key={val}
                      onClick={() => handleUpdateProgress(project.id, val)}
                      disabled={updatingId === project.id}
                      className={`flex-1 py-2 text-[9px] font-black rounded-lg border transition-all ${
                        project.progress >= val 
                          ? 'bg-[#8b5cf6] text-white border-[#8b5cf6]' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <Clock size={12} />
                  Last Updated: {new Date(project.created_at).toLocaleDateString()}
                </div>
                {project.status === 'Delivered' ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} />
                    Delivered
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[#8b5cf6] text-[10px] font-black uppercase tracking-widest">
                    <Activity size={14} className="animate-pulse" />
                    In Progress
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
