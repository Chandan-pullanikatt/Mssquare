"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase,
  Eye,
  EyeOff,
  Rocket,
  User as UserIcon,
  Mail,
  Lock,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  Settings,
  Grid3X3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authHelpers } from "@/utils/authHelpers";
import { useRouter } from "next/navigation";

type PortalType = {
  id: string;
  name: string;
  href: string;
  icon: any;
  description: string;
};

const PORTALS: PortalType[] = [
  { id: 'student', name: 'Student Account', href: '/student-dashboard', icon: GraduationCap, description: 'Register as a student' },
  { id: 'business', name: 'Business Account', href: '/business-dashboard', icon: Briefcase, description: 'Register as a business' },
];

export default function RegisterPage() {
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(PORTALS[0]);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const authData = await authHelpers.signUp(
        formData.email, 
        formData.password, 
        formData.fullName, 
        selectedPortal.id === "business" ? "business_admin" : "student"
      );
      
      setSuccess(true);
      // Wait a bit then redirect to auth (login) as they need to verify email usually
      // If auto-confirm is on, we could redirect to dashboard, but staying safe.
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await authHelpers.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google signup failed");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Regsitration Successful!</h1>
          <p className="text-[#334155] font-medium leading-relaxed">
            Your account has been created. Please check your email for a confirmation link. 
            Redirecting you to login in a few seconds...
          </p>
          <div className="pt-4">
             <Link href="/auth" className="text-primary-purple font-bold hover:underline">
               Go to Login Now
             </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="md:h-screen bg-light-background text-light-foreground flex flex-col md:flex-row font-sans selection:bg-primary-purple/30 overflow-hidden">
      
      {/* Left Side: Visual Content (Same as Login) */}
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
              <span className="text-xl font-black tracking-tight font-heading text-white">MSSquare</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mt-10 lg:mt-20"
            >
              <h2 className="text-[clamp(2.2rem,3.2vw,3rem)] font-extrabold leading-[1.1] mb-4 font-heading text-white tracking-tight">
                Start your<br />
                journey today.
              </h2>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed font-medium max-w-[340px]">
                Create your workspace and join thousands of students and businesses shaping the future.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#2d2a4a] bg-gray-200 overflow-hidden shadow-md">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i+10}&backgroundColor=f8f9fb&text-gray-500`} alt="avatar" />
                </div>
              ))}
            </div>
            <span className="text-white/60 text-[0.7rem] lg:text-xs font-semibold tracking-wide uppercase">
              Join the MSSquare ecosystem
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form Container */}
      <div className="flex-1 flex flex-col items-center p-4 lg:p-8 relative h-full md:overflow-hidden overflow-y-auto bg-white">
        
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.7rem] font-bold text-[#334155] hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-[420px] flex flex-col h-full justify-between py-2">
          
          <div className="text-center mt-2 mb-4">
            <h1 className="text-[1.8rem] lg:text-[2.1rem] font-black mb-1 font-heading tracking-tight leading-tight text-[#0F172A]">Create Account</h1>
            <p className="font-medium text-[0.85rem] leading-relaxed text-[#334155]">
              Join the MSSquare platform as a student or business associate.
            </p>
          </div>

          {/* Portal Selection Dropdown (Consistent with Login) */}
          <div className="relative mb-4 z-30">
            <label className="text-[0.7rem] font-bold text-[#334155] ml-1 mb-1.5 block">Registration Type</label>
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
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl p-2 z-50 overflow-hidden"
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

          {/* Register Form Card */}
          <div className="bg-white p-6 lg:p-7 rounded-2xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.035)] mb-4">
            
            {/* Google OAuth Option */}
            <button 
              type="button" 
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-2.5 rounded-lg font-bold text-sm text-[#334155] shadow-sm hover:bg-gray-50 transition-all mb-5 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3 mb-5">
              <div className="h-[1px] flex-1 bg-gray-100"></div>
              <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest px-2">OR</span>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg border border-red-100 mb-2">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold text-[#334155] ml-1">Full Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-purple transition-colors">
                    <UserIcon size={16} />
                  </span>
                  <input 
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-gray-300 font-medium text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.7rem] font-bold text-[#334155] ml-1">Email address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-purple transition-colors">
                    <Mail size={16} />
                  </span>
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-gray-300 font-medium text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[0.7rem] font-bold text-[#334155] ml-1">Password</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-purple transition-colors">
                      <Lock size={16} />
                    </span>
                    <input 
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"} 
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

                <div className="space-y-1">
                  <label className="text-[0.7rem] font-bold text-[#334155] ml-1">Confirm Password</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-purple transition-colors">
                      <Lock size={16} />
                    </span>
                    <input 
                      required
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary-purple/5 focus:border-primary-purple outline-none transition-all placeholder:text-gray-300 font-medium text-[#0F172A]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-purple hover:bg-primary-purpleDark text-white py-3 rounded-lg font-bold shadow-lg shadow-primary-purple/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : `Create ${selectedPortal.name}`}
                </button>
              </div>
            </form>

            <div className="mt-5 text-center">
              <p className="text-[0.75rem] font-semibold text-[#334155]">
                Already have an account?{" "}
                <Link href="/auth" className="font-bold text-primary-purple hover:underline ml-1">
                  Log in
                </Link>
              </p>
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
