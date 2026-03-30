"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { authHelpers } from "@/utils/authHelpers";

function UnauthorizedContent() {
  const { user, role, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') || '/portal';

  // Auto-recovery: If we find a role while on this page, try to redirect back
  useEffect(() => {
    if (!loading && user && role) {
      // Check if role matches the intended destination
      const portalRoutes = [
        { path: '/student', role: 'student' },
        { path: '/business', role: 'business_client' },
        { path: '/admin/lms', role: 'lms_admin' },
        { path: '/admin/business', role: 'business_admin' },
        { path: '/admin/cms', role: 'cms_admin' },
        { path: '/instructor', role: 'instructor' },
      ];
      
      const targetPortal = portalRoutes.find(p => next.startsWith(p.path));
      
      // If no specific portal target or target role matches current role
      if (!targetPortal || role === targetPortal.role || role === 'cms_admin') {
        console.log(`Unauthorized: Role ${role} detected, redirecting back to ${next}...`);
        window.location.href = next;
      }
    }
  }, [user, role, loading, next]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8 shadow-sm">
        {loading ? <Loader2 size={40} className="animate-spin text-purple-600" /> : <ShieldAlert size={40} />}
      </div>
      
      <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
        {loading ? "Verifying Permissions..." : "Access Restricted"}
      </h1>
      <p className="text-gray-500 max-w-md mb-10 font-medium leading-relaxed">
        {loading 
          ? "We're setting up your account and checking your access rights. This will only take a moment."
          : "You don't have the necessary administrative permissions to access this section. Please contact your system administrator if you believe this is an error."
        }
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button 
          onClick={() => {
            // Force a reload which will trigger AuthProvider to re-check role
            window.location.reload();
          }}
          className="flex-1 px-6 py-3.5 rounded-2xl bg-primary-purple text-white font-bold text-sm shadow-lg shadow-primary-purple/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Loader2 size={18} className="animate-spin-slow" />
          <span>Try Again</span>
        </button>
        <Link 
          href="/" 
          className="flex-1 px-6 py-3.5 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}

