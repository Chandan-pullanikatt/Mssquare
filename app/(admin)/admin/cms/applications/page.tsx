"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileUser, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone,
  Calendar,
  Trash2,
  ExternalLink,
  Briefcase,
  MessageSquare,
  ChevronRight,
  UserCheck,
  XCircle,
  Eye
} from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { supabase } from "@/lib/supabase/client";

type ApplicationType = 'career' | 'instructor';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as ApplicationType || 'career';
  
  const [activeTab, setActiveTab] = useState<ApplicationType>(
    ['career', 'instructor'].includes(initialTab) ? initialTab : 'career'
  );
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update tab if URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') as ApplicationType;
    if (tab && ['career', 'instructor'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const table = activeTab === 'career' ? 'career_applications' : 'instructor_applications';
      const { data, error } = await (supabase
        .from(table as any) as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const table = activeTab === 'career' ? 'career_applications' : 'instructor_applications';
    try {
      const { error } = await (supabase
        .from(table as any) as any)
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      const table = activeTab === 'career' ? 'career_applications' : 'instructor_applications';
      try {
        const { error } = await (supabase.from(table as any) as any).delete().eq('id', id);
        if (error) throw error;
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete application.");
      }
    }
  };

  const getResumeUrl = (path: string) => {
    const { data } = supabase.storage.from('applications').getPublicUrl(path);
    return data.publicUrl;
  };

  const careerColumns = [
    {
      header: "Applicant",
      accessor: "full_name",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-sm font-bold text-purple-600 border border-purple-100">
            {val?.charAt(0) || "A"}
          </div>
          <div>
            <div className="font-bold text-gray-900">{val}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Mail size={10} />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Position",
      accessor: "position",
      render: (val: string) => (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Briefcase size={14} className="text-purple-400" />
          {val}
        </div>
      )
    },
    {
        header: "Contact",
        accessor: "phone",
        render: (val: string) => (
          <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <Phone size={12} className="text-gray-400" />
            {val || "N/A"}
          </div>
        )
    },
    {
      header: "Resume",
      accessor: "resume_url",
      render: (val: string) => (
        <a 
          href={getResumeUrl(val)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-[11px] font-bold text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all border border-gray-100"
        >
          <ExternalLink size={12} />
          View PDF
        </a>
      )
    },
    { 
      header: "Date", 
      accessor: "created_at",
      render: (val: string) => (
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
          {new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          val === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
          val === 'reviewed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
          val === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
          'bg-green-50 text-green-600 border-green-100'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string, row: any) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'pending' && (
            <button 
              onClick={() => handleStatusUpdate(id, 'reviewed')}
              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
              title="Mark as Reviewed"
            >
              <Eye size={14} />
            </button>
          )}
          {row.status !== 'rejected' && (
             <button 
              onClick={() => handleStatusUpdate(id, 'rejected')}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
              title="Reject"
            >
              <XCircle size={14} />
            </button>
          )}
          <button 
            onClick={() => handleDelete(id)}
            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete Permanently"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const instructorColumns = [
    {
      header: "Applicant",
      accessor: "full_name",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-100">
            {val?.charAt(0) || "I"}
          </div>
          <div>
            <div className="font-bold text-gray-900">{val}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Mail size={10} />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Message",
      accessor: "message",
      render: (val: string) => (
        <p className="text-xs text-gray-500 line-clamp-1 max-w-[250px] italic">"{val || "No message"}"</p>
      )
    },
    {
        header: "Contact",
        accessor: "phone",
        render: (val: string) => (
          <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <Phone size={12} className="text-gray-400" />
            {val || "N/A"}
          </div>
        )
    },
    {
      header: "Resume",
      accessor: "resume_url",
      render: (val: string) => (
        <a 
          href={getResumeUrl(val)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-[11px] font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100"
        >
          <ExternalLink size={12} />
          View PDF
        </a>
      )
    },
    { 
      header: "Date", 
      accessor: "created_at",
      render: (val: string) => (
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
          {new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          val === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
          val === 'reviewed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
          val === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
          'bg-green-50 text-green-600 border-green-100'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id: string, row: any) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'pending' && (
            <button 
              onClick={() => handleStatusUpdate(id, 'reviewed')}
              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
              title="Mark as Reviewed"
            >
              <Eye size={14} />
            </button>
          )}
          {row.status !== 'rejected' && (
             <button 
              onClick={() => handleStatusUpdate(id, 'rejected')}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
              title="Reject"
            >
              <XCircle size={14} />
            </button>
          )}
          <button 
            onClick={() => handleDelete(id)}
            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Delete Permanently"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading italic">Applications</h1>
          <p className="text-gray-500 font-medium">Review career and instructor applications from the website.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white border border-gray-100 p-1.5 rounded-[1.5rem] w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('career')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'career'
              ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Briefcase size={14} />
          Careers
        </button>
        <button
          onClick={() => setActiveTab('instructor')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'instructor'
              ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <UserCheck size={14} />
          Instructors
        </button>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable
          columns={activeTab === 'career' ? careerColumns : instructorColumns}
          data={applications}
          searchPlaceholder={`Search ${activeTab} applications...`}
          actions={
            <div className="flex items-center gap-2">
              {/* Add status action buttons here if needed */}
            </div>
          }
        />
      )}
    </div>
  );
}

export default function ApplicationsManagement() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}
