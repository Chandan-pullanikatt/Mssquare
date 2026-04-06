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
import { AdminDetailModal } from "@/components/cms-admin/AdminDetailModal";
import { format } from "date-fns";
import { useSearch } from "@/components/providers/SearchProvider";
import { adminApi } from "@/lib/api/admin";
import { useEffect } from "react";

const adminSidebarItems = [
  { name: "LMS Overview", href: "/admin/lms/dashboard", icon: LayoutDashboard },
  { name: "Manage Courses", href: "/admin/lms/courses", icon: BookOpen },
  { name: "Student Management", href: "/admin/lms/students", icon: Users },
  { name: "Instructor Management", href: "/admin/lms/instructors", icon: UserCheck },
  { name: "Group Sessions", href: "/admin/lms/group-sessions", icon: Calendar },
  { name: "Course Timetable", href: "/admin/lms/timetable", icon: Calendar },
  { name: "Manage Notifications", href: "/admin/lms/notifications", icon: Bell },
  { name: "Enrollment Logs", href: "/admin/lms/enrollments", icon: Zap },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await adminApi.globalSearch(searchQuery);
          setSearchResults(results);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ students: [], instructors: [], courses: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (type: "student" | "instructor" | "course", data: any) => {
    setSelectedType(type);
    setSelectedItem(data);
    setIsDetailModalOpen(true);
    setSearchQuery(""); // Clear search
  };

  const hasResults = searchResults?.students?.length > 0 || searchResults?.instructors?.length > 0 || searchResults?.courses?.length > 0;


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
          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users, courses, transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
            />

            {/* Global Search Results Dropdown */}
            {(isSearching || hasResults) && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-6 max-h-[500px] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                {isSearching ? (
                  <div className="flex items-center justify-center py-10 gap-3">
                    <div className="w-5 h-5 border-2 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Searching records...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {searchResults.students.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Students</p>
                        {searchResults.students.map((student: any) => (
                          <button
                            key={student.id}
                            onClick={() => handleResultClick("student", student)}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Users size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{student.email}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Student Profile</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.instructors.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Instructors</p>
                        {searchResults.instructors.map((instructor: any) => (
                          <button
                            key={instructor.id}
                            onClick={() => handleResultClick("instructor", instructor)}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <UserCheck size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{instructor.email}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Instructor Record</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.courses.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Courses</p>
                        {searchResults.courses.map((course: any) => (
                          <button
                            key={course.id}
                            onClick={() => handleResultClick("course", course)}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#8b5cf6]">
                                <BookOpen size={18} />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{course.title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{course.category}</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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

      <AdminDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        type={selectedType}
        data={selectedItem}
      />

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
