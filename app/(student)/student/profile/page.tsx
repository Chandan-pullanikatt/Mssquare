"use client";

import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    Shield,
    Bell,
    CheckCircle2,
    AlertCircle,
    ChevronRight
} from "lucide-react";
import Image from "next/image";

import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect } from "react";

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "+1 (555) 123-4567",
        studentId: "",
        major: "Fullstack Development",
        location: "San Francisco, CA",
        bio: "Passionate learner exploring the world of UI/UX and Fullstack Web Development. Dedicated to building accessible and beautiful web applications."
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || "",
                email: user.email || "",
                studentId: user.id.slice(-4)
            }));
        }
    }, [user]);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">Edit Profile</h1>
                    <p className="text-gray-500 font-medium">Update your personal information and profile settings.</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 size={18} />
                            Changes Saved!
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#8b5cf6] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Avatar & Quick Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center">
                        <div className="relative group mb-6">
                            <div className="w-32 h-32 rounded-full bg-[#fed7aa] border-4 border-white shadow-xl overflow-hidden">
                                <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Alex'}&backgroundColor=fed7aa`} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-1 right-1 w-10 h-10 bg-[#8b5cf6] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 border-4 border-white">
                                <Camera size={18} />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.fullName}</h2>
                        <p className="text-sm font-bold text-[#8b5cf6] bg-purple-50 px-3 py-1 rounded-lg uppercase tracking-wider mb-6">
                            Student ID: {formData.studentId}
                        </p>

                        <div className="w-full space-y-4 pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                <Shield size={16} className="text-gray-400" />
                                Verified account
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                <MapPin size={16} className="text-gray-400" />
                                {formData.location}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827] rounded-[2.5rem] p-8 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-[#8b5cf6]">
                            <AlertCircle size={20} />
                            <h3 className="font-bold text-sm uppercase tracking-widest">Premium Student</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6">
                            Your premium subscription is active until Dec 2024. enjoy all the pro features!
                        </p>
                        <button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl py-3 text-sm font-bold transition-colors">
                            Manage Subscription
                        </button>
                    </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <User size={20} className="text-[#8b5cf6]" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all"
                                        placeholder="Phone"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all"
                                        placeholder="Location"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio / About Me</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full bg-gray-50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-[2rem] p-6 text-sm font-bold text-gray-900 outline-none transition-all resize-none leading-relaxed"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <Shield size={20} className="text-[#8b5cf6]" />
                            Security Settings
                        </h3>

                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-[#8b5cf6]/20 hover:bg-gray-50 transition-all font-bold group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                        <Shield size={18} />
                                    </div>
                                    <div className="text-left font-heading">
                                        <div className="text-sm text-gray-900">Change Password</div>
                                        <div className="text-[11px] text-gray-400 uppercase tracking-wider">Secure your account</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-[#8b5cf6]/20 hover:bg-gray-50 transition-all font-bold group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                        <Save size={18} />
                                    </div>
                                    <div className="text-left font-heading">
                                        <div className="text-sm text-gray-900">Two-Factor Authentication</div>
                                        <div className="text-[11px] text-emerald-500 uppercase tracking-wider">Already Enabled</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
