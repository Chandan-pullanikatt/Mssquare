"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { COLORS } from "@/lib/design-tokens";
import { websiteApi } from "@/lib/api/website";

export function Hero() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing_hero");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch hero content", err);
      }
    };
    fetchContent();
  }, []);

  const heroData = content || {
    badge: "Next cohort starts soon",
    title_line1: "Build. Learn. Launch.",
    title_line2: "With MSSquare.",
    subtitle: "We train developers and build real-world products for startups and businesses.",
    cta_primary: "Apply Now (Student)",
    cta_secondary: "Browse All Tracks",
  };

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center px-[5%] overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/b1.png" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pt-[100px] pb-12 gap-12">
        
        {/* Main Content Area */}
        <div className="flex flex-col items-center text-center max-w-3xl">
          {/* Badge — fup at 0.2s */}
          <div className="anim-fup d-02 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[0.7rem] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-violet-400 rounded-full anim-blink"></span>
            {heroData.badge}
          </div>

          {/* Title — word-by-word wrise */}
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 font-heading text-white">
            <span className="anim-wrise d-035 block">{heroData.title_line1}</span>
            <span className="anim-wrise d-05 block text-violet-400">{heroData.title_line2}</span>
          </h1>

          {/* Subtitle — fup at 0.9s */}
          <p className="anim-fup d-09 max-w-[640px] text-slate-200 text-[1.25rem] font-medium leading-[1.6] mb-10">
            {heroData.subtitle}
          </p>

          {/* Buttons — fup at 1.0s */}
          <div className="anim-fup d-10 flex gap-5 flex-wrap justify-center">
            <Link
              href="/auth/register"
              className="hover-btn inline-flex items-center justify-center bg-violet-600 text-white px-8 py-4 rounded-xl text-[1rem] font-bold tracking-wide shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all duration-300 font-heading hover:scale-105"
            >
              {heroData.cta_primary}
            </Link>
            <Link 
              href="/courses"
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all flex items-center gap-2 group"
            >
              {heroData.cta_secondary}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="anim-fup d-17 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-[22px] h-[34px] border-2 border-white/20 rounded-full flex items-start justify-center pt-[6px]">
          <div className="w-[3px] h-[7px] bg-violet-400 rounded-full anim-sdown"></div>
        </div>
      </div>
    </section>
  );
}
