"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Mail,
  Building2,
  Calendar,
  Trash2,
  X,
  Eye
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { supabase } from "@/lib/supabase/client";

export default function LeadsManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, email, company, message, source, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
        setLeads(leads.filter(l => l.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete lead.");
      }
    }
  };

  const exportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Company,Message,Date"].join(",") + "\n"
      + leads.map(l => `${l.name},${l.email},${l.company || ""},"${l.message?.replace(/"/g, '""') || ""}",${new Date(l.created_at).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mssquare_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: "Lead Info",
      accessor: "name",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-sm font-bold text-rose-600 border border-rose-100">
            {val?.charAt(0) || "L"}
          </div>
          <div>
            <div className="font-bold text-gray-900">{val || "Anonymous"}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Mail size={10} />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Company",
      accessor: "company",
      render: (val: string) => (
        <div className="flex items-center gap-2 text-gray-600 italic">
          <Building2 size={14} className="text-gray-400" />
          {val || "Not provided"}
        </div>
      )
    },
    {
      header: "Enquiry",
      accessor: "message",
      render: (val: string, row: any) => (
        <div 
          className="max-w-[200px] truncate text-gray-500 cursor-pointer hover:text-purple-600 transition-colors"
          onClick={() => setSelectedLead(row)}
        >
          {val || "No message"}
        </div>
      )
    },
    {
      header: "Source",
      accessor: "source",
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border whitespace-nowrap ${
          val?.includes('Signup') ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
          'bg-rose-50 text-rose-600 border-rose-100'
        }`}>
          {val || "Direct Lead"}
        </span>
      )
    },
    { 
      header: "Date", 
      accessor: "created_at",
      render: (val: string) => (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <Calendar size={14} />
          {val ? new Date(val).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      header: "Details",
      accessor: "id",
      render: (_: any, row: any) => (
        <button 
          onClick={() => setSelectedLead(row)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all text-[10px] font-bold uppercase tracking-wider"
        >
          <Eye size={14} />
          View
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Leads & Inquiries</h1>
          <p className="text-gray-500 font-medium">View and manage potential business inquiries from the website.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportLeads}
            className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Inquiries</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{leads.length}</div>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resolved</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">0</div>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{leads.length}</div>
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          showRowActions={false}
          searchPlaceholder="Search leads by name, email or company..."
          actions={
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchLeads}
                className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                title="Refresh"
              >
                <Clock size={18} />
              </button>
            </div>
          }
        />
      )}

      {/* Enquiry Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight italic">Enquiry Details</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{selectedLead.source || "Direct Lead"}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</span>
                  <p className="font-bold text-gray-900">{selectedLead.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                  <p className="font-bold text-gray-900">{selectedLead.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</span>
                  <p className="font-bold text-gray-900">{selectedLead.company || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</span>
                  <p className="font-bold text-gray-900">{new Date(selectedLead.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Content</span>
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 font-medium leading-relaxed whitespace-pre-wrap border border-gray-100 min-h-[150px]">
                  {selectedLead.message || "No message content provided."}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  handleDelete(selectedLead.id);
                  setSelectedLead(null);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-rose-50 text-rose-500 font-bold transition-all"
              >
                <Trash2 size={18} />
                Delete Enquiry
              </button>
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:shadow-lg transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
