"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ChevronDown,
  User,
  Zap,
  Search
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserMenu } from "@/components/layout/UserMenu";
import { authHelpers } from "@/utils/authHelpers";

const businessAdminSidebarItems = [
  { name: "Dashboard", href: "/admin/business/dashboard", icon: LayoutDashboard },
  { name: "Client Requests", href: "/admin/business/requests", icon: Briefcase },
  { name: "Project Management", href: "/admin/business/projects", icon: FileText },
  { name: "Client List", href: "/admin/business/clients", icon: Users },
  { name: "Performance", href: "/admin/business/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/business/settings", icon: Settings },
];

export default function BusinessAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();
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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Admin";
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex min-h-screen bg-white text-gray-900 border-[8px] border-[#f5f3ff] overflow-hidden font-sans">
      
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#8b5cf6] text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Fixed Position */}
      <aside
        className={`fixed top-1 left-1 bottom-1 w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 z-40 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white font-bold">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight text-gray-900 italic">MSSquare</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Business Admin</div>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 flex flex-col gap-1 overflow-y-auto">
          {businessAdminSidebarItems.map((item) => {
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

      <main className="flex-1 flex flex-col min-h-screen bg-[#fafafc] w-full overflow-hidden lg:pl-[260px] relative">
        <header className="h-[80px] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0">
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search requests, projects, clients..."
              className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-4">
             <button className="p-2 rounded-xl text-gray-500 hover:text-[#8b5cf6] hover:bg-gray-50 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#8b5cf6] rounded-full border-2 border-white"></span>
             </button>
             <div className="border-l border-gray-100 pl-4">
               <UserMenu variant="light" />
             </div>
          </div>

        </header>

        <div className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto w-full pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
