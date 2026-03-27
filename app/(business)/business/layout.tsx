"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LineChart,
  FileText,
  HeadphonesIcon,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { authHelpers } from "@/utils/authHelpers";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { useSearch } from "@/components/providers/SearchProvider";

const sidebarItems = [
  { name: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
  { name: "My Projects", href: "/business/projects", icon: LineChart },
  { name: "Submit Requirement", href: "/business/submit-requirement", icon: PlusCircle },
];

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authHelpers.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Business Partner";
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900 font-sans border-t border-l border-gray-100">

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#8b5cf6] text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Fixed Position */}
      <aside
        className={`fixed inset-y-0 left-0 w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 z-40 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-[#8b5cf6]/20">
            <LayoutDashboard size={20} className="fill-white/20" />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-tight text-gray-900 tracking-tight italic">MSSquare</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Business Portal</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-2 flex-1 flex flex-col gap-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 font-semibold ${isActive
                  ? "bg-[#8b5cf6] text-white shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}

          <div className="mt-8 mb-2 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Support
          </div>

          <Link
            href="/business/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            <HeadphonesIcon size={20} className="text-gray-400" />
            <span className="text-[14px]">Contact Team</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area - Added Left Margin to accommodate fixed sidebar */}
      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 w-full lg:ml-[260px] relative">

        {/* Top Header */}
        <header className="h-[80px] px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0 bg-white/80 backdrop-blur-md">

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects, documents, or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]/30 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-4">
            <NotificationBell targetRole="business_client" />

            <Link href="/business/submit-requirement" className="ml-2 flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-[#8b5cf6]/20 transition-all">
              <Plus size={16} className="stroke-[3]" />
              <span className="hidden sm:inline">New Project</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pe-4 bg-gray-50/80 border border-gray-100 rounded-full cursor-pointer hover:bg-gray-100 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#bbf7d0] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 text-[#166534] text-xs font-black">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-black text-gray-900 leading-tight">{userName}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{role?.replace('_', ' ') || 'Client'}</div>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                  <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                     <p className="text-sm font-black text-gray-900 truncate italic">{userName}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      href="/business/profile"
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} className="text-[#8b5cf6]" />
                      Account Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
