"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8 shadow-sm">
        <ShieldAlert size={40} />
      </div>
      
      <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Access Restricted</h1>
      <p className="text-gray-500 max-w-md mb-10 font-medium leading-relaxed">
        You don't have the necessary administrative permissions to access this section. 
        Please contact your system administrator if you believe this is an error.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link 
          href="/" 
          className="flex-1 px-6 py-3.5 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3.5 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
