"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase,
  Eye,
  EyeOff,
  Rocket,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  Settings,
  Grid3X3,
  Mail,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authHelpers } from "@/utils/authHelpers";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";

type PortalType = {
  id: string;
  name: string;
  href: string;
  icon: any;
  description: string;
};

const PORTALS: PortalType[] = [
  { id: 'lms_admin', name: 'LMS Admin', href: '/admin/lms/dashboard', icon: Settings, description: 'Course management' },
  { id: 'business_admin', name: 'Business Admin', href: '/admin/business/dashboard', icon: ShieldCheck, description: 'Client request management' },
  { id: 'cms_admin', name: 'CMS Admin', href: '/admin/cms/dashboard', icon: Grid3X3, description: 'CEO content control' },
];

function AuthForm() {
  const searchParams = useSearchParams();
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pId = params.get('portal');
      if (pId) {
        const found = PORTALS.find(p => p.id === pId);
        if (found) return found;
      }
    }
    return PORTALS[0];
  });
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, loading: authLoading } = useAuth();

  const submitting = useRef(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }

    const portalParam = searchParams.get('portal');
    if (portalParam) {
      const portal = PORTALS.find(p => p.id === portalParam);
      if (portal) {
        setSelectedPortal(portal);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user && role && !isLoading && !submitting.current) {
      if (role === selectedPortal.id) {
        authHelpers.getRedirectPath(role).then(p => {
          if (pathname !== p) window.location.href = p;
        });
      }
    }
  }, [user, role, authLoading, pathname, isLoading, selectedPortal.id]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    
    submitting.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await authHelpers.signIn(email, password);
      if (authError) throw authError;
      
      if (data.user) {
        window.location.href = selectedPortal.href;
      } else {
        setIsLoading(false);
        submitting.current = false;
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setIsLoading(false);
      submitting.current = false;
    }
  };

  return (
    <div className="md:h-screen bg-light-background text-light-foreground flex flex-col md:flex-row font-sans selection:bg-primary-purple/30 overflow-hidden">
      
      {/* Left Side: Visual Content (Desktop) */}
      <div className="hidden md:flex flex-[0.75] lg:flex-1 relative overflow-hidden h-full">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/loginleftside.png" 
            alt="Auth Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2e]/90 via-[#2d2a4a]/85 to-primary-purple/40"></div>
        </div>

        <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-between h-full w-full">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-10 lg:mb-16 group">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 shadow-lg transition-transform group-hover:scale-105">
                <Rocket size={18} fill="white" />
              </div>
              <span className="text-xl font-black tracking-tight font-heading text-white">MSSquare Admin</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mt-10 lg:mt-20"
            >
              <h2 className="text-[clamp(2.2rem,3.2vw,3rem)] font-extrabold leading-[1.1] mb-4 font-heading text-white tracking-tight">
                Control Center.<br />
                Manage Excellence.
              </h2>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed font-medium max-w-[340px]">
                Access the core administrative tools to oversee the MSSquare ecosystem.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mb-2">
             <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#2d2a4a] bg-gray-200 relative overflow-hidden shadow-md">
                   <Image 
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=admin${i}&backgroundColor=f8f9fb&text-gray-500`} 
                     alt="avatar" 
                     fill
                     className="object-cover"
                   />
                </div>
              ))}
            </div>
            <span className="text-white/60 text-[0.7rem] lg:text-xs font-semibold tracking-wide uppercase">
              Secure Administrative Access
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="flex-1 flex flex-col items-center p-4 lg:p-8 relative h-full md:overflow-hidden overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
        
        {/* Back to Login Button */}
        <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-20">
          <Link 
            href="/auth" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.7rem] font-bold text-[#334155] hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </Link>
        </div>

        <div className="w-full max-w-[400px] flex flex-col h-full justify-between py-2">
          
          <div className="text-center mt-4 mb-3">
            <h1 className="text-[1.8rem] lg:text-[2.1rem] font-black mb-1 font-heading tracking-tight leading-tight" style={{ color: '#0F172A' }}>Admin Portal</h1>
            <p className="font-medium text-[0.85rem] leading-relaxed" style={{ color: '#334155' }}>
              Sign in with your administrative credentials.
            </p>
          </div>

          {/* Portal Selection Dropdown */}
          <div className="relative mb-4 z-30">
            <label className="text-[0.7rem] font-bold text-[#334155] ml-1 mb-1.5 block">Select Admin Type</label>
            <button
              type="button"
              onClick={() => setShowPortalDropdown(!showPortalDropdown)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-primary-purple/30 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-purple/10 flex items-center justify-center text-primary-purple group-hover:scale-110 transition-transform">
                  <selectedPortal.icon size={18} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-[0.8rem] font-bold text-[#0F172A] leading-tight">{selectedPortal.name}</span>
                  <span className="text-[0.65rem] text-[#94A3B8] font-medium">{selectedPortal.description}</span>
                </div>
              </div>
              <ChevronDown size={18} className={`text-[#94A3B8] transition-transform duration-300 ${showPortalDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showPortalDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl p-2 z-50 max-h-[280px] overflow-y-auto"
                >
                  {PORTALS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPortal(p);
                        setShowPortalDropdown(false);
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all group ${
                        selectedPortal.id === p.id ? 'bg-primary-purple/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        selectedPortal.id === p.id ? 'bg-primary-purple text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary-purple'
                      }`}>
                        <p.icon size={16} />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className={`text-[0.75rem] font-bold ${selectedPortal.id === p.id ? 'text-primary-purple' : 'text-gray-700'}`}>{p.name}</span>
                        <span className="text-[0.6rem] text-gray-400 font-medium">{p.description}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login Form Card */}
          <div className="bg-white p-6 lg:p-7 rounded-2xl border border-light-border shadow-[0_20px_60px_rgba(0,0,0,0.035)] mb-4">
            <form onSubmit={handleAuth} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-bold text-[#334155] ml-1">Admin Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-purple transition-colors">
                    <Mail size={16} />
                  </span>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mssquaretechnologies.com"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-gray-300 font-medium text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[0.7rem] font-bold text-[#334155]">Password</label>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-purple transition-colors">
                    <Lock size={16} />
                  </span>
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-lg py-2.5 pl-11 pr-12 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-gray-300 font-medium text-[#0F172A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0F172A] hover:bg-black text-white py-3 rounded-lg font-bold shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isLoading ? "Authenticating..." : "Login as Admin"}
              </button>
            </form>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 lg:gap-6 text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.15em] shrink-0 pb-4">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAuthPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>}>
      <AuthForm />
    </Suspense>
  );
}
