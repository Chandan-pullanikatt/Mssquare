"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  TrendingUp,
  Monitor,
  Banknote,
  ShieldCheck,
  Network,
  Settings,
  Calendar,
  Video,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Activity,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi, BusinessProject, ServiceRequest } from "@/lib/api/business";

export default function BusinessAdminDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        setLoading(true);
        const [projectsData, requestsData] = await Promise.all([
          businessApi.getAdminProjects(),
          businessApi.getAdminServiceRequests()
        ]);
        setProjects(projectsData);
        setRequests(requestsData);
      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && (role === 'business_admin' || role === 'cms_admin')) {
      fetchAdminData();
    }
  }, [role, authLoading]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await businessApi.updateRequestStatus(id, newStatus);
      // Refresh data
      const updatedRequests = await businessApi.getAdminServiceRequests();
      setRequests(updatedRequests);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  if (authLoading || (loading && projects.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
        <p className="text-gray-500 font-medium italic">Loading administrative overview...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'Pending Review');
  const activeProjectsCount = projects.filter(p => p.status !== 'Delivered').length;

  return (
    <div className="space-y-10 pb-10">

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-[#f5f3ff] text-[#8b5cf6] rounded-xl flex items-center justify-center mb-4">
            <Briefcase size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900 italic">{pendingRequests.length}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pending Requests</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Activity size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900 italic">{activeProjectsCount}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Active Projects</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900 italic">{projects.filter(p => p.status === 'Delivered').length}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Projects Delivered</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Monitor size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900 italic">{requests.length}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Requests</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Service Requests */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-bold font-heading text-gray-900 italic">Incoming Client Requests</h2>
              <span className="text-[10px] font-bold text-[#8b5cf6] bg-[#f5f3ff] px-3 py-1 rounded-full uppercase tracking-tighter">Real-time Feed</span>
            </div>

            <div className="divide-y divide-gray-50">
              {requests.length === 0 ? (
                <div className="p-12 text-center text-gray-400 italic">No client requests to manage.</div>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                           <User size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{request.title}</h4>
                          <p className="text-[11px] text-[#8b5cf6] font-bold uppercase tracking-wider">{request.profiles?.email || 'Unknown Client'}</p>
                        </div>
                      </div>
                      <select 
                        value={request.status}
                        onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                        className={`text-[11px] font-black px-4 py-1.5 rounded-full border outline-none cursor-pointer transition-all ${
                          request.status === 'Pending Review' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          request.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          'bg-blue-50 text-blue-600 border-blue-200'
                        }`}
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Under Analysis">Under Analysis</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service</div>
                        <div className="text-xs font-bold text-gray-700">{request.service_type || 'Custom'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget</div>
                        <div className="text-xs font-bold text-gray-700">{request.budget || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                        <div className="text-xs font-bold text-gray-700">{request.timeline || 'Flexible'}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                       <p className="text-xs text-gray-500 italic max-w-md truncate">"{request.description}"</p>
                       <span className="text-[10px] font-bold text-gray-400">{new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Active Projects Breakdown */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
            <h2 className="text-lg font-bold font-heading text-gray-900 mb-6 italic">Active Projects Tracking</h2>
            
            <div className="space-y-6">
              {projects.length === 0 ? (
                <div className="text-sm text-gray-400 italic text-center py-10">No projects currently tracked.</div>
              ) : (
                projects.filter(p => p.status !== 'Delivered').map((project) => (
                  <div key={project.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-gray-800">{project.title}</h4>
                      <span className="text-[10px] font-bold text-[#8b5cf6]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#8b5cf6] h-full transition-all duration-1000" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                       <span>{project.profiles?.email?.split('@')[0]}</span>
                       <span>{project.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-8 py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
              Manage All Projects
            </button>
          </section>

          <section className="bg-[#8b5cf6] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#8b5cf6]/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <h3 className="text-lg font-bold italic mb-2">Performance Analytics</h3>
            <p className="text-white/70 text-xs mb-6 font-medium">Monthly revenue and expert utilization metrics are now available.</p>
            <Link href="/admin/business/analytics" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-[#8b5cf6] px-6 py-3 rounded-xl transition-all hover:gap-3">
              View Report
              <ChevronRight size={14} />
            </Link>
          </section>
        </div>

      </div>
    </div>
  );
}

