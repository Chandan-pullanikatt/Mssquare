"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase,
  Eye,
  EyeOff,
  Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/lib/design-tokens";

import { authHelpers } from "@/utils/authHelpers";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

type Portal = "student" | "business";

export default function AuthPage() {
  const [portal, setPortal] = useState<Portal>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await authHelpers.signIn(email, password);
      if (authError) throw authError;
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authHelpers.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setIsLoading(false);
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
          {/* Violet/Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2e]/90 via-[#2d2a4a]/85 to-primary-purple/40"></div>
        </div>

        <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-between h-full w-full">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-10 lg:mb-16 group">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 shadow-lg transition-transform group-hover:scale-105">
                <Rocket size={18} fill="white" />
              </div>
              <span className="text-xl font-black tracking-tight font-heading text-white">MSSquare</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mt-10 lg:mt-20"
            >
              <h2 className="text-[clamp(2.2rem,3.2vw,3rem)] font-extrabold leading-[1.1] mb-4 font-heading text-white tracking-tight">
                Elevate your<br />
                workflow with us.
              </h2>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed font-medium max-w-[340px]">
                Join over 10,000 students and businesses managing their future in one unified workspace.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#2d2a4a] bg-gray-200 overflow-hidden shadow-md">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i+15}&backgroundColor=f8f9fb&text-gray-500`} alt="avatar" />
                </div>
              ))}
            </div>
            <span className="text-white/60 text-[0.7rem] lg:text-xs font-semibold tracking-wide uppercase">
              Trusted by modern teams worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="flex-1 flex flex-col items-center p-4 lg:p-8 relative h-full md:overflow-hidden overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
        
        <div className="w-full max-w-[400px] flex flex-col h-full justify-between py-2">
          
          <div className="text-center mt-4 mb-2">
            <h1 className="text-[1.8rem] lg:text-[2.1rem] font-black mb-1 font-heading tracking-tight leading-tight" style={{ color: '#0F172A' }}>Welcome to MSSquare</h1>
            <p className="font-medium text-[0.85rem] leading-relaxed" style={{ color: '#334155' }}>
              Access your learning dashboard or manage your business projects.
            </p>
          </div>

          {/* Portal Selection Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setPortal("student")}
              className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-300 bg-white ${
                portal === "student" 
                ? "border-primary-purple shadow-xl shadow-primary-purple/5" 
                : "border-light-border hover:border-light-border/50"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                portal === "student" ? "bg-primary-purple/10 text-primary-purple" : "bg-light-surface text-[#94A3B8]"
              }`}>
                <GraduationCap size={18} />
              </div>
              <span className={`font-bold text-[0.75rem] tracking-wide ${portal === "student" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>
                Student Portal
              </span>
            </button>
            <button
              onClick={() => setPortal("business")}
              className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-300 bg-white ${
                portal === "business" 
                ? "border-primary-purple shadow-xl shadow-primary-purple/5" 
                : "border-light-border hover:border-light-border/50"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                portal === "business" ? "bg-primary-purple/10 text-primary-purple" : "bg-light-surface text-[#94A3B8]"
              }`}>
                <Briefcase size={18} fill={portal === "business" ? "currentColor" : "none"} className={portal === "business" ? "opacity-80" : ""} />
              </div>
              <span className={`font-bold text-[0.75rem] tracking-wide ${portal === "business" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>
                Business Portal
              </span>
            </button>
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
                <label className="text-[0.7rem] font-bold text-[#334155] ml-1">Email address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-light-surface/30 border border-light-border rounded-lg py-2.5 px-4 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-[#94A3B8] font-medium text-[#0F172A]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[0.7rem] font-bold text-[#334155]">Password</label>
                  <button type="button" className="text-[0.65rem] font-black text-primary-purple uppercase tracking-wider hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-light-surface/30 border border-light-border rounded-lg py-2.5 pl-4 pr-12 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-[#94A3B8] font-medium text-[#0F172A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 py-0.5">
                <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded border-light-border text-primary-purple focus:ring-primary-purple/20 cursor-pointer" />
                <label htmlFor="remember" className="text-[0.7rem] font-bold text-[#334155] cursor-pointer">Remember me</label>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-purple hover:bg-primary-purpleDark text-white py-3 rounded-lg font-bold shadow-lg shadow-primary-purple/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isLoading ? "Signing in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="relative flex items-center gap-3 my-5">
              <div className="h-[1px] flex-1 bg-gray-100"></div>
              <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest px-2">OR</span>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>

            {/* Google OAuth Option */}
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-2.5 rounded-lg font-bold text-sm text-[#334155] shadow-sm hover:bg-gray-50 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-5 text-center">
              <p className="text-[0.75rem] font-semibold text-[#334155]">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-bold text-primary-purple hover:underline ml-1">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Access Section */}
          <div className="shrink-0 mb-4 px-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] flex-1 bg-light-border"></div>
              <span className="text-[0.6rem] font-black text-light-foreground/40 uppercase tracking-[0.2em]">Try the Demo</span>
              <div className="h-[1px] flex-1 bg-light-border"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/student/dashboard" className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-all group shadow-sm">
                <Eye size={14} className="text-gray-400 group-hover:text-gray-600" />
                <span className="text-[0.7rem] font-bold text-gray-500">Student Demo</span>
              </Link>
              <Link href="/business/dashboard" className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-all group shadow-sm">
                <Eye size={14} className="text-gray-400 group-hover:text-gray-600" />
                <span className="text-[0.7rem] font-bold text-gray-500">Business Demo</span>
              </Link>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 lg:gap-6 text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.15em] shrink-0 pb-4">
            <Link href="/" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <Link href="/" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <Link href="/" className="hover:text-gray-600 transition-colors">Help Center</Link>
          </div>

        </div>

      </div>
    </div>
  );
}
