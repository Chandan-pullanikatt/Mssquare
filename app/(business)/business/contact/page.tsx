"use client";

import { useState } from "react";
import { 
  Send, 
  HeadphonesIcon, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Globe,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { leadsApi } from "@/lib/api/leads";

export default function ContactTeamPage() {
    const { user, loading: authLoading } = useAuth() as any;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        company: "",
        message: "",
        subject: "General Inquiry"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await leadsApi.submitLead({
                name: formData.name,
                email: formData.email,
                company: formData.company || "Business Portal User",
                message: `[Subject: ${formData.subject}] ${formData.message}`,
                source: "Business Portal Inquiry"
            });
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Contact submission error:", err);
            setError("Failed to send your message. Please try again or contact us directly via email.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center shadow-2xl shadow-black/5">
                    <div className="w-20 h-20 bg-[#f5f3ff] text-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight italic">Message Sent!</h2>
                    <p className="text-gray-700 font-bold mb-10 leading-relaxed text-[15px]">
                        We've received your inquiry. Our support team will review your message and get back to you within 4-6 business hours.
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
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#f5f3ff] text-[#8b5cf6] px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 border border-[#8b5cf6]/10">
                    <HeadphonesIcon size={14} />
                    Support & Strategy
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 italic tracking-tight">How can we assist your business?</h1>
                <p className="text-gray-700 font-bold text-lg max-w-2xl mx-auto italic">
                    Have a specific challenge or need strategic guidance? Our team of experts is ready to help you scale and optimize.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Contact Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-8 italic">Direct Contact</h3>
                        <div className="space-y-8">
                            <div className="flex gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#8b5cf6] group-hover:bg-[#8b5cf6]/10 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Email Us</div>
                                    <div className="text-sm font-bold text-gray-900">operations@mssquaretechnologies.com</div>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#8b5cf6] group-hover:bg-[#8b5cf6]/10 transition-colors">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Call Support</div>
                                    <div className="text-sm font-bold text-gray-900">+91 9492982929</div>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#8b5cf6] group-hover:bg-[#8b5cf6]/10 transition-colors">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Headquarters</div>
                                    <div className="text-sm font-bold text-gray-900">Hyderabad, India</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#8b5cf6] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#8b5cf6]/20 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Clock size={160} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 italic">Expect a fast response</h3>
                        <p className="text-white/80 text-sm font-bold leading-relaxed mb-6">
                            Our business support team operates 24/7. Most inquiries are addressed within a few business hours.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                            <Clock size={14} />
                            Avg Response: 4-6 Hours
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-8 relative">
                         {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Work Email</label>
                                    <input
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full bg-gray-50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="john@company.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Project Issue</option>
                                        <option>Billing Question</option>
                                        <option>Partnership Proposal</option>
                                        <option>Technical Support</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Company Name</label>
                                    <input
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Your Message</label>
                                <textarea
                                    required
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full bg-gray-50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all resize-none leading-relaxed placeholder:text-gray-400"
                                    placeholder="How can we help your business thrive?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#8b5cf6] text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#8b5cf6]/20 hover:shadow-2xl hover:bg-[#7c3aed] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="mt-20 py-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 italic">Live Chat</h4>
                        <p className="text-xs text-gray-700 font-bold">Available Mon-Fri, 9am - 6pm EST</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 group text-sm font-bold text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white px-6 py-3 rounded-2xl border border-[#8b5cf6]/20 transition-all">
                    Launch Live Chat
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
