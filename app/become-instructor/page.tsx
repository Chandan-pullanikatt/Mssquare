"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Upload, Send, CheckCircle2 } from "lucide-react";

export default function BecomeInstructorPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary-purple/30">
            <Navbar variant="light" />

            <main className="pt-32 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1e293b] font-heading tracking-tight italic">
                            Become An <span className="text-primary-purple">Instructor</span>
                        </h1>
                        <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                            Share your expertise and help shape the next generation of developers. Join our elite circle of mentors and instructors.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-black/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-purple via-blue-500 to-primary-purple"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Resume / CV</label>
                                <div className="border-2 border-dashed border-purple-100 bg-primary-purple/5 rounded-3xl p-10 text-center group hover:border-primary-purple/30 hover:bg-primary-purple/10 transition-all cursor-pointer">
                                    <Upload size={32} className="mx-auto text-primary-purple mb-4 group-hover:-translate-y-1 transition-transform" />
                                    <p className="text-sm font-bold text-gray-900">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">PDF, DOCX up to 10MB</p>
                                    <input type="file" className="hidden" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Any Message</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all resize-none placeholder:text-gray-400 leading-relaxed"
                                    placeholder="Tell us about your teaching experience..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-purple text-white py-6 rounded-3xl font-bold text-lg shadow-xl shadow-primary-purple/20 hover:shadow-primary-purple/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : showSuccess ? (
                                    <>
                                        <CheckCircle2 size={24} />
                                        Application Sent!
                                    </>
                                ) : (
                                    <>
                                        <Send size={24} />
                                        Submit Application
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
