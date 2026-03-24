"use client";

import Link from "next/link";
import { useState } from "react";
import { Send, LayoutGrid } from "lucide-react";

export default function SubmitProjectPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 800);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#fdfdfd] flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
                    <div className="w-20 h-20 bg-[#f5f3ff] rounded-full flex items-center justify-center mx-auto mb-6 text-[#8b5cf6]">
                        <Send size={32} className="ml-1" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Project Submitted!</h1>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Thank you for reaching out. Our team will review your requirements and get back to you within 24 hours.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="w-full bg-[#8b5cf6] text-white py-3.5 rounded-xl font-bold hover:bg-[#7c3aed] transition-colors"
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfdfd] font-sans flex flex-col">

            {/* Top Navigation */}
            <header className="w-full px-8 py-6 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8b5cf6]/20">
                        <LayoutGrid size={20} />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-gray-900">MSSquare</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                    <Link href="#" className="hover:text-gray-900 transition-colors">Services</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Portfolio</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">About</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link>
                </div>
                <Link
                    href="/portal"
                    className="bg-[#8b5cf6] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-sm shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-transform"
                >
                    Login
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

                {/* Header Text */}
                <div className="text-center mb-12 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Tell Us About Your Project
                    </h1>
                    <p className="text-[15px] font-medium text-gray-500 leading-relaxed">
                        Fill out the form below to help us understand your business needs. Our team of experts will review your requirements and get back to you with a tailored solution.
                    </p>
                </div>

                {/* The Form Container */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12"
                >

                    <div className="space-y-8">
                        {/* Row 1: Company & Industry */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Company Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Acme Corp"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Industry</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Technology, Healthcare"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Row 2: Service Type Radio-style toggle */}
                        <div className="space-y-2.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Service Type</label>
                            <div className="grid grid-cols-2 gap-0 bg-gray-50 border border-gray-200 rounded-2xl p-1 relative">
                                <div className="relative">
                                    <input type="radio" name="serviceType" id="it" className="peer sr-only" defaultChecked />
                                    <label htmlFor="it" className="block text-center cursor-pointer py-3 rounded-xl text-sm font-bold text-gray-500 peer-checked:bg-white peer-checked:text-[#8b5cf6] peer-checked:shadow-sm transition-all">
                                        IT Service
                                    </label>
                                </div>
                                <div className="relative">
                                    <input type="radio" name="serviceType" id="nonit" className="peer sr-only" />
                                    <label htmlFor="nonit" className="block text-center cursor-pointer py-3 rounded-xl text-sm font-bold text-gray-500 peer-checked:bg-white peer-checked:text-[#8b5cf6] peer-checked:shadow-sm transition-all">
                                        Non-IT Service
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Budget & Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Budget Range</label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium appearance-none"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select range</option>
                                    <option value="1">Under $10,000</option>
                                    <option value="2">$10,000 - $50,000</option>
                                    <option value="3">$50,000 - $100,000</option>
                                    <option value="4">Above $100,000</option>
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Estimated Timeline</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 3 Months"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Row 4: Description */}
                        <div className="space-y-2.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Project Description</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium resize-y"
                                placeholder="Briefly describe your goals, challenges, and requirements..."
                            ></textarea>
                        </div>

                        {/* Contact Heading */}
                        <div className="pt-6">
                            <h3 className="text-lg font-bold text-gray-900">Contact Person Information</h3>
                        </div>

                        {/* Row 5: Contact Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="john@company.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Row 6: Phone */}
                        <div className="space-y-2.5">
                            <label className="text-[13px] font-bold text-gray-700 ml-1">Phone Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                            />
                        </div>

                    </div>

                    <div className="mt-10">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] text-white py-4 rounded-2xl font-extrabold text-[15px] hover:bg-[#7c3aed] transition-colors shadow-lg shadow-[#8b5cf6]/20"
                        >
                            <Send size={18} />
                            Submit Requirement
                        </button>
                        <p className="text-center text-[11px] font-semibold text-gray-400 mt-4">
                            Your request will be reviewed by our team. We usually respond within 24 hours.
                        </p>
                    </div>
                </form>

            </main>

            {/* Trust Logos */}
            <div className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
                        Trusted by industry leaders
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
                        {/* Using text logos as placeholders for the companies in screenshot */}
                        <div className="flex items-center gap-2 font-bold text-xl"><LayoutGrid size={24} /> TechFlow</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><LayoutGrid size={24} /> GlobalLink</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><LayoutGrid size={24} /> DataCore</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-gray-100 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 bottom-0">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#8b5cf6] rounded-md flex items-center justify-center text-white">
                        <LayoutGrid size={12} />
                    </div>
                    <span className="font-extrabold text-sm text-gray-900">MSSquare</span>
                </div>

                <div className="flex text-[11px] font-bold text-gray-400 gap-6">
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Help Center</Link>
                </div>

                <div className="text-[11px] font-semibold text-gray-400">
                    © {new Date().getFullYear()} MSSquare Inc. All rights reserved.
                </div>
            </footer>

        </div>
    );
}
