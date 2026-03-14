"use client";

import { Award, Download, ShieldCheck, ShieldAlert, Eye } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

export default function CertificatesManagement() {
  const certificates = [
    { id: "CERT-9921", student: "Emily Blunt", course: "UI/UX Masterclass", issued: "Oct 12, 2025", status: "Verified" },
    { id: "CERT-9844", student: "Alex Rivera", course: "React Fundamentals", issued: "Sept 28, 2025", status: "Verified" },
    { id: "CERT-9712", student: "Marcus Thorne", course: "Backend Systems", issued: "Aug 15, 2025", status: "Revoked" },
  ];

  const columns = [
    {
      header: "Student",
      accessor: "student",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-xs font-bold text-purple-600 border border-purple-100">
            {val.charAt(0)}
          </div>
          <span className="font-bold text-gray-900">{val}</span>
        </div>
      ),
    },
    { header: "Course", accessor: "course" },
    { 
      header: "Certificate ID", 
      accessor: "id",
      render: (val: string) => <code className="text-[11px] font-bold text-[#8b5cf6] bg-purple-50 px-2 py-1 rounded-lg tracking-wider">{val}</code>
    },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <div className="flex items-center gap-1.5">
          {val === "Verified" ? <ShieldCheck size={14} className="text-green-500" /> : <ShieldAlert size={14} className="text-rose-500" />}
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              val === "Verified" ? "text-green-600" : "text-rose-600"
            }`}
          >
            {val}
          </span>
        </div>
      ),
    },
    { header: "Issued Date", accessor: "issued" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Certificates</h1>
          <p className="text-gray-500 font-medium">Manage and verify issued course certifications.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm shadow-xl shadow-gray-900/10 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <Award size={18} className="text-[#8b5cf6]" />
          <span>Certificate Settings</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={certificates}
        searchPlaceholder="Search certificate ID..."
        actions={
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 transition-all">
              <Eye size={18} />
            </button>
            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 transition-all">
              <Download size={18} />
            </button>
          </div>
        }
      />
    </div>
  );
}
