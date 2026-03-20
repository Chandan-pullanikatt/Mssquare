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
    <section id="hero" className="relative h-screen flex flex-col items-center text-center px-[5%] overflow-hidden bg-white">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-[120px] pb-12 gap-12">
        
        {/* Left Side: Content */}
        <div className="flex-1 flex flex-col items-start text-left">
          {/* Badge — fup at 0.2s */}
          <div className="anim-fup d-02 inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-[#7C3AED] text-[0.7rem] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#7C3AED] rounded-full anim-blink"></span>
            {heroData.badge}
          </div>

          {/* Title — word-by-word wrise */}
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 font-heading text-slate-900">
            <span className="anim-wrise d-035 block">{heroData.title_line1}</span>
            <span className="anim-wrise d-05 block text-[#7C3AED]">{heroData.title_line2}</span>
          </h1>

          {/* Subtitle — fup at 0.9s */}
          <p className="anim-fup d-09 max-w-[540px] text-slate-600 text-[1.15rem] font-medium leading-[1.6] mb-10">
            {heroData.subtitle}
          </p>

          {/* Buttons — fup at 1.0s */}
          <div className="anim-fup d-10 flex gap-5 flex-wrap">
            <Link
              href="/auth/register"
              className="hover-btn inline-flex items-center justify-center bg-[#7C3AED] text-white px-8 py-4 rounded-xl text-[1rem] font-bold tracking-wide shadow-[0_0_30_px_rgba(124,58,237,0.4)] transition-all duration-300 font-heading"
            >
              {heroData.cta_primary}
            </Link>
                <Link 
                  href="/courses"
                  className="px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-2xl border border-slate-200 transition-all flex items-center gap-2 group"
                >
                  {heroData.cta_secondary}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
          </div>
        </div>

        {/* Right Side: Mockup Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex-1 w-full max-w-[580px] relative mt-12 md:mt-0"
        >
          {/* Main 3D Asset Container */}
          <div className="relative group">
            {/* Ambient Glow behind the asset */}
            <div className="absolute -inset-10 bg-[#7C3AED]/20 rounded-full blur-[80px] opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
            
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotateZ: [0, 1, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              {/* Glassmorphic Frame — Light Theme */}
              <div className="p-2 sm:p-4 rounded-[2rem] sm:rounded-[4rem] bg-white/40 backdrop-blur-xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden group-hover:border-white transition-all duration-500">
                <img 
                  src="/assets/hero/hero-3d-light.png" 
                  alt="Premium Dashboard Interface" 
                  className="w-full h-auto object-contain transform group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>

              {/* Floating Decorative Elements */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-6 w-16 h-16 bg-white/60 backdrop-blur-md border border-white rounded-2xl flex items-center justify-center p-3 shadow-xl z-20"
              >
                <Zap className="text-violet-500" size={24} />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-8 -left-4 w-20 h-20 bg-white/60 backdrop-blur-md border border-white rounded-full flex items-center justify-center p-4 shadow-xl z-20"
              >
                <Sparkles className="text-[#7C3AED]" size={30} />
              </motion.div>
            </motion.div>

            {/* Reflection line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator — fup at 1.7s */}
      <div className="anim-fup d-17 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-[22px] h-[34px] border-2 border-slate-200 rounded-full flex items-start justify-center pt-[6px]">
          <div className="w-[3px] h-[7px] bg-[#7C3AED] rounded-full anim-sdown"></div>
        </div>
      </div>
    </section>
  );
}
