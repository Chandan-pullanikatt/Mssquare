"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Upload, Send, CheckCircle2 } from "lucide-react";
import { websiteApi } from "@/lib/api/website";

export default function BecomeInstructorPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "", // User didn't have email in the form but API needs it, adding it.
        message: ""
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const fileInputRef = useState<HTMLInputElement | null>(null);

    const [content, setContent] = useState<any>({
        hero: {
            title: "Become An Instructor",
            subtitle: "Share your expertise and help shape the next generation of developers. Join our elite circle of mentors and instructors.",
        }
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await websiteApi.getSection("become_instructor_content");
                if (data?.content_json) {
                    setContent(data.content_json);
                }
            } catch (err) {
                console.error("Failed to fetch become-instructor content", err);
            }
        };
        fetchContent();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            alert("Please upload your resume");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            data.append("resume", resumeFile);

            const response = await fetch("/api/apply/instructor", {
                method: "POST",
                body: data,
            });

            if (!response.ok) throw new Error("Submission failed");

            setIsSubmitting(false);
            setShowSuccess(true);
            
            // Reset form
            setFormData({
                fullName: "",
                phone: "",
                email: "",
                message: ""
            });
            setResumeFile(null);
            
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary-purple/30">
            <Navbar variant="light" />

            <main className="pt-32 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1e293b] font-heading tracking-tight italic">
                            {content.hero.title}
                        </h1>
                        <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                            {content.hero.subtitle}
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
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Resume / CV</label>
                                <div 
                                    onClick={() => document.getElementById('instructor-resume')?.click()}
                                    className="border-2 border-dashed border-purple-100 bg-primary-purple/5 rounded-3xl p-10 text-center group hover:border-primary-purple/30 hover:bg-primary-purple/10 transition-all cursor-pointer"
                                >
                                    <Upload size={32} className="mx-auto text-primary-purple mb-4 group-hover:-translate-y-1 transition-transform" />
                                    <p className="text-sm font-bold text-gray-900">
                                        {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">PDF, DOCX up to 10MB</p>
                                    <input 
                                        type="file" 
                                        id="instructor-resume"
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        accept=".pdf,.doc,.docx"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Any Message</label>
                                <textarea
                                    rows={5}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
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
