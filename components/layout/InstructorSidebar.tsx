'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Bell,
  Settings,
  X,
  Calendar,
} from "lucide-react";

const instructorSidebarItems = [
  { name: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { name: "My Students", href: "/instructor/students", icon: Users },
  { name: "My Sessions", href: "/instructor/sessions", icon: Calendar },
  { name: "Notifications", href: "/instructor/notifications", icon: Bell },
];

export function InstructorSidebar({ isMobile, onClose }: { isMobile?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-[260px]">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white font-bold">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight text-gray-900">MSsquare</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Instructor</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl">
            <X size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      <nav className="px-4 py-2 flex-1 flex flex-col gap-1 overflow-y-auto">
        {instructorSidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
      </nav>

      <div className="p-6 border-t border-gray-50">
        <Link
          href="/instructor/settings"
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <Settings size={20} className="text-gray-400" />
          <span className="text-[15px]">Settings</span>
        </Link>
      </div>
    </div>
  );
}
