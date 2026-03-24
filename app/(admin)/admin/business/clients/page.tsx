"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  User, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi } from "@/lib/api/business";

export default function AdminClientsPage() {
  const { user, role, loading: authLoading } = useAuth() as any;
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      if (user?.id && hasFetched.current === user.id) return;
      
      try {
        setLoading(true);
        const data = await businessApi.getAdminClients();
        setClients(data || []);
        if (user?.id) hasFetched.current = user.id;
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load business clients.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && (role === 'business_admin' || role === 'cms_admin' || role === 'lms_admin')) {
      fetchClients();
    }
  }, [user?.id, role, authLoading]);

  const filteredClients = clients.filter(c => 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading client directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">Client Directory</h1>
          <p className="text-gray-500 font-medium">Manage all business partners and their engagement history.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statistics</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Engagement</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic">No business clients found.</td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] font-extrabold shadow-sm border border-[#8b5cf6]/10">
                           {client.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-black text-gray-900 italic">
                            {client.full_name || client.email?.split('@')[0] || 'Unknown'}
                          </div>
                          <div className="text-[11px] font-medium text-gray-400 group-hover:text-[#8b5cf6] transition-colors">
                            {client.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-black text-gray-900">{client.service_requests?.[0]?.count || 0}</div>
                          <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Requests</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-black text-[#8b5cf6]">{client.business_projects?.[0]?.count || 0}</div>
                          <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Projects</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="w-24 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                          <div 
                            className="bg-[#8b5cf6] h-full" 
                            style={{ width: `${Math.min(((client.service_requests?.[0]?.count || 0) * 10), 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Activity Tier</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase tracking-tighter">
                        {client.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#8b5cf6] hover:border-[#8b5cf6]/30 shadow-sm transition-all group/btn">
                          <Mail size={16} />
                        </button>
                        <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 shadow-sm transition-all">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#f5f3ff] p-6 rounded-[2rem] border border-[#8b5cf6]/10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white text-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Expertise Shared</h4>
            <div className="text-xl font-bold text-gray-900 italic">{clients.reduce((acc, c) => acc + (c.business_projects?.[0]?.count || 0), 0)} Projects Active</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm shadow-black/5">
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Partner Growth</h4>
            <div className="text-xl font-bold text-gray-900 italic">+12% Since Last Month</div>
          </div>
        </div>
        <div className="bg-[#8b5cf6] p-6 rounded-[2rem] text-white flex items-center gap-4 shadow-xl shadow-[#8b5cf6]/20">
          <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center">
             <MessageSquare size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Bulk Communication</h4>
            <div className="text-md font-bold italic">Notify All Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
}
