"use client";

import { 
  X, 
  User, 
  BookOpen, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Clock,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "student" | "instructor" | "course";
  data: any;
}

export default function AdminDetailModal({ isOpen, onClose, type, data }: AdminDetailModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#8b5cf6] p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-white"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              {type === "student" && <User size={28} />}
              {type === "instructor" && <ShieldCheck size={28} />}
              {type === "course" && <BookOpen size={28} />}
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{type}</p>
              <h2 className="text-2xl font-bold tracking-tight truncate max-w-[300px]">
                {type === "course" ? data.title : data.email}
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {type === "student" && (
              <>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  <Mail className="text-[#8b5cf6]" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-gray-900">{data.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  < ShieldCheck className="text-[#8b5cf6]" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Role</p>
                    <p className="font-bold text-gray-900 capitalize">{data.role}</p>
                  </div>
                </div>
              </>
            )}

            {type === "instructor" && (
              <>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  <Mail className="text-[#8b5cf6]" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-gray-900">{data.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  <Clock className="text-[#8b5cf6]" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <p className="font-bold text-gray-900 capitalize">{data.status || "Active"}</p>
                  </div>
                </div>
              </>
            )}

            {type === "course" && (
              <>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  <BookOpen className="text-[#8b5cf6]" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Course Title</p>
                    <p className="font-bold text-gray-900">{data.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  <ShieldCheck className="text-[#8b5cf6]" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</p>
                    <p className="font-bold text-gray-900">{data.category || "General"}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-4">
            {type === "student" && (
              <Link
                href={`/admin/lms/students?email=${data.email}`}
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl bg-[#8b5cf6] text-white font-bold text-center shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Go to Students
                <ArrowRight size={18} />
              </Link>
            )}
            {type === "instructor" && (
              <Link
                href={`/admin/lms/instructors`}
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl bg-[#8b5cf6] text-white font-bold text-center shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Go to Instructors
                <ArrowRight size={18} />
              </Link>
            )}
            {type === "course" && (
              <Link
                href={`/admin/lms/courses`}
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl bg-[#8b5cf6] text-white font-bold text-center shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Edit Course
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
