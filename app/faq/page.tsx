"use client";

import Link from "next/link";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How do I attend live classes?",
        answer: "You'll receive your class link on your registered email. Classes are held via Zoom or our LMS platform, and all sessions are recorded for replay."
    },
    {
        question: "What if I don't receive the class link?",
        answer: "Check your spam folder first. If it's not there, contact us at support@mssquaretechnologies.com or call +91 94929 82929."
    },
    {
        question: "How do I access the LMS portal?",
        answer: "You'll get access to the LMS portal in the first week of your starting month. Account creation instructions will be emailed to you by the MSsquare team."
    },
    {
        question: "How do I submit my projects?",
        answer: "You'll receive a project submission email with a direct link. Click the submit button and upload your project as a PDF or Google Drive link."
    },
    {
        question: "Do you offer a refund policy?",
        answer: "Yes. Please refer to our Refund Policy page on the website for full details and conditions."
    },
    {
        question: "Can my startup hire MSsquare for a project?",
        answer: "Absolutely. Our Tech Consultancy arm works with early-stage startups and SMEs. Reach out via our contact form and we'll schedule a free discovery call."
    }
];

export default function FAQPage() {
    const [openIndices, setOpenIndices] = useState<number[]>([]);

    const toggleFAQ = (index: number) => {
        setOpenIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col items-center">

            {/* Header */}
            <header className="w-full border-b border-gray-100 flex items-center justify-between px-6 py-5 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-6">
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
                    <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                    <Link href="/" className="hidden sm:flex text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors items-center gap-1.5">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-4xl px-6 py-16 md:py-24 flex-1">

                {/* Title */}
                <div className="mb-16">
                    <div className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-widest mb-3">Support Center</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-600 font-medium text-lg">
                        Find answers to common questions about our programs, LMS access, and more.
                    </p>
                </div>

                {/* FAQ Content */}
                <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndices.includes(index);

                        return (
                            <div
                                key={index}
                                className={`overflow-hidden transition-all duration-300 bg-gray-50 rounded-2xl ${isOpen ? 'ring-2 ring-violet-200' : 'border border-gray-100'}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                                >
                                    <span className={`text-[1.1rem] font-bold tracking-[-0.01em] font-heading transition-colors ${isOpen ? 'text-[#7C3AED]' : 'text-slate-900'} group-hover:text-[#7C3AED]`}>
                                        {faq.question}
                                    </span>
                                    <div className={`transition-transform duration-300 ml-4 ${isOpen ? 'rotate-180 text-[#7C3AED]' : 'text-slate-400'}`}>
                                        <ChevronDown size={22} />
                                    </div>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6 px-6" : "grid-rows-[0fr] opacity-0 px-6"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-slate-600 text-[1rem] leading-[1.7] font-medium pr-8">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-slate-400 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                        <Link href="mailto:operations@mssquaretechnologies.com" className="inline-flex px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-xl transition-all">
                            Get in Touch
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/10 blur-[80px] -mr-32 -mt-32"></div>
                </div>
            </main>

            {/* Footer */}
            <div className="w-full">
                <Footer />
            </div>

        </div>
    );
}
