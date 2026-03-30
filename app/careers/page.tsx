"use client";
import {
    Rocket,
    Lightbulb,
    TrendingUp,
    Users,
    MapPin,
    Clock,
    ArrowRight,
    Upload,
    Send,
    CheckCircle2,
    ChevronDown,
    Globe,
    Briefcase,
    Monitor,
    GraduationCap,
    Scale
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { COLORS, SHADOWS } from "@/lib/design-tokens";
import { Footer } from "@/components/layout/Footer";

const culture = [
    {
        title: "Innovation First",
        description: "We push boundaries and embrace new technologies. Your wildest ideas have a home here.",
        icon: Lightbulb,
        color: "text-primary-purple",
        bg: "bg-primary-purple/10"
    },
    {
        title: "Learning & Growth",
        description: "Continuous mentorship and annual professional development budgets for every single team member.",
        icon: TrendingUp,
        color: "text-primary-purple",
        bg: "bg-primary-purple/10"
    },
    {
        title: "Flexible Culture",
        description: "Work-life balance that empowers your best performance. Remote-first with beautiful hub offices.",
        icon: Users,
        color: "text-primary-purple",
        bg: "bg-primary-purple/10"
    }
];

const jobs = [
    {
        title: "Senior React Developer",
        department: "Engineering",
        location: "Remote / London",
        type: "Full-time",
        icon: Monitor
    },
    {
        title: "UI/UX Designer",
        department: "Product Design",
        location: "Amsterdam",
        type: "Full-time",
        icon: Briefcase
    },
    {
        title: "Growth Marketing Manager",
        department: "Marketing",
        location: "New York / Remote",
        type: "Full-time",
        icon: TrendingUp
    }
];

export default function CareersPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All Roles");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "Select a role",
        linkedinUrl: "",
        portfolioUrl: "",
        coverLetter: ""
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

            const response = await fetch("/api/apply/career", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Submission failed");
            }

            setIsSubmitting(false);
            setShowSuccess(true);
            
            // Reset form
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                position: "Select a role",
                linkedinUrl: "",
                portfolioUrl: "",
                coverLetter: ""
            });
            setResumeFile(null);
            
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error: any) {
            console.error("Career Submission Error:", error);
            alert(`Error: ${error.message || "Something went wrong. Please try again."}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-light-background font-sans selection:bg-primary-purple/30">

            {/* Navigation Layer */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-gray-50 px-8 flex items-center justify-between">
                <Link href="/" className="relative h-10 w-40 transition-transform duration-300 hover:scale-[1.02]">
                    <Image 
                        src="/assets/nobglogo.png" 
                        alt="MSSquare" 
                        fill
                        priority
                        className="object-contain object-left brightness-0"
                        sizes="(max-width: 768px) 160px, 160px"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-sm font-bold text-light-foreground/60 hover:text-primary-purple transition-colors">Home</Link>
                    <Link href="/become-instructor" className="text-sm font-bold text-light-foreground/60 hover:text-primary-purple transition-colors">Become An Instructor</Link>
                    <Link href="#why-join-us" className="text-sm font-bold text-light-foreground/60 hover:text-primary-purple transition-colors">Why Join Us</Link>
                </div>

                <Link href="/portal" className="bg-primary-purple text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-primary-purple/20 hover:scale-105 transition-transform active:scale-95">
                    Join Us
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 px-8 max-w-7xl mx-auto overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
                {/* Hero Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-24 -left-24 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px]"></div>
                    <div className="absolute -top-24 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px]"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-purple/10 text-primary-purple rounded-full text-xs font-bold uppercase tracking-widest">
                            <Rocket size={14} />
                            We are hiring
                        </div>

                        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 font-heading leading-tight italic">
                            Join the <br />
                            <span className="text-primary-purple">MSSquare</span> Team
                        </h1>

                        <p className="text-lg font-medium text-gray-600 max-w-lg leading-relaxed">
                            Shape the future of innovation with a global team dedicated to excellence, creative freedom, and sustainable growth. We're building tools for the next generation.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button
                                onClick={scrollToForm}
                                className="w-full sm:w-auto bg-primary-purple text-white px-10 py-5 rounded-3xl font-bold hover:shadow-2xl hover:shadow-primary-purple/40 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-primary-purple/20"
                            >
                                Browse Open Roles
                            </button>
                            <button className="w-full sm:w-auto bg-white border border-gray-100 text-gray-900 px-10 py-5 rounded-3xl font-bold hover:bg-gray-50 transition-all">
                                Our Story
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-1000">
                        <div className="w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative group bg-white border border-slate-100/50">
                            <img
                                src="/assets/careers.png"
                                alt="Careers at MSSquare"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
                    </div>
                </div>
            </section>

            {/* Why Join Us Section */}
            <section id="why-join-us" className="py-16 px-8 bg-slate-50/30 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center space-y-16">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl font-extrabold text-[#1e293b] font-heading mb-6">Why Join Us</h2>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Empowering our people to lead the digital revolution.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Innovation-led",
                                description: "We push the boundaries of what's possible in tech and learning.",
                                icon: Lightbulb,
                                image: "/assets/careers/INNOVATION-LED.jpg",
                                color: "text-violet-500",
                                bg: "bg-violet-50"
                            },
                            {
                                title: "Continuous Learning",
                                description: "Regular workshops, mentors, and professional growth budgets for all.",
                                icon: GraduationCap,
                                image: "/assets/careers/CONTINUOUS LEARNING.jpg",
                                color: "text-blue-500",
                                bg: "bg-blue-50"
                            },
                            {
                                title: "Work-Life Balance",
                                description: "Flexible hours and remote-first culture to keep you refreshed.",
                                icon: Scale,
                                image: "/assets/careers/WORK-LIFE BALANCE.jpg",
                                color: "text-emerald-500",
                                bg: "bg-emerald-50"
                            },
                            {
                                title: "Impactful Projects",
                                description: "Build solutions that directly touch and improve millions of lives.",
                                icon: Globe,
                                image: "/assets/careers/IMPACTFUL PROJECTS.jpg",
                                color: "text-indigo-500",
                                bg: "bg-indigo-50"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 flex flex-col">
                                <div className="relative aspect-[16/11] overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        alt={item.title} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                                    <div className={`absolute top-4 left-4 p-3 ${item.bg} rounded-2xl border border-white/50 shadow-sm transition-transform group-hover:scale-110`}>
                                        <item.icon size={20} className={item.color} />
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow text-left">
                                    <h3 className="font-extrabold text-lg text-gray-900 mb-3 font-heading group-hover:text-[#7C3AED] transition-colors uppercase tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-16 px-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900 font-heading mb-4 italic">Open Positions</h2>
                            <p className="text-gray-500 font-medium">Join 150+ talented individuals across the globe.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {["All Roles", "Engineering", "Design"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${activeFilter === filter
                                            ? "bg-primary-purple text-white shadow-xl shadow-primary-purple/20"
                                            : "bg-white text-light-foreground/60 border border-light-border hover:border-light-border/50"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.filter(job => activeFilter === "All Roles" || job.department.includes(activeFilter)).map((job, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white border border-gray-50 rounded-[2rem] hover:shadow-xl hover:border-primary-purple/10 transition-all duration-300 group">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-purple transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={14} className="text-primary-purple" />
                                            {job.department}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-primary-purple" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-primary-purple" />
                                            {job.type}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={scrollToForm}
                                    className="mt-6 md:mt-0 bg-primary-purple/10 text-primary-purple px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary-purple hover:text-white transition-all active:scale-95"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Form Section */}
            <section ref={formRef} className="py-20 px-8 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-100 text-gray-900 overflow-hidden relative">
                {/* Background patterns */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200/50 rounded-full blur-[100px]"></div>
                    <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200/50 rounded-full blur-[100px]"></div>
                </div>
                
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80 rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-black/5 relative overflow-hidden">
                    {/* Banner Decoration */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-primary-purple to-purple-500 shadow-sm shadow-primary-purple/20"></div>

                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-extrabold text-gray-900 font-heading italic">Start Your Journey</h2>
                        <p className="text-gray-600 font-medium">Fill out the form below and our recruitment team will reach out within 48 hours.</p>
                    </div>

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
                                    className="w-full bg-gray-100/50 border border-gray-200/20 focus:border-primary-purple/30 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400 shadow-sm shadow-black/[0.02]"
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
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Applying for Position</label>
                                <div className="relative">
                                    <select 
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option disabled>Select a role</option>
                                        <option>Senior React Developer</option>
                                        <option>UI/UX Designer</option>
                                        <option>Growth Marketing Manager</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                            <input
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Resume / CV</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-purple-100 bg-primary-purple/5 rounded-3xl p-12 text-center group hover:border-primary-purple/30 hover:bg-primary-purple/10 transition-all cursor-pointer"
                            >
                                <Upload size={32} className="mx-auto text-primary-purple mb-4 group-hover:-translate-y-1 transition-transform" />
                                <p className="text-sm font-bold text-gray-900">
                                    {resumeFile ? resumeFile.name : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">PDF, DOCX up to 10MB</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    accept=".pdf,.doc,.docx"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest ml-1">Cover Letter</label>
                            <textarea
                                rows={5}
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all resize-none placeholder:text-gray-400 leading-relaxed"
                                placeholder="Tell us why you're a great fit..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary-purple text-white py-6 rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary-purple/30 hover:shadow-primary-purple/50 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : showSuccess ? (
                                <>
                                    <CheckCircle2 size={24} />
                                    Application Submitted!
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
            </section>

            <Footer />
        </div>
    );
}
