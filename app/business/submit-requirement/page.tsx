"use client";

import { useState } from "react";
import { Send, FileText, CheckCircle2, ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function SubmitRequirementPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center shadow-xl shadow-black/5">
                    <div className="w-20 h-20 bg-[#f5f3ff] text-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight italic">Requirement Submitted!</h2>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed text-[15px]">
                        Thank you for sharing your project details. Our specialized consulting team will review your requirements and reach out within 24 hours.
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/business/dashboard"
                            className="block w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all active:scale-95"
                        >
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="block w-full py-4 rounded-2xl font-bold text-[#8b5cf6] transition-all hover:bg-gray-50"
                        >
                            Submit Another Request
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic">
                        Submit New Requirement
                    </h1>
                    <p className="text-gray-500 font-medium text-[15px]">
                        Please provide the details of the service or expertise you're looking for.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <FileText size={14} className="text-[#8b5cf6]" />
                    Project Entry Form
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-10 relative overflow-hidden">
                {/* Banner Decoration */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-[#8b5cf6] to-purple-500"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Project Details */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <PlusCircle size={20} className="text-[#8b5cf6]" />
                            Project Information
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Title</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                            placeholder="e.g. Q4 Growth Strategy"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Service Type</label>
                        <select className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer">
                            <option>IT Consultancy</option>
                            <option>Business Strategy</option>
                            <option>Legal & Compliance</option>
                            <option>HR & Recruitment</option>
                            <option>Financial Audit</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Budget Range</label>
                        <select className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer">
                            <option>Under $10,000</option>
                            <option>$10,000 - $50,000</option>
                            <option>$50,000 - $100,000</option>
                            <option>Above $100,000</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Expected Timeline</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                            placeholder="e.g. 3-6 Months"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Project Description</label>
                        <textarea
                            required
                            rows={6}
                            className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
                            placeholder="Describe your goals, current challenges, and specific requirements..."
                        />
                    </div>

                    {/* Contact Details Section */}
                    <div className="md:col-span-2 pt-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Send size={20} className="text-[#8b5cf6]" />
                            Preferred Contact
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Name</label>
                        <input
                            required
                            type="text"
                            defaultValue="Alex Sterling"
                            className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Method</label>
                        <select className="w-full bg-gray-50/50 border border-transparent focus:border-[#8b5cf6]/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer">
                            <option>Email</option>
                            <option>Video Call</option>
                            <option>Phone Call</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-semibold text-gray-400 max-w-[300px]">
                        By submitting, you agree to our terms regarding project evaluation and advisory confidentiality.
                    </p>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#8b5cf6] text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#8b5cf6]/20 hover:shadow-2xl hover:shadow-[#8b5cf6]/40 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={20} />
                                Submit Now
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Helpful Tips */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#f5f3ff] rounded-3xl border border-[#8b5cf6]/10 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                        <PlusCircle className="text-[#8b5cf6]" size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Clear Scope</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">Providing a detailed scope helps our team assign the right consultants faster.</p>
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <ChevronRight className="text-gray-400" size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1">Next Steps</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">After submission, you can track the status of this request in the "Requested Services" section.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
