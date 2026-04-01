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

  // Auto-recovery: If we find a role while on this page, try to redirect back ONLY if valid
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
      
      // ONLY redirect back if they explicitly match the target's role or are cms_admin
      // Ignore if there is no target portal to prevent fallback loops
      if (targetPortal && (role === targetPortal.role || role === 'cms_admin')) {
        console.log(`Unauthorized: Role ${role} authorized for ${next}, redirecting...`);
        window.location.href = next;
      }
    }
  }, [user, role, loading, next]);

  const handleLogout = async () => {
    try {
      await authHelpers.signOut();
      window.location.href = "/auth";
    } catch(err) {
      console.error(err);
    }
  };

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
          : `You are logged in as a ${role?.replace('_', ' ') || 'user'}, but you don't have the necessary administrative permissions to access this specific portal. Please use a different account or contact support.`
        }
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        {!loading && user && (
           <button 
             onClick={handleLogout}
             className="px-6 py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-sm hover:bg-rose-600 transition-all flex items-center justify-center"
           >
             Sign Out & Switch Account
           </button>
        )}
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3.5 rounded-2xl bg-primary-purple text-white font-bold text-sm shadow-lg shadow-primary-purple/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Loader2 size={18} className="animate-spin-slow" />
          <span>Retry Access</span>
        </button>
        <Link 
          href="/" 
          className="px-6 py-3.5 rounded-2xl bg-white border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
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

