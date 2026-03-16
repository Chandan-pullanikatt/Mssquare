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
  Trash2
} from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { supabase } from "@/lib/supabaseClient";

export default function LeadsManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
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
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Building2 size={14} className="text-gray-400" />
          {val || "N/A"}
        </div>
      )
    },
    {
      header: "Message",
      accessor: "message",
      render: (val: string) => (
        <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{val || "No message"}</p>
      )
    },
    { 
      header: "Date", 
      accessor: "created_at",
      render: (val: string) => (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <Calendar size={14} />
          {new Date(val).toLocaleDateString()}
        </div>
      )
    },
    {
      header: "Status",
      accessor: "id",
      render: () => (
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
          New Lead
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-20">
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
          searchPlaceholder="Search leads by name, email or company..."
          actions={
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all">
                <CheckCircle2 size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}
