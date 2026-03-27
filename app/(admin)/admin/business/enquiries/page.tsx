"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Send,
  Maximize2,
  X
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi } from "@/lib/api/business";

import { useSearch } from "@/components/providers/SearchProvider";

export default function AdminEnquiriesPage() {
  const { user, role, loading: authLoading } = useAuth() as any;
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [activeFilter, setActiveFilter] = useState<'all' | 'Open' | 'In Progress' | 'Closed'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Expanded Reply Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [activeReplyEnquiry, setActiveReplyEnquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    async function fetchEnquiries() {
      if (user?.id && hasFetched.current === user.id) return;
      
      try {
        setLoading(true);
        const data = await businessApi.getAdminEnquiries();
        setEnquiries(data || []);
        if (user?.id) hasFetched.current = user.id;
      } catch (err) {
        console.error("Error fetching enquiries:", err);
        setError("Failed to load enquiries.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && (role === 'business_admin' || role === 'cms_admin')) {
      fetchEnquiries();
    }
  }, [user?.id, role, authLoading]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      await businessApi.updateEnquiryStatus(id, status);
      const updated = await businessApi.getAdminEnquiries();
      setEnquiries(updated);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update enquiry status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendReply = async (id: string, text: string) => {
    if (!text) return;
    setProcessingId(id);
    try {
      const response = await fetch('/api/business/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin_reply: text })
      });
      if (!response.ok) throw new Error('Failed to reply');
      
      const updated = await businessApi.getAdminEnquiries();
      setEnquiries(updated);
      setIsReplyModalOpen(false);
      setReplyText("");
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = e.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter !== 'all') return matchesSearch && e.status === activeFilter;
    return matchesSearch;
  });

  if (loading && enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading client queries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">User Enquiries</h1>
          <p className="text-gray-500 font-medium">Respond to client doubts and manage workspace queries.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['all', 'Open', 'In Progress', 'Closed'] as const).map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${activeFilter === filter ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {filter}
              </button>
            ))}
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
        {filteredEnquiries.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 italic">No Enquiries Found</h3>
            <p className="text-gray-500">Clients haven't submitted any doubts matching these criteria.</p>
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                 <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                    enquiry.status === 'Open' ? 'bg-amber-50 text-amber-600' : 
                    enquiry.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                    'bg-emerald-50 text-emerald-600'
                 }`}>
                    {enquiry.status}
                 </span>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Client Info */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] border border-[#8b5cf6]/10">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 italic line-clamp-1">
                        {enquiry.profiles?.full_name || enquiry.profiles?.email?.split('@')[0] || 'Client'}
                      </h4>
                      <p className="text-[10px] text-[#8b5cf6] font-black uppercase tracking-tighter truncate max-w-[150px]">
                        {enquiry.profiles?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      Received {new Date(enquiry.created_at).toLocaleDateString()}
                    </div>
                    {enquiry.project_id && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest bg-[#f5f3ff] px-3 py-1 rounded-lg w-fit">
                        Related to Project
                      </div>
                    )}
                    {enquiry.request_id && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg w-fit">
                        Related to Request
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 italic">{enquiry.subject}</h3>
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 leading-relaxed text-gray-700 text-sm italic">
                      "{enquiry.message}"
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/4 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-50 pt-6 lg:pt-0 lg:pl-8">
                  
                  {enquiry.status === 'Closed' ? (
                    <button 
                      onClick={() => handleUpdateStatus(enquiry.id, 'Open')}
                      disabled={processingId === enquiry.id}
                      className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200"
                    >
                      {processingId === enquiry.id ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : 'Re-open Query'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative group/reply">
                        <textarea
                          id={`reply-${enquiry.id}`}
                          placeholder="Type your response..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-3 pr-10 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none resize-none transition-all"
                          rows={3}
                        />
                        <button 
                          onClick={() => {
                            const currentText = (document.getElementById(`reply-${enquiry.id}`) as HTMLTextAreaElement)?.value;
                            setReplyText(currentText);
                            setActiveReplyEnquiry(enquiry);
                            setIsReplyModalOpen(true);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 border border-gray-100 text-gray-400 hover:text-[#8b5cf6] hover:border-[#8b5cf6]/20 transition-all opacity-0 group-hover/reply:opacity-100"
                          title="Enlarge reply box"
                        >
                          <Maximize2 size={12} />
                        </button>
                      </div>
                      <button 
                        onClick={async () => {
                          const replyText = (document.getElementById(`reply-${enquiry.id}`) as HTMLTextAreaElement)?.value;
                          handleSendReply(enquiry.id, replyText);
                        }}
                        disabled={processingId === enquiry.id}
                        className="w-full bg-[#8b5cf6] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all text-xs"
                      >
                        {processingId === enquiry.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={14} />
                            Send Response
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => handleUpdateStatus(enquiry.id, 'Closed')}
                        className="w-full py-2.5 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest"
                      >
                        Mark Fixed Without Reply
                      </button>
                    </div>
                  )}

                  <a 
                    href={`mailto:${enquiry.profiles?.email}?subject=Re: ${enquiry.subject}`}
                    className="w-full py-2 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-[9px] uppercase tracking-tighter"
                  >
                    Direct Email Reply
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Expanded Reply Modal */}
      {isReplyModalOpen && activeReplyEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-50">
              <div>
                <h2 className="text-xl font-black text-gray-900 italic">Expand Reply</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  Replying to: {activeReplyEnquiry.profiles?.full_name}
                </p>
              </div>
              <button 
                onClick={() => setIsReplyModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                 <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest mb-1">User's Message:</p>
                 <p className="text-sm italic text-gray-600">"{activeReplyEnquiry.message}"</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Response</label>
                  <textarea
                    required
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a detailed response here..."
                    rows={8}
                    className="w-full mt-2 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-[#8b5cf6]/10 outline-none transition-all placeholder:text-gray-300 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSendReply(activeReplyEnquiry.id, replyText)}
                disabled={processingId === activeReplyEnquiry.id || !replyText}
                className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
              >
                {processingId === activeReplyEnquiry.id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
