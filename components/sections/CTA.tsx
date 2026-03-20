"use client";

import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { COLORS } from "@/lib/design-tokens";

import { useEffect, useState } from "react";
import { websiteApi } from "@/lib/api/website";

export function CTA() {
  const revealRef = useReveal();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing_cta");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch cta content", err);
      }
    };
    fetchContent();
  }, []);

  const data = content || {
    badge: "Start Today",
    title_line1: "Ready to build something",
    title_line2: "that matters?",
    description: "Drop your email and we'll match you to the right MSsquare program — training, internship, or consultancy.",
    footer: "Free consultation included. Limited slots available."
  };

  return (
    <>
      <style>{`
        .cta-email-input::placeholder {
          color: #94A3B8;
        }
      `}</style>
      <section id="cta" className="bg-light-background border-t border-light-border text-center py-20 px-[5%] relative overflow-hidden" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_65%)] pointer-events-none rounded-full"></div>

      <div className="relative z-10 max-w-[680px] mx-auto">
        <div className="rev inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.14em] uppercase text-primary-purple mb-[1.5rem] justify-center">
          <span className="w-5 h-[2px] bg-primary-purple"></span>
          {data.badge}
          <span className="w-5 h-[2px] bg-primary-purple"></span>
        </div>

        <h2 className="rev text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[1.05] mb-[1.5rem] font-heading" style={{ color: '#0F172A' }}>
          {data.title_line1}<br />
          <span className="bg-gradient-to-br from-primary-purple to-[#9333EA] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] bg-clip-text font-black">
            {data.title_line2}
          </span>
        </h2>

        <p className="rev text-[1.1rem] leading-[1.75] font-medium mb-12" style={{ color: '#334155' }}>
          {data.description}
        </p>

        <form className="rev flex flex-col sm:flex-row gap-4 max-w-[500px] mx-auto mb-8" onSubmit={(e) => e.preventDefault()}>
          <input
            className="cta-email-input flex-1 bg-white border border-light-border rounded-2xl px-6 py-4 text-[1rem] font-sans outline-none shadow-sm transition-all focus:ring-2 focus:ring-primary-purple/20 focus:border-primary-purple/50"
            style={{ color: '#0F172A' }}
            type="email"
            placeholder="your@email.com"
            required
          />
          <button
            type="submit"
            className="hover-btn inline-flex items-center justify-center gap-2 bg-primary-purple hover:bg-primary-purpleDark text-white px-8 py-4 rounded-2xl text-[1rem] font-bold tracking-[0.01em] transition-all duration-300 font-heading whitespace-nowrap shadow-glow-purple"
          >
            Get Started
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </form>

        <p className="rev text-[0.85rem] font-bold" style={{ color: '#94A3B8' }}>
          Free consultation included. Limited slots available.
        </p>
      </div>
    </section>
    </>
  );
}
