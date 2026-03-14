"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";

export function WebServicesNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="px-[5%] h-[70px] flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#9333EA] rounded-lg flex items-center justify-center text-white shadow-lg">
            <Rocket size={20} fill="white" />
          </div>
          <span className="text-xl font-extrabold text-gray-900">MSSquare</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {[
            { name: "Process", href: "#development-process" },
            { name: "Showcase", href: "#case-study" },
            { name: "Technologies", href: "#tech-stack" },
            { name: "Home", href: "/" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-gray-600 hover:text-[#7C3AED] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Link
          href="/auth"
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all duration-200 shadow-lg shadow-[#7C3AED]/30"
        >
          Start Your Project
        </Link>
      </div>
    </header>
  );
}
