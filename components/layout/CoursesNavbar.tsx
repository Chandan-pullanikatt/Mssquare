"use client";

import Link from "next/link";
import { Rocket, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserMenu } from "./UserMenu";

export function CoursesNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-[5%] h-[70px] flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="relative h-10 md:h-12 w-40 md:w-48 transition-transform duration-300 hover:scale-[1.02]">
          <img 
            src="/assets/nobglogo.png" 
            alt="MSSquare" 
            className="h-full w-full object-contain object-left brightness-0"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { name: "Home", href: "/" },
            { name: "Programs", href: "/courses" },
            { name: "Mentorship", href: "/courses?type=Mentorship" },
            { name: "Placements", href: "/courses?type=Placement" }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-bold text-gray-500 hover:text-[#7C3AED] transition-colors uppercase tracking-widest"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative z-50">
          {user ? (
            <UserMenu variant="light" />
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden sm:block text-xs font-black text-gray-500 hover:text-[#7C3AED] transition-colors uppercase tracking-widest"
              >
                Log In
              </Link>
              <Link
                href="/auth"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black px-5 md:px-7 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#7C3AED]/20 hover:-translate-y-0.5"
              >
                Join Now
              </Link>
            </>
          )}

          
          {/* Mobile Toggle */}
          <button 
            className="p-2 -mr-2 md:hidden text-gray-900" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[70px] bg-white z-[100] md:hidden p-8 animate-in slide-in-from-top duration-300 h-[calc(100vh-70px)]">
          <nav className="flex flex-col gap-6 h-full overflow-y-auto pb-10">
            {[
              { name: "Home", href: "/" },
              { name: "Programs", href: "/courses" },
              { name: "Mentorship", href: "/courses?type=Mentorship" },
              { name: "Placements", href: "/courses?type=Placement" },
              { name: "Account Login", href: "/auth" }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-4 tracking-tight"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
