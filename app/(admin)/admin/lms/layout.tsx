"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  Award,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Zap,
  Bell,
  ChevronRight,
  Globe,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  SearchCode,
  Calendar
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserMenu } from "@/components/layout/UserMenu";

const adminSidebarItems = [
  { name: "LMS Overview", href: "/admin/lms/dashboard", icon: LayoutDashboard },
  { name: "Manage Courses", href: "/admin/lms/courses", icon: BookOpen },
  { name: "Student Management", href: "/admin/lms/students", icon: Users },
  { name: "Instructor Management", href: "/admin/lms/instructors", icon: UserCheck },
  { name: "Group Sessions", href: "/admin/lms/group-sessions", icon: Calendar },
  { name: "Manage Notifications", href: "/admin/lms/notifications", icon: Bell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-gray-900 border-[8px] border-[#f5f3ff] overflow-hidden">
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
            <Settings size={20} />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight text-gray-900">MSsquare</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">LMS Admin</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-2 flex-1 flex flex-col gap-1 overflow-y-auto">
          {adminSidebarItems.map((item) => {
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


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#fafafc] w-full overflow-hidden lg:pl-[260px]">
        {/* Top Header */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users, courses, transactions..."
              className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 ml-4">
            {/* User Profile Menu */}
            <div className="border-l border-gray-100 pl-6 ml-4">
              <UserMenu variant="light" />
            </div>

          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 h-full">
          <div className="max-w-[1400px] mx-auto w-full pb-10">
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
