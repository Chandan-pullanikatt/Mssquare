"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

interface UserMenuProps {
  variant?: "dark" | "light";
}

export function UserMenu({ variant = "dark" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, role } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  
  const isLight = variant === "light";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group ${
          isLight 
            ? "hover:bg-gray-100/80" 
            : "hover:bg-white/10"
        }`}
      >
        <div className="flex flex-col items-end hidden sm:flex text-right">
          <span className={`text-[0.85rem] font-bold tracking-tight transition-colors ${
            isLight ? "text-gray-900 group-hover:text-primary-purple" : "text-white group-hover:text-white"
          }`}>
            {fullName}
          </span>
          <span className={`text-[0.6rem] font-black uppercase tracking-widest ${
            isLight ? "text-gray-400" : "text-white/50"
          }`}>
            {role?.replace("_", " ") || "Member"}
          </span>
        </div>
        
        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden ${
          isLight 
            ? "bg-primary-purple/10 border-white shadow-sm group-hover:border-primary-purple/20" 
            : "bg-white/10 border-white/20 group-hover:border-white/40"
        }`}>
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <User size={18} className={isLight ? "text-primary-purple" : "text-white"} />
          )}
        </div>

        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${
            isLight ? "text-gray-400" : "text-white/60"
          } ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute top-full right-0 mt-3 w-64 rounded-[1.5rem] border shadow-2xl overflow-hidden z-[100] backdrop-blur-xl ${
              isLight 
                ? "bg-white border-gray-100" 
                : "bg-[#1e1e2d]/95 border-white/10"
            }`}
          >
            <div className={`p-5 border-b ${isLight ? "bg-gray-50/50 border-gray-100" : "bg-white/5 border-white/5"}`}>
              <div className={`text-[0.65rem] font-black uppercase tracking-widest mb-1 ${isLight ? "text-gray-400" : "text-white/30"}`}>
                Signed in as
              </div>
              <div className={`text-sm font-bold truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                {user.email}
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  const { authHelpers } = await import("@/utils/authHelpers");
                  const path = await authHelpers.getRedirectPath(role as any);
                  window.location.href = path;
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                  isLight 
                    ? "text-gray-900 bg-primary-purple/5 hover:bg-primary-purple hover:text-white" 
                    : "text-white bg-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </button>
              
              
              <Link
                href={role === 'student' ? '/student/profile' : '#'}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                  isLight 
                    ? "text-gray-600 hover:bg-gray-50 hover:text-primary-purple" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Settings size={18} />
                Account Settings
              </Link>

              <div className={`my-2 h-px ${isLight ? "bg-gray-100" : "bg-white/5"}`} />

              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                  isLight 
                    ? "text-rose-500 hover:bg-rose-50" 
                    : "text-rose-400 hover:bg-rose-500/10"
                }`}
              >
                <LogOut size={18} />
                Logout Account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
