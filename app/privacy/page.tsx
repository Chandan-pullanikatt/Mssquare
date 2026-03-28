"use client";

import Link from "next/link";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";

import { useState, useEffect } from "react";
import { websiteApi } from "@/lib/api/website";

export default function PrivacyPolicyPage() {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await websiteApi.getSection('privacy_policy');
                if (data) {
                    setContent(data.content_json);
                }
            } catch (error) {
                console.error('Error fetching privacy policy:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
            </div>
        );
    }

    if (!content) return null;

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
                    <div className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-widest mb-3">Legal Documentation</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-4">
                        {content.title}
                    </h1>
                    <p className="text-slate-600 font-medium text-lg">
                        Last updated: {content.last_updated || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Content Formatting */}
                <div className="prose prose-lg prose-slate max-w-none text-slate-900
          prose-headings:font-extrabold prose-headings:font-heading prose-headings:text-slate-900 prose-headings:tracking-tight 
          prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-12
          prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[#8b5cf6] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-li:text-slate-700 prose-li:marker:text-[#8b5cf6]
          prose-strong:text-slate-900 prose-strong:font-bold"
                >
                    {content.sections?.map((section: any, index: number) => (
                        <div key={index}>
                            <h2>{section.heading}</h2>
                            <p>{section.content}</p>
                            {section.list && (
                                <ul>
                                    {section.list.map((item: string, i: number) => {
                                        const [bold, ...rest] = item.split(':');
                                        return (
                                            <li key={i}>
                                                {rest.length > 0 ? (
                                                    <>
                                                        <strong>{bold}:</strong> {rest.join(':')}
                                                    </>
                                                ) : (
                                                    item
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </main>


            {/* Footer */}
            <div className="w-full">
                <Footer />
            </div>

        </div>
    );
}
