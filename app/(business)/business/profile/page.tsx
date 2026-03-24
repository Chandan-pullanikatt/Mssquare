"use client";

import { useState, useEffect } from "react";
import { User, Mail, Save, ArrowLeft, Camera, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export default function BusinessProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Parallelize updates for faster performance
      const [authResult, profileResult] = await Promise.all([
        supabase.auth.updateUser({
          data: { full_name: fullName }
        }),
        (supabase as any)
          .from('users')
          .update({ name: fullName })
          .eq('id', user?.id || '')
      ]);

      if (authResult.error) throw authResult.error;
      // We don't necessarily throw if profiles update fails, 
      // as some users might not have a record yet depending on the trigger setup.
      if (profileResult.error) {
        console.warn("Profile table update warning:", profileResult.error);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // onAuthStateChange in AuthProvider will pick up the auth update automatically
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/business/dashboard" 
            className="flex items-center gap-2 text-gray-500 hover:text-[#8b5cf6] transition-colors mb-4 font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 italic">Profile Settings</h1>
          <p className="text-gray-500 font-medium">Manage your business account information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-[#bbf7d0] border-4 border-white shadow-lg flex items-center justify-center text-[#166534] text-4xl font-black overflow-hidden relative">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'BP'
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
            </div>
            
            <h2 className="mt-6 text-xl font-bold text-gray-900">{fullName || 'Business Partner'}</h2>
            <p className="text-sm text-gray-500 font-medium">{email}</p>
            
            <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 italic">
              <Shield size={14} />
              Verified Business Account
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-3xl p-6 text-white shadow-xl shadow-[#8b5cf6]/20">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-white/80 text-sm mb-4">Contact our support team for specialized business assistance.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2.5 rounded-xl text-sm font-bold transition-all">
              Contact Support
            </button>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 italic">
              <User className="text-[#8b5cf6]" size={20} />
              Personal Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Sterling"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none font-medium transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 opacity-60">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address (Locked)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <ArrowLeft size={18} className="rotate-180" />}
                  {message.text}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#8b5cf6]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2 italic">Account Security</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Manage your login credentials and security settings.</p>
            
            <button className="flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] text-sm font-bold transition-colors">
              Reset Password
              <CheckCircle2 size={14} className="opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
