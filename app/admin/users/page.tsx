"use client";

import { useState } from "react";
import { Plus, Mail, Shield, UserX, CheckCircle, Search } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import { COLORS } from "@/lib/design-tokens";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"students" | "instructors" | "admins">("students");

  const students = [
    { id: 1, name: "Alex Rivera", email: "alex.rivera@example.com", joined: "Oct 12, 2025", status: "Active", courses: 5 },
    { id: 2, name: "Sarah Connor", email: "sarah.c@example.com", joined: "Oct 10, 2025", status: "Active", courses: 3 },
    { id: 3, name: "John Doe", email: "john.doe@example.com", joined: "Oct 08, 2025", status: "Suspended", courses: 1 },
    { id: 4, name: "Emily Blunt", email: "emily.b@example.com", joined: "Oct 05, 2025", status: "Active", courses: 8 },
  ];

  const instructors = [
    { id: 1, name: "Dr. Sarah Jenkins", email: "sarah.j@mssquare.com", joined: "Jan 2025", status: "Active", courses: 12 },
    { id: 2, name: "Mark Thompson", email: "mark.t@mssquare.com", joined: "Feb 2025", status: "Active", courses: 8 },
  ];

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 border border-indigo-100">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{val}</div>
            <div className="text-xs text-gray-500 font-medium">{row.email}</div>
          </div>
        </div>
      ),
    },
    { header: "Joined", accessor: "joined" },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "Active"
              ? "bg-green-50 text-green-600 border border-green-100"
              : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      header: "Courses",
      accessor: "courses",
      render: (val: number) => <span className="font-bold text-gray-900">{val}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500 font-medium">Manage students, instructors, and administrative accounts.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-primary-purple text-white font-bold text-sm shadow-lg shadow-primary-purple/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {(["students", "instructors", "admins"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? "bg-white text-primary-purple shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Area */}
      <DataTable
        columns={columns}
        data={activeTab === "students" ? students : activeTab === "instructors" ? instructors : []}
        searchPlaceholder={`Search ${activeTab}...`}
        actions={
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-primary-purple transition-all">
              <Mail size={18} />
            </button>
            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-primary-purple transition-all">
              <Shield size={18} />
            </button>
          </div>
        }
      />
    </div>
  );
}
