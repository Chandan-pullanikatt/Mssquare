"use client";

import { useState, useEffect, useRef } from "react";
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
  CheckCircle2,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi, BusinessProject, ServiceRequest } from "@/lib/api/business";

// Helper to map icon names to Lucide components
const IconMap: Record<string, any> = {
  TrendingUp,
  Monitor,
  Banknote,
  ShieldCheck,
  Network,
  Settings,
  Clock
};

export default function BusinessDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      if (hasFetched.current === user.id) return;
      
      try {
        setLoading(true);
        const [projectsData, requestsData] = await Promise.all([
          businessApi.getProjects(user.id),
          businessApi.getServiceRequests(user.id)
        ]);
        setProjects(projectsData || []);
        setRequests(requestsData || []);
        hasFetched.current = user.id;
      } catch (err: any) {
        console.error("Error fetching business data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchData();
    }
  }, [user?.id, authLoading]);

  if (authLoading || (loading && projects.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-purple/20 border-t-primary-purple rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Business Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10 relative">
      {/* Subtle loading bar for background re-fetches */}
      {loading && projects.length > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden z-50 rounded-full">
          <div className="h-full bg-primary-purple animate-progress-fast w-1/3"></div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">
          {user ? `Welcome back, ${user.user_metadata?.full_name || 'Business Partner'}` : 'Welcome to your Business Portal'}
        </h1>
        <p className="text-gray-500 font-medium text-[15px]">
          Monitor your consultancy performance and project milestones at a glance.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Active Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Folder className="text-[#8b5cf6]" size={20} />
            <h2 className="text-xl font-bold font-heading text-gray-900 italic">Active Projects</h2>
          </div>
          <Link href="/business/tracking" className="text-[#8b5cf6] text-sm font-bold hover:underline">
            View All
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Folder size={24} />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No Active Projects</h3>
            <p className="text-sm text-gray-500 mb-6">You haven't started any projects yet.</p>
            <Link 
              href="/business/submit-requirement"
              className="inline-flex items-center gap-2 bg-[#8b5cf6] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-[#8b5cf6]/20 hover:shadow-xl transition-all"
            >
              Start New Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => {
              const Icon = IconMap[project.icon_name || 'TrendingUp'] || TrendingUp;
              return (
                <div key={project.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#8b5cf6]/20 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6]">
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      project.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#8b5cf6] transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-1 italic">
                    {project.description}
                  </p>
                  
                  {project.status === 'Delivered' ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-auto bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                      <Calendar size={14} className="text-gray-400" />
                      Completed on {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#8b5cf6] h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Main Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Recent Service Requests */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-bold font-heading text-gray-900 italic">Recent Service Requests</h2>
              <Link href="/business/services" className="text-[#8b5cf6] text-[11px] font-bold tracking-widest uppercase hover:underline">
                Manage All
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {requests.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm font-medium text-gray-400">No recent requests found.</p>
                </div>
              ) : (
                requests.slice(0, 3).map((request) => (
                  <div key={request.id} className="p-6 md:p-8 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] shrink-0">
                      {request.status === 'Approved' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#8b5cf6] transition-colors mb-0.5">{request.title}</h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {request.service_type}
                      </p>
                    </div>
                    <span className={`border text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:block ${
                      request.status === 'Approved' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                      : request.status === 'Pending Review'
                      ? 'bg-amber-50 text-amber-600 border-amber-100/50'
                      : 'bg-blue-50 text-blue-600 border-blue-100/50'
                    }`}>
                      {request.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors ml-2" />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Activity Feed Visualization */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 md:p-8">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-6 italic">Performance Insights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Spent</div>
                <div className="text-lg font-black text-gray-900 italic">$12,450</div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Expert Hours</div>
                <div className="text-lg font-black text-gray-900 italic">84h</div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Resources</div>
                <div className="text-lg font-black text-gray-900 italic">12</div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Satisfaction</div>
                <div className="text-lg font-black text-gray-900 italic">98%</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div>
          {/* Consultation Schedule (Simplified for dynamic context) */}
          <section className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold font-heading text-gray-900 italic">Consultation Schedule</h2>
              <Calendar className="text-gray-400" size={20} />
            </div>

            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Video size={24} />
              </div>
              <h3 className="text-gray-900 font-bold text-sm mb-1 italic">No Upcoming Sessions</h3>
              <p className="text-xs text-gray-400 mb-6 px-4">Connect with our consultants to schedule your next review.</p>
              
              <button className="w-full py-3.5 border border-dashed border-gray-300 rounded-2xl text-xs font-bold text-[#8b5cf6] hover:bg-gray-50 transition-colors uppercase tracking-widest group">
                Schedule New Session
                <PlusCircle className="inline-block ml-2 group-hover:rotate-90 transition-transform" size={14} />
              </button>
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}
