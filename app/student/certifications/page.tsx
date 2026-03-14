"use client";

import {
    Award,
    Download,
    Share2,
    CheckCircle2,
    Search,
    Filter,
    ExternalLink,
    ShieldCheck,
    Trophy
} from "lucide-react";

const certifications = [
    {
        title: "Advanced React Patterns & Architecture",
        issued: "Dec 12, 2023",
        expiry: "No Expiry",
        id: "CERT-MSS-7281",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2670&auto=format&fit=crop",
        color: "text-[#8b5cf6]",
        bg: "bg-purple-50",
        skills: ["React 19", "Software Architecture", "Performance Optimization"]
    },
    {
        title: "UI/UX Design Mastership",
        issued: "Sep 25, 2023",
        expiry: "No Expiry",
        id: "CERT-MSS-9912",
        image: "https://images.unsplash.com/photo-1541462608141-ad4d4f9d3fb9?q=80&w=2670&auto=format&fit=crop",
        color: "text-blue-500",
        bg: "bg-blue-50",
        skills: ["Figma", "User Research", "Wireframing"]
    },
    {
        title: "Data Structures & Algorithms in JS",
        issued: "Jun 10, 2023",
        expiry: "No Expiry",
        id: "CERT-MSS-1120",
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2574&auto=format&fit=crop",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        skills: ["Problem Solving", "Big O Notation", "Algorithms"]
    }
];

export default function CertificationsPage() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold font-heading text-gray-900 mb-2">My Certifications</h1>
                    <p className="text-gray-500 font-medium">Verify and download your official career milestones.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earned</div>
                        <div className="text-xl font-extrabold text-gray-900">4 Certificates</div>
                    </div>
                </div>
            </div>

            {/* Certification Grid */}
            <div className="grid grid-cols-1 gap-8">
                {certifications.map((cert, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500 hover:border-[#8b5cf6]/20">

                        {/* Left Image Section */}
                        <div className="md:w-[200px] h-[160px] md:h-auto bg-gray-900 relative shrink-0">
                            <img src={cert.image} alt={cert.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>

                        {/* Right Content Section */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest mb-2 ${cert.bg} ${cert.color}`}>
                                        Verified
                                    </div>
                                    <h2 className="text-xl font-extrabold font-heading text-gray-900 group-hover:text-[#8b5cf6] transition-colors leading-tight">
                                        {cert.title}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#8b5cf6] rounded-xl transition-all">
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-50">
                                <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Issued</div>
                                    <div className="text-[12px] font-bold text-gray-700">{cert.issued}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">ID</div>
                                    <div className="text-[12px] font-bold text-gray-600 font-mono">{cert.id}</div>
                                </div>
                            </div>

                            <div className="mt-auto flex items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {cert.skills.slice(0, 2).map((skill, j) => (
                                        <span key={j} className="text-[9px] font-bold text-[#8b5cf6] bg-[#f5f3ff] px-2 py-0.5 rounded-full border border-[#8b5cf6]/10">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <button className="text-[12px] font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors">
                                    Verify
                                    <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
