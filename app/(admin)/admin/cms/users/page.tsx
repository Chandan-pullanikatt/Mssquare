"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Mail, Shield, UserX, CheckCircle, Search, User as UserIcon, ShieldCheck, LifeBuoy, MoreVertical } from "lucide-react";
import DataTable from "@/components/cms-admin/DataTable";
import { usersApi } from "@/lib/api/users";
import { User, UserRole } from "@/types/database";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"students" | "admins">("students");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef<Record<string, boolean>>({});
  
  const fetchUsers = async () => {
    if (hasFetched.current[activeTab]) return;
    
    setLoading(true);
    let mounted = true;
    
    try {
      const data = await usersApi.listUsersByRole(activeTab === "students" ? "student" : "cms_admin");
      if (mounted) {
        setUsers(data);
        hasFetched.current[activeTab] = true;
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted) setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await usersApi.updateUser(userId, { role });
      alert(`User role updated to ${role}`);
      hasFetched.current = {}; // Reset cache to force reload
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    if (confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this user?`)) {
      try {
        await usersApi.updateUser(userId, { status: newStatus as any });
        alert(`User status updated to ${newStatus}`);
        hasFetched.current = {}; // Reset cache to force reload
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Failed to update status.");
      }
    }
  };

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 border border-indigo-100 relative">
            {val?.charAt(0) || "U"}
            {row.status === 'suspended' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                <UserX size={8} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900 flex items-center gap-2">
              {val || "Unknown"}
              {row.status === 'suspended' && (
                <span className="text-[8px] font-bold uppercase tracking-tighter bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded">Suspended</span>
              )}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.id.slice(0, 8)}</div>
          </div>
        </div>
      ),
    },
    { 
      header: "Joined", 
      accessor: "created_at",
      render: (val: string) => new Date(val).toLocaleDateString()
    },
    {
      header: "Current Role",
      accessor: "role",
      render: (val: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            val === "ceo" || val === "admin"
              ? "bg-purple-50 text-purple-600 border border-purple-100"
              : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}
        >
          {val.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (val: string, row: any) => (
        <button
          onClick={() => handleStatusChange(row.id, val)}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
            val === 'suspended'
              ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
              : "bg-green-50 text-green-600 border border-green-100 hover:bg-green-100"
          }`}
        >
          {val === 'suspended' ? 'Suspended' : 'Active'}
        </button>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (val: string, row: any) => (
        <div className="flex items-center gap-2">
          <select 
            value={row.role}
            onChange={(e) => handleRoleChange(val, e.target.value as UserRole)}
            className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
          >
            <option value="student">Student</option>
            <option value="cms_admin">CMS Admin</option>
            <option value="lms_admin">LMS Admin</option>
            <option value="business_admin">Business Admin</option>
            <option value="business_client">Business Client</option>
          </select>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">User Management</h1>
          <p className="text-gray-500 font-medium">Manage students, administrators, and assigned roles.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <Plus size={18} />
          <span>Invite Administrator</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {(["students", "admins"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? "bg-white text-[#8b5cf6] shadow-sm"
                : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Area */}
      {loading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 relative overflow-hidden">
           <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin mb-4"></div>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching User Directory...</p>
        </div>
      ) : users.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
          <UserIcon size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500 text-sm mb-6">We couldn't find any {activeTab} at the moment.</p>
          <button 
            onClick={() => {
              hasFetched.current = {};
              fetchUsers();
            }}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-all"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <div className="relative">
          {loading && users.length > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden z-50 rounded-full">
              <div className="h-full bg-[#8b5cf6] animate-progress-fast w-1/3"></div>
            </div>
          )}
          <DataTable
            columns={columns}
            data={users}
            searchPlaceholder={`Search ${activeTab}...`}

            actions={
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-[#8b5cf6] transition-all">
                  <Mail size={18} />
                </button>
                <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-rose-500 transition-all">
                  <UserX size={18} />
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}


