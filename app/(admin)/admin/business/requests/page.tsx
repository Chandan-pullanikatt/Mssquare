"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertCircle, 
  ArrowRight,
  Filter,
  Search,
  MessageSquare,
  Zap
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi, ServiceRequest } from "@/lib/api/business";

export default function AdminRequestsPage() {
  const { user, role, loading: authLoading } = useAuth() as any;
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      if (user?.id && hasFetched.current === user.id) return;
      
      try {
        setLoading(true);
        const data = await businessApi.getAdminServiceRequests();
        setRequests(data || []);
        if (user?.id) hasFetched.current = user.id;
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load service requests.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && (role === 'business_admin' || role === 'cms_admin' || role === 'lms_admin')) {
      fetchRequests();
    }
  }, [user?.id, role, authLoading]);

  const handleApprove = async (request: ServiceRequest) => {
    if (!confirm(`Are you sure you want to approve "${request.title}" and convert it to a project?`)) return;
    
    setProcessingId(request.id);
    try {
      await businessApi.approveRequest(
        request.id,
        request.user_id,
        request.title,
        request.description || `Service Project: ${request.service_type}`
      );
      
      // Refresh list
      const updated = await businessApi.getAdminServiceRequests();
      setRequests(updated);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve request.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r as any).profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'pending') return matchesSearch && r.status === 'Pending Review';
    if (activeFilter === 'approved') return matchesSearch && r.status === 'Approved';
    return matchesSearch;
  });

  if (loading && requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading incoming requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">Client Requests</h1>
          <p className="text-gray-500 font-medium">Review and approve incoming business requirements from clients.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${activeFilter === 'all' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-500'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${activeFilter === 'pending' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-500'}`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 italic">No Requests Found</h3>
            <p className="text-gray-500">There are no client requests matching your current filters.</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                 <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                    request.status === 'Pending Review' ? 'bg-amber-50 text-amber-600' : 
                    request.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                 }`}>
                    {request.status}
                 </span>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Client Info */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#8b5cf6] border border-gray-100">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 italic line-clamp-1">{request.contact_name || 'Anonymous'}</h4>
                      <p className="text-[10px] text-[#8b5cf6] font-black uppercase tracking-tighter truncate max-w-[150px]">
                        {(request as any).profiles?.email || 'No Email'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <MessageSquare size={14} className="text-gray-400" />
                      {request.contact_method} preferred
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      Received {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Request Content */}
                <div className="lg:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 italic">{request.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                      {request.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Service</p>
                      <p className="text-xs font-bold text-gray-700">{request.service_type || 'Consulting'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-xs font-bold text-gray-700">{request.budget || 'Custom'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                      <p className="text-xs font-bold text-gray-700">{request.timeline || 'TBD'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-50 pt-6 lg:pt-0 lg:pl-8">
                  {request.status === 'Pending Review' ? (
                    <button 
                      onClick={() => handleApprove(request)}
                      disabled={processingId === request.id}
                      className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                    >
                      {processingId === request.id ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap size={18} />
                          Approve & Launch
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm">
                      <CheckCircle2 size={18} />
                      Already Approved
                    </div>
                  )}
                  <button className="w-full mt-3 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    Message Client
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
