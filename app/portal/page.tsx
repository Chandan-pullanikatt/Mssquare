"use client";

import Link from "next/link";
import { GraduationCap, Briefcase, ArrowRight, LayoutGrid } from "lucide-react";

export default function PortalPage() {
  return (
    <div className="h-screen w-full bg-white flex flex-col font-sans overflow-hidden">

      {/* Custom Top Header for Portal Page */}
      <header className="w-full px-6 md:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8b5cf6]/20">
            <LayoutGrid size={18} />
          </div>
          <span className="font-extrabold text-lg md:text-xl tracking-tight text-gray-900">MSSquare</span>
        </div>
        <div className="flex gap-4 md:gap-6 text-[13px] md:text-sm font-semibold text-gray-500">
          <Link href="#" className="hover:text-gray-900 transition-colors">Support</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Documentation</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 overflow-y-auto">

        <div className="w-full max-w-[900px] flex flex-col items-center justify-center h-full py-4">

          {/* Title Section */}
          <div className="text-center mb-6 md:mb-10 max-w-lg mx-auto shrink-0">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-2 md:mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
              Select your specialized portal to access your personalized<br className="hidden sm:block" /> dashboard and projects.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full h-auto min-h-0">

            {/* Student Portal Card */}
            <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 md:p-8 flex flex-col group hover:border-[#8b5cf6]/30 transition-all duration-300 h-full">
              {/* Top Icon */}
              <div className="w-12 h-12 bg-[#f5f3ff] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                <GraduationCap className="text-[#8b5cf6] w-6 h-6" />
              </div>

              {/* Text Content */}
              <h2 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">
                Student Portal
              </h2>
              <p className="text-[13px] md:text-sm font-medium text-gray-500 leading-relaxed mb-5 md:mb-6">
                Access courses, projects, certifications, and learning dashboard.
              </p>

              {/* Image Placeholder */}
              <div className="w-full h-28 md:h-36 bg-gray-100 rounded-xl md:rounded-2xl mb-5 overflow-hidden relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2670&auto=format&fit=crop"
                  alt="Student Desk"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Action Button */}
              <Link
                href="/student/dashboard"
                className="mt-auto w-full bg-[#8b5cf6] text-white py-3 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#7c3aed] transition-colors shadow-lg shadow-[#8b5cf6]/20 text-sm md:text-base shrink-0"
              >
                Continue as Student
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Business Portal Card */}
            <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 md:p-8 flex flex-col group hover:border-[#8b5cf6]/30 transition-all duration-300 h-full">
              {/* Top Icon */}
              <div className="w-12 h-12 bg-[#f5f3ff] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Briefcase className="text-[#8b5cf6] w-6 h-6" />
              </div>

              {/* Text Content */}
              <h2 className="text-lg md:text-xl font-extrabold text-gray-900 mb-2">
                Business / Client Portal
              </h2>
              <p className="text-[13px] md:text-sm font-medium text-gray-500 leading-relaxed mb-5 md:mb-6">
                Explore services, submit requirements, and track projects in real-time.
              </p>

              {/* Image Placeholder */}
              <div className="w-full h-28 md:h-36 bg-gray-50 rounded-xl md:rounded-2xl mb-5 overflow-hidden relative border border-gray-100 flex items-center justify-center shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                  alt="Business Dashboard Mockup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              </div>

              {/* Action Button */}
              <Link
                href="/business/dashboard"
                className="mt-auto w-full bg-white text-[#8b5cf6] border-2 border-[#f5f3ff] py-3 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-[#8b5cf6]/30 hover:bg-[#f5f3ff]/50 transition-colors text-sm md:text-base shrink-0"
              >
                Continue as Business
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="w-full py-4 md:py-5 flex flex-col items-center justify-center gap-2 shrink-0 border-t border-gray-50">
        <p className="text-[12px] md:text-sm text-gray-400 font-medium">Need help accessing your account?</p>
        <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold text-gray-400 tracking-widest uppercase">
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link>
        </div>
      </footer>

    </div>
  );
}
