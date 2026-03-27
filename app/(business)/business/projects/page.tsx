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
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi, BusinessProject, ServiceRequest } from "@/lib/api/business";

const IconMap: Record<string, any> = {
  TrendingUp,
  Monitor,
  Banknote,
  ShieldCheck,
  Network,
  Settings
};

const ProjectSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-100"></div>
            <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
        </div>
        <div className="h-6 w-48 bg-gray-100 rounded mb-2"></div>
        <div className="h-16 w-full bg-gray-50 rounded mb-8"></div>
        <div className="space-y-3 mt-auto">
            <div className="h-3 w-full bg-gray-100 rounded"></div>
            <div className="h-2 w-full bg-gray-100 rounded-full"></div>
        </div>
    </div>
);

import { useSearch } from "@/components/providers/SearchProvider";

export default function BusinessProjectsPage() {
  const { user, authLoading } = useAuth() as any;
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending'>('all');

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    async function fetchAllData() {
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
        setError("Failed to load your projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchAllData();
    }
  }, [user?.id, authLoading]);

  // Merge projects and requests for a unified view
  const allItems = [
    ...projects.map(p => ({ ...p, itemType: 'project' as const })),
    ...requests.map(r => ({ ...r, itemType: 'request' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredItems = allItems.filter(item => {
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'active') return matchesSearch && item.itemType === 'project';
    if (activeTab === 'pending') return matchesSearch && item.itemType === 'request';
    return matchesSearch;
  });

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">My Projects</h1>
          <p className="text-gray-600 font-medium">Track your active consulting projects and pending service requests.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-400"
                />
            </div>
            <Link href="/business/submit-requirement" className="hidden md:flex items-center gap-2 bg-[#8b5cf6] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all">
                <PlusCircle size={18} />
                New Request
            </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit border border-gray-100">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          All Items ({allItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Active Projects ({projects.length})
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Pending Requests ({requests.length})
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[2.5rem] p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
              <Folder size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 italic">No Items Found</h3>
            <p className="text-gray-600 max-w-xs mx-auto mb-8 font-medium">
                {searchQuery ? "No projects or requests match your search criteria." : "You don't have any items in this category yet."}
            </p>
            {!searchQuery && (
              <Link href="/business/submit-requirement" className="bg-[#8b5cf6] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#8b5cf6]/20 hover:scale-105 transition-all inline-block">
                Start New Project
              </Link>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: any) => {
            const isProject = item.itemType === 'project';
            const Icon = isProject ? (IconMap[item.icon_name || 'TrendingUp'] || TrendingUp) : Briefcase;
            
            return (
              <div key={item.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#8b5cf6]/20 transition-all hover:shadow-xl hover:shadow-black/5 group cursor-pointer relative overflow-hidden">
                {/* Type Badge */}
                <div className="absolute top-0 right-0 p-4">
                     <span className={`text-[9px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-widest absolute top-0 right-0 ${
                        isProject ? 'bg-[#8b5cf6] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {item.itemType}
                    </span>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest ${
                    item.status === 'Delivered' || item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-xl text-gray-900 mb-3 group-hover:text-[#8b5cf6] transition-colors italic line-clamp-1">{item.title}</h3>
                <p className="text-[14px] text-gray-600 mb-10 leading-relaxed flex-1 italic line-clamp-3">
                  {item.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-50">
                    {isProject ? (
                        item.status === 'Delivered' ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                <CheckCircle2 size={16} />
                                Project Delivered
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-gray-500">Current Progress</span>
                                    <span className="text-[#8b5cf6]">{item.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden p-0.5 border border-gray-100">
                                    <div 
                                        className="bg-gradient-to-r from-[#8b5cf6] to-purple-400 h-full rounded-full transition-all duration-1000 shadow-sm" 
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                <Clock size={16} className="text-gray-400" />
                                Requested on {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest bg-[#f5f3ff] px-2 py-1 rounded-md">
                                {item.service_type}
                            </div>
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
