"use client";

import {
  Folder,
  TrendingUp,
  Monitor,
  Banknote,
  ShieldCheck,
  Network,
  Settings,
  Calendar,
  Video,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function BusinessDashboard() {
  return (
    <div className="space-y-10 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">
          Welcome to your Business Portal
        </h1>
        <p className="text-gray-500 font-medium text-[15px]">
          Monitor your consultancy performance and project milestones at a glance.
        </p>
      </div>

      {/* Active Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Folder className="text-[#8b5cf6]" size={20} />
            <h2 className="text-xl font-bold font-heading text-gray-900">Active Projects</h2>
          </div>
          <Link href="/dashboard/tracking" className="text-[#8b5cf6] text-sm font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Project Card 1 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#8b5cf6]/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6]">
                <TrendingUp size={20} />
              </div>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                In Progress
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#8b5cf6] transition-colors">Market Expansion Strategy</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-1">
              Analyzing Southeast Asia retail opportunities and entry points.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-900">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#8b5cf6] h-2 rounded-full w-[65%]"></div>
              </div>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#8b5cf6]/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6]">
                <Monitor size={20} />
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Delivered
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#8b5cf6] transition-colors">Digital Transformation</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-1">
              Cloud infrastructure migration and ERP implementation completed.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-auto">
              <Calendar size={14} className="text-gray-400" />
              Completed on Oct 12, 2023
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#8b5cf6]/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6]">
                <Banknote size={20} />
              </div>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                In Progress
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#8b5cf6] transition-colors">Q4 Financial Audit</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed flex-1">
              Comprehensive year-end reporting and compliance verification.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Progress</span>
                <span className="text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#8b5cf6] h-2 rounded-full w-[30%]"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Recent Service Requests */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-bold font-heading text-gray-900">Recent Service Requests</h2>
              <Link href="/dashboard/services" className="text-[#8b5cf6] text-[11px] font-bold tracking-widest uppercase hover:underline">
                Manage All
              </Link>
            </div>

            <div className="divide-y divide-gray-50">

              {/* Request 1 */}
              <div className="p-6 md:p-8 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#8b5cf6] transition-colors mb-0.5">Corporate Legal Advisory</h4>
                  <p className="text-xs text-gray-500 font-medium">Submitted 2 days ago</p>
                </div>
                <span className="bg-amber-50 text-amber-600 border border-amber-100/50 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:block">
                  Pending Review
                </span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors ml-2" />
              </div>

              {/* Request 2 */}
              <div className="p-6 md:p-8 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <Network size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#8b5cf6] transition-colors mb-0.5">Supply Chain Optimization</h4>
                  <p className="text-xs text-gray-500 font-medium">Submitted 5 days ago</p>
                </div>
                <span className="bg-blue-50 text-blue-600 border border-blue-100/50 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:block">
                  Under Analysis
                </span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors ml-2" />
              </div>

              {/* Request 3 */}
              <div className="p-6 md:p-8 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <Settings size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#8b5cf6] transition-colors mb-0.5">HR Policy Restructuring</h4>
                  <p className="text-xs text-gray-500 font-medium">Submitted Oct 20, 2023</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap hidden sm:block">
                  Approved
                </span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors ml-2" />
              </div>

            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 md:p-8">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-6">Recent Activity</h2>
            <div className="flex items-center justify-center py-10">
              <p className="text-sm font-medium text-gray-400">No recent activity to display.</p>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div>
          {/* Consultation Schedule */}
          <section className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold font-heading text-gray-900">Consultation Schedule</h2>
              <Calendar className="text-gray-400" size={20} />
            </div>

            <div className="space-y-4 mb-8">

              {/* Event 1 */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 border-l-4 border-l-[#8b5cf6]">
                <div className="text-center shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Oct</span>
                  <span className="text-2xl font-extrabold text-gray-900 leading-none">28</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-gray-900 mb-1 truncate">Strategy Review</h4>
                  <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">10:00 AM - 11:30 AM</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Video size={14} className="text-[#8b5cf6] fill-[#8b5cf6]" />
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="text-center shrink-0 opacity-40">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Oct</span>
                  <span className="text-2xl font-extrabold text-gray-900 leading-none">30</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-gray-900 mb-1 truncate group-hover:text-[#8b5cf6] transition-colors">Q4 Financial Prep</h4>
                  <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">02:00 PM - 03:00 PM</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="text-center shrink-0 opacity-40">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Nov</span>
                  <span className="text-2xl font-extrabold text-gray-900 leading-none">02</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-gray-900 mb-1 truncate group-hover:text-[#8b5cf6] transition-colors">Stakeholder Sync</h4>
                  <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">09:00 AM - 10:30 AM</p>
                </div>
              </div>

            </div>

            <button className="w-full py-3.5 border border-dashed border-gray-300 rounded-2xl text-sm font-bold text-[#8b5cf6] hover:bg-gray-50 transition-colors">
              Schedule New Session
            </button>
          </section>
        </div>

      </div>

    </div>
  );
}
