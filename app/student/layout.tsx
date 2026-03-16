"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  Award,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Zap,
  Briefcase,
  Bell
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";

const sidebarItems = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "AI Chat", href: "/student/ai-coach", icon: Zap },
  { name: "My Courses", href: "/student/courses", icon: BookOpen },
  { name: "Projects", href: "/student/projects", icon: FolderGit2 },
  { name: "Certifications", href: "/student/certifications", icon: Award },
  { name: "Payments", href: "/student/payments", icon: CreditCard },
  { name: "Careers", href: "/careers", icon: Briefcase },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { signOut, user } = useAuth();

  return (
    <div className="flex min-h-screen bg-white text-gray-900 border-[8px] border-violet-50 overflow-hidden relative">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#8b5cf6] text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-1 left-1 bottom-1 h-[calc(100vh-8px)] w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 z-40 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white font-bold">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight text-gray-900">MSsquare</div>
            <div className="text-xs text-gray-500 font-medium">LMS Portal</div>
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
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive
                  ? "bg-[#8b5cf6] text-white shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* AI Assistant Button */}
        <div className="px-4 py-4">
          <Link href="/student/ai-coach" className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold bg-[#111827] text-white hover:bg-gray-800 shadow-[0_10px_30px_rgba(17,24,39,0.15)] group">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-[14px]">AI Support</span>
          </Link>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50/30 w-full overflow-hidden lg:pl-[260px]">
        {/* Top Header */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses, lessons, tools..."
              className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 ml-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className={`relative p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-[#f5f3ff] text-[#8b5cf6]' : 'text-gray-500 hover:text-[#8b5cf6] hover:bg-gray-50'}`}
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#8b5cf6] rounded-full border-2 border-white"></span>
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-black/5 z-50 p-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      <span className="text-[10px] font-bold text-[#8b5cf6] bg-purple-50 px-2 py-1 rounded-lg uppercase">0 New</span>
                    </div>
                    <div className="py-10 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-3">
                        <Bell size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-900">No new notifications</p>
                      <p className="text-xs text-gray-400 mt-1">We'll let you know when something important happens.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center gap-3 border-l border-gray-100 pl-6 group transition-all ${isProfileOpen ? 'opacity-70' : ''}`}
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}</div>
                  <div className="text-xs text-gray-500 font-medium">Student ID: #{user?.id?.slice(-4) || "8821"}</div>
                </div>
                <div className={`w-10 h-10 rounded-full bg-[#fed7aa] border-2 transition-all overflow-hidden ${isProfileOpen ? 'border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20 scale-110' : 'border-white shadow-sm'}`}>
                  <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Alex'}&backgroundColor=fed7aa`} alt="User" className="w-full h-full object-cover" />
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</div>
                      <div className="text-sm font-bold text-gray-900 truncate">{user?.email}</div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/student/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-[#8b5cf6] transition-all font-bold text-sm"
                      >
                        <User size={18} />
                        Edit Profile
                      </Link>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await signOut();
                        }}
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 h-full">
          <div className="max-w-[1200px] mx-auto w-full pb-10">
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
