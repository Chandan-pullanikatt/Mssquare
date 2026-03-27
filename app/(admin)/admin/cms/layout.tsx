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
  GraduationCap,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserMenu } from "@/components/layout/UserMenu";
import { notificationsApi, Notification } from "@/lib/api/notifications";
import { formatDistanceToNow } from "date-fns";
import { adminApi } from "@/lib/api/admin";
import { AdminDetailModal } from "@/components/cms-admin/AdminDetailModal";

const adminSidebarItems = [
  { name: "Dashboard", href: "/admin/cms/dashboard", icon: LayoutDashboard },
  { name: "Website Content", href: "/admin/cms/content", icon: Globe },
  { name: "Courses", href: "/admin/cms/courses", icon: BookOpen },
  { name: "Blog Posts", href: "/admin/cms/blog", icon: FileText },
  { name: "Media Manager", href: "/admin/cms/media", icon: ImageIcon },
  { name: "Users", href: "/admin/cms/users", icon: Users },
  { name: "Leads & Inquiries", href: "/admin/cms/leads", icon: MessageSquare },
  { name: "Applications", href: "/admin/cms/applications", icon: Award },
  { name: "Enrollments", href: "/admin/cms/enrollments", icon: UserCheck },
  { name: "FAQ & Legal", href: "/admin/cms/faq-legal", icon: ShieldCheck },
  { name: "Analytics", href: "/admin/cms/analytics", icon: BarChart3 },
  { name: "SEO & Settings", href: "/admin/cms/settings", icon: SearchCode },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    const fetchNotifications = async () => {
      try {
        const data = await notificationsApi.getNotifications();
        // Filter for CMS admin related notifications
        const adminNotifs = data.filter(n => n.target_role === 'all' || n.target_role === 'cms_admin');
        setNotifications(adminNotifs);
      } catch (err) {
        console.error("Failed to fetch admin notifications:", err);
      }
    };

    fetchNotifications();

    // Set up polling or real-time subscription here if needed
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Search Logic
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults(null);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      setShowResults(true);
      try {
        const results = await adminApi.cmsGlobalSearch(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("CMS Search Error:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

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
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">CMS Admin</div>
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

        {/* Bottom Actions - Removed Student Portal Link */}
        <div className="px-4 py-4" />


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#fafafc] w-full overflow-hidden lg:pl-[260px]">
        {/* Top Header */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users, courses, blogs, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all font-heading italic"
            />

            {/* Search Results Dropdown */}
            {showResults && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-[70vh] flex flex-col">
                  {isSearching ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
                      <div className="w-8 h-8 border-4 border-gray-100 border-t-[#8b5cf6] rounded-full animate-spin" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Scanning Records...</p>
                    </div>
                  ) : searchResults && (Object.values(searchResults).some((arr: any) => arr.length > 0)) ? (
                    <div className="overflow-y-auto p-4 space-y-6 scrollbar-hide">
                      {/* Users Result */}
                      {searchResults.users?.length > 0 && (
                        <div>
                          <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Accounts</h4>
                          <div className="space-y-1">
                            {searchResults.users.map((user: any) => (
                              <button
                                key={user.id}
                                onClick={() => {
                                  setSelectedItem(user);
                                  setSelectedType('student'); // Adjust based on role if needed
                                  setIsDetailModalOpen(true);
                                  setShowResults(false);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#f5f3ff] transition-all group border border-transparent hover:border-[#8b5cf6]/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <GraduationCap size={16} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] italic">{user.email}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user.role}</p>
                                  </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Courses Result */}
                      {searchResults.courses?.length > 0 && (
                        <div>
                          <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Courses</h4>
                          <div className="space-y-1">
                            {searchResults.courses.map((course: any) => (
                              <button
                                key={course.id}
                                onClick={() => {
                                  setSelectedItem(course);
                                  setSelectedType('course');
                                  setIsDetailModalOpen(true);
                                  setShowResults(false);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#fef9c3] transition-all group border border-transparent hover:border-amber-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold group-hover:bg-amber-500 group-hover:text-white transition-all">
                                    <BookOpen size={16} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 italic">{course.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{course.category}</p>
                                  </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Blogs Result */}
                      {searchResults.blogs?.length > 0 && (
                        <div>
                          <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Blog Posts</h4>
                          <div className="space-y-1">
                            {searchResults.blogs.map((blog: any) => (
                              <button
                                key={blog.id}
                                onClick={() => {
                                  setSelectedItem(blog);
                                  setSelectedType('blog');
                                  setIsDetailModalOpen(true);
                                  setShowResults(false);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 transition-all group border border-transparent hover:border-rose-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 font-bold group-hover:bg-rose-500 group-hover:text-white transition-all">
                                    <FileText size={16} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-rose-700 italic">{blog.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{blog.category}</p>
                                  </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Leads Result */}
                      {searchResults.leads?.length > 0 && (
                        <div>
                          <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Recent Leads</h4>
                          <div className="space-y-1">
                            {searchResults.leads.map((lead: any) => (
                              <button
                                key={lead.id}
                                onClick={() => {
                                  setSelectedItem(lead);
                                  setSelectedType('lead');
                                  setIsDetailModalOpen(true);
                                  setShowResults(false);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-all group border border-transparent hover:border-emerald-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <User size={16} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 italic">{lead.name || lead.email}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lead.source}</p>
                                  </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Enquiries Result */}
                      {searchResults.enquiries?.length > 0 && (
                        <div>
                          <h4 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Enquiries</h4>
                          <div className="space-y-1">
                            {searchResults.enquiries.map((enq: any) => (
                              <button
                                key={enq.id}
                                onClick={() => {
                                  setSelectedItem(enq);
                                  setSelectedType('enquiry');
                                  setIsDetailModalOpen(true);
                                  setShowResults(false);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50 transition-all group border border-transparent hover:border-purple-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold group-hover:bg-purple-500 group-hover:text-white transition-all">
                                    <MessageSquare size={16} />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-purple-700 italic line-clamp-1">{enq.subject}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{enq.status}</p>
                                  </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-16 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200 border border-gray-50">
                        <Search size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 italic">Nothing found</h3>
                      <p className="text-sm text-gray-500 font-medium">No results for "{searchQuery}" <br/> Try searching for something else.</p>
                    </div>
                  )}
                </div>
              </>
            )}
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
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-black/5 z-50 p-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[500px]">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <h3 className="font-bold text-gray-900">Admin Alerts</h3>
                      {notifications.length > 0 && (
                        <span className="text-[10px] font-bold text-[#8b5cf6] bg-purple-50 px-2 py-1 rounded-lg uppercase">
                          {notifications.length} Total
                        </span>
                      )}
                    </div>
                    
                    <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div key={notif.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#8b5cf6]/30 transition-all group">
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                notif.type === 'success' ? 'bg-green-500' : 
                                notif.type === 'warning' ? 'bg-amber-500' : 
                                notif.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                              }`} />
                              <div>
                                <h4 className="text-xs font-bold text-gray-900 leading-tight group-hover:text-[#8b5cf6] transition-colors">{notif.title}</h4>
                                <p className="text-[11px] text-gray-500 mt-1 leading-normal">{notif.message}</p>
                                <span className="text-[9px] text-gray-400 font-medium mt-2 block tracking-tight">
                                  {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-3">
                            <Bell size={24} />
                          </div>
                          <p className="text-sm font-bold text-gray-900">No new alerts</p>
                          <p className="text-xs text-gray-400 mt-1">Everything is running smoothly.</p>
                        </div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <Link 
                        href="/admin/cms/leads" 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="mt-4 pt-4 border-t border-gray-50 text-center text-xs font-bold text-[#8b5cf6] hover:underline"
                      >
                        View All Activity
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>

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

      {/* Global Detail Modal */}
      <AdminDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedItem}
        type={selectedType}
      />
    </div>
  );
}
