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
    Monitor
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { COLORS, SHADOWS } from "@/lib/design-tokens";

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
    const [activeFilter, setActiveFilter] = useState("All Roles");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
        <div className="min-h-screen bg-light-background font-sans selection:bg-primary-purple/30">

            {/* Navigation Layer */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-gray-50 px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-purple rounded-full flex items-center justify-center text-white">
                        <Rocket size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">MSSquare</span>
                </div>

                <div className="hidden md:flex items-center gap-10">
                    {["Culture", "Benefits", "Jobs", "About"].map((item) => (
                        <Link key={item} href="#" className="text-sm font-bold text-light-foreground/60 hover:text-primary-purple transition-colors">{item}</Link>
                    ))}
                </div>

                <Link href="/portal" className="bg-primary-purple text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-primary-purple/20 hover:scale-105 transition-transform active:scale-95">
                    Join Us
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-8 max-w-7xl mx-auto overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-purple/10 text-primary-purple rounded-full text-xs font-bold uppercase tracking-widest">
                            <Rocket size={14} />
                            We are hiring
                        </div>

                        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 font-heading leading-tight italic">
                            Join the <br />
                            <span className="text-primary-purple">MSSquare</span> Team
                        </h1>

                        <p className="text-lg font-medium text-gray-500 max-w-lg leading-relaxed">
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
                        <div className="w-full aspect-[4/3] bg-cyan-100 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <img
                                src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
                                alt="Modern Workspace"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-purple/10 to-transparent"></div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
                    </div>
                </div>
            </section>

            {/* Why Work With Us Section */}
            <section className="py-24 px-8 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto text-center space-y-16">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-extrabold text-gray-900 font-heading mb-6 italic">Why Work With Us</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Our culture is built on transparency, autonomy, and the relentless pursuit of better solutions for our users.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {culture.map((item, i) => (
                            <div key={i} className="group p-10 bg-light-surface border border-light-border rounded-[2.5rem] text-left hover:bg-light-background hover:border-primary-purple/20 hover:shadow-2xl hover:shadow-primary-purple/10 transition-all duration-500">
                                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-24 px-8 bg-light-surface">
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
            <section ref={formRef} className="py-32 px-8 bg-white">
                <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-black/5 relative overflow-hidden">
                    {/* Banner Decoration */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-primary-purple to-purple-500"></div>

                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-extrabold text-gray-900 font-heading italic">Start Your Journey</h2>
                        <p className="text-gray-500 font-medium">Fill out the form below and our recruitment team will reach out within 48 hours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Applying for Position</label>
                                <div className="relative">
                                    <select className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all appearance-none cursor-pointer">
                                        <option>Select a role</option>
                                        <option>Senior React Developer</option>
                                        <option>UI/UX Designer</option>
                                        <option>Growth Marketing Manager</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                            <input
                                type="url"
                                className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Resume / CV</label>
                            <div className="border-2 border-dashed border-purple-100 bg-primary-purple/5 rounded-3xl p-12 text-center group hover:border-primary-purple/30 hover:bg-primary-purple/10 transition-all cursor-pointer">
                                <Upload size={32} className="mx-auto text-primary-purple mb-4 group-hover:-translate-y-1 transition-transform" />
                                <p className="text-sm font-bold text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-2 font-medium">PDF, DOCX up to 10MB</p>
                                <input type="file" className="hidden" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cover Letter</label>
                            <textarea
                                rows={5}
                                className="w-full bg-gray-50/50 border border-transparent focus:border-primary-purple/20 focus:bg-white rounded-[2rem] p-8 text-sm font-bold text-gray-900 outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
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

            {/* Footer */}
            <footer className="py-20 px-8 bg-light-surface">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-purple rounded-full flex items-center justify-center text-white">
                            <Rocket size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">MSSquare</span>
                    </div>

                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
                        © 2024 MSSquare Inc. All rights reserved.
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-gray-400 hover:text-primary-purple transition-colors">
                            <Globe size={20} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-primary-purple transition-colors">
                            <Users size={20} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-primary-purple transition-colors">
                            <Send size={20} />
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
