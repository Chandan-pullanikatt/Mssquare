"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Rocket, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/instructor/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Password Set Successfully!</h2>
        <p className="text-gray-500 font-medium">Redirecting you to the login page...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-2xl flex items-center justify-center text-[#8b5cf6] mx-auto mb-4">
          <Lock size={24} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">Complete Your Account</h1>
        <p className="text-gray-500 font-medium">Please set a secure password for your instructor account.</p>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
            <input 
              required
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
            <input 
              required
              type={showPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#8b5cf6]/20 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#8b5cf6] text-white py-4 rounded-3xl font-bold shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <span>Set Password & Continue</span>
              <Rocket size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row bg-white rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px]">
        {/* Left Side (Visual) */}
        <div className="hidden md:flex flex-1 relative bg-[#8b5cf6] p-12 flex-col justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                <Rocket size={20} />
             </div>
             <span className="text-xl font-black text-white tracking-tight">MSsquare</span>
          </div>
          
          <div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">Start your<br/>teaching journey.</h2>
            <p className="text-white/80 font-medium max-w-sm">Welcome to our faculty. Set your credentials to access your course management dashboard.</p>
          </div>

          <div className="text-white/40 text-[10px] uppercase font-black tracking-widest">
            Faculty Enrollment Portal
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 flex items-center justify-center">
          <Suspense fallback={<Loader2 className="animate-spin text-[#8b5cf6]" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
