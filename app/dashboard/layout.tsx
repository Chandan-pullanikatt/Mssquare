"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LineChart,
  FileText,
  HeadphonesIcon,
  Search,
  Bell,
  Settings,
  Plus,
  Menu,
  X,
  MoreVertical
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Requested Services", href: "/dashboard/services", icon: Briefcase },
  { name: "Submit Requirement", href: "/dashboard/submit-requirement", icon: PlusCircle },
  { name: "Project Tracking", href: "/dashboard/tracking", icon: LineChart },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
];

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-gray-900 overflow-hidden font-sans border-t border-l border-gray-100">

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#8b5cf6] text-white p-4 rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 z-40 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-[#8b5cf6]/20">
            <LayoutDashboard size={20} className="fill-white/20" />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-tight text-gray-900 tracking-tight">MSSquare</div>
            <div className="text-xs text-gray-400 font-medium">Business Portal</div>
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
            href="/dashboard/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            <HeadphonesIcon size={20} className="text-gray-400" />
            <span className="text-[14px]">Contact Team</span>
          </Link>

        </div>

        {/* User Profile */}
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-gray-50/80 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#bbf7d0] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=AlexS&backgroundColor=bbf7d0`} alt="Alex Sterling" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">Alex Sterling</div>
              <div className="text-[11px] text-gray-500 font-medium truncate">Premium Client</div>
            </div>
            <MoreVertical size={16} className="text-gray-400 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen bg-white w-full overflow-hidden">

        {/* Top Header */}
        <header className="h-[80px] px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0 bg-white">

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects, documents, or team..."
              className="w-full bg-gray-50/80 border border-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]/30 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-4">
            <button className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors relative">
              <Bell size={18} className="fill-gray-400" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#8b5cf6] rounded-full border border-white"></div>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors relative">
              <Settings size={18} className="fill-gray-400" />
            </button>

            <Link href="/dashboard/submit-requirement" className="ml-2 flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-[#8b5cf6]/20 transition-all">
              <Plus size={16} className="stroke-[3]" />
              New Project
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 h-full">
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
