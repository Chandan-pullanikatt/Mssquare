"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText } from "lucide-react";

import { useState, useEffect } from "react";
import { websiteApi } from "@/lib/api/website";

export default function TermsAndConditionsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection('terms_and_conditions');
        if (data) {
          setContent(data.content_json);
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-purple"></div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="w-full bg-white relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-background">
        {/* Decorative elements similar to Hero.tsx */}
        <div className="absolute inset-0 bg-[#0B0B0F]/90 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-purple/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-primary-blue/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded-full mb-6">
              <ShieldCheck size={14} className="text-primary-purple" />
              Legal Documentation
            </div>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 font-heading text-white">
              {content.title?.split('&')[0]} & <span className="text-primary-purple">{content.title?.split('&')[1]?.trim() || 'Conditions'}</span>
            </h1>
            <p className="max-w-[640px] text-gray-400 text-[1.1rem] font-medium leading-[1.6]">
              {content.intro}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[0.85rem] text-muted font-medium">
              <FileText size={16} />
              Last Updated: {content.last_updated}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none 
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-4 prose-h2:border-slate-100
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
            prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3
            prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8
            prose-li:text-slate-600 prose-li:mb-2 prose-li:text-lg
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-a:text-primary-purple prose-a:font-semibold hover:prose-a:underline"
          >
            {content.sections?.map((section: any, index: number) => (
              <div key={index}>
                <h2>{section.heading}</h2>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: section.content?.replace(/\n/g, '<br />') 
                  }} 
                />
              </div>
            ))}
            
            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Have questions about our terms?</h4>
                <p className="text-slate-600">Our legal team is here to help you understand your rights and responsibilities.</p>
              </div>
              <Link 
                href="mailto:support@mssquaretechnologies.com"
                className="whitespace-nowrap bg-primary-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-purpleDark transition-colors flex items-center gap-2"
              >
                Contact Support
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
