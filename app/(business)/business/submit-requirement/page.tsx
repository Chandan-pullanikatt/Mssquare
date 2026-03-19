"use client";

import { useState, useEffect } from "react";
import { Send, FileText, CheckCircle2, ChevronRight, PlusCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { businessApi, ConsultancyService } from "@/lib/api/business";

export default function SubmitRequirementPage() {
    const { user, loading: authLoading } = useAuth() as any;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [services, setServices] = useState<ConsultancyService[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        service_type: "",
        budget: "Under $10,000",
        timeline: "",
        description: "",
        contact_name: "",
        contact_method: "Email"
    });

    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await businessApi.getConsultancyServices();
                setServices(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, service_type: data[0].name }));
                }
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        }
        fetchServices();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                contact_name: user.user_metadata?.full_name || user.email?.split('@')[0] || ""
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to submit a requirement.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await businessApi.submitServiceRequest({
                user_id: user.id,
                title: formData.title,
                service_type: formData.service_type,
                budget: formData.budget,
                timeline: formData.timeline,
                description: formData.description,
                contact_name: formData.contact_name,
                contact_method: formData.contact_method
            });
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Submission error:", err);
            setError("Failed to submit your request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary-purple/20 border-t-primary-purple rounded-full animate-spin" />
                <p className="text-gray-700 font-bold italic">Loading your session...</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center shadow-xl shadow-black/5">
                    <div className="w-20 h-20 bg-[#f5f3ff] text-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight italic">Requirement Submitted!</h2>
                    <p className="text-gray-700 font-bold mb-10 leading-relaxed text-[15px]">
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
                            onClick={() => {
                                setIsSuccess(false);
                                setFormData(prev => ({ ...prev, title: "", description: "", timeline: "" }));
                            }}
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
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2 italic text-left">
                        Submit New Requirement
                    </h1>
                    <p className="text-gray-700 font-bold text-[15px]">
                        Please provide the details of the service or expertise you're looking for.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <FileText size={14} className="text-[#8b5cf6]" />
                    Project Entry Form
                </div>
            </div>

            {error && (
                <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

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
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Project Title</label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. Q4 Growth Strategy"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Service Type</label>
                        <select 
                            name="service_type"
                            value={formData.service_type}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                        >
                            {services.map(service => (
                                <option key={service.id} value={service.name}>{service.name}</option>
                            ))}
                            {services.length === 0 && <option>Loading services...</option>}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Budget Range</label>
                        <select 
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>Under $10,000</option>
                            <option>$10,000 - $50,000</option>
                            <option>$50,000 - $100,000</option>
                            <option>Above $100,000</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Expected Timeline</label>
                        <input
                            required
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            type="text"
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. 3-6 Months"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Project Description</label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all resize-none placeholder:text-gray-400 leading-relaxed"
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
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Contact Name</label>
                        <input
                            required
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            type="text"
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest ml-1">Preferred Method</label>
                        <select 
                            name="contact_method"
                            value={formData.contact_method}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#8b5cf6] focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>Email</option>
                            <option>Video Call</option>
                            <option>Phone Call</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-gray-700 max-w-[300px]">
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
                        <h4 className="font-bold text-gray-900 mb-1 italic">Clear Scope</h4>
                        <p className="text-xs text-gray-700 font-bold leading-relaxed">Providing a detailed scope helps our team assign the right consultants faster.</p>
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <ChevronRight className="text-gray-400" size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1 italic">Next Steps</h4>
                        <p className="text-xs text-gray-700 font-bold leading-relaxed">After submission, you can track the status of this request in the "My Projects" section.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
