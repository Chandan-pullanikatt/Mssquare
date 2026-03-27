"use client";

import { 
  X, 
  Mail, 
  Calendar, 
  Shield, 
  BookOpen, 
  ExternalLink,
  User,
  GraduationCap,
  MessageSquare,
  FileText
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface AdminDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'student' | 'instructor' | 'course' | 'blog' | 'lead' | 'enquiry';
}

export function AdminDetailModal({ isOpen, onClose, data, type }: AdminDetailModalProps) {
  if (!isOpen || !data) return null;

  const getPortalLink = () => {
    switch (type) {
      case 'student': return `/admin/cms/users?search=${data.email}`;
      case 'instructor': return `/admin/lms/instructors`;
      case 'course': return `/admin/cms/courses`;
      case 'blog': return `/admin/cms/blog`;
      case 'lead': return `/admin/cms/leads`;
      case 'enquiry': return `/admin/business/enquiries`;
      default: return '#';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              type === 'student' ? 'bg-blue-500' : 
              type === 'instructor' ? 'bg-indigo-500' : 
              type === 'course' ? 'bg-amber-500' : 
              type === 'blog' ? 'bg-rose-500' :
              type === 'lead' ? 'bg-emerald-500' : 'bg-[#8b5cf6]'
            }`}>
              {type === 'student' && <GraduationCap size={28} />}
              {type === 'instructor' && <Shield size={28} />}
              {type === 'course' && <BookOpen size={28} />}
              {type === 'blog' && <FileText size={28} />}
              {type === 'lead' && <User size={28} />}
              {type === 'enquiry' && <MessageSquare size={28} />}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 italic leading-none">
                {type === 'course' || type === 'blog' || type === 'enquiry' ? (data.title || data.subject) : (data.name || data.email?.split('@')[0])}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">
                {type} Information
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
            <X size={20} className="text-gray-400 group-hover:text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-4 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {(data.email || data.user_email) && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group">
                <Mail size={18} className="text-gray-400 group-hover:text-[#8b5cf6] transition-colors" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-gray-900">{data.email || data.user_email}</p>
                </div>
              </div>
            )}

            {data.category && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Shield size={18} className="text-gray-400" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</p>
                  <p className="text-sm font-bold text-gray-900">{data.category}</p>
                </div>
              </div>
            )}

            {data.created_at && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added On</p>
                  <p className="text-sm font-bold text-gray-900">{format(new Date(data.created_at), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link 
              href={getPortalLink()} 
              onClick={onClose}
              className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all active:scale-95"
            >
              Go to Management
              <ExternalLink size={18} />
            </Link>
            <button 
              onClick={onClose}
              className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
