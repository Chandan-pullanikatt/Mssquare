"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLORS } from "@/lib/design-tokens";
import { websiteApi } from "@/lib/api/website";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing");
        if (data?.content_json?.hero) {
          setContent(data.content_json.hero);
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
    bg_video: "/assets/v1.webm",
  };

  /* ── Canvas particle background (fallback if .webm fails) ── */
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let showCanvas = false;
    const onError = () => { showCanvas = true; canvas.style.opacity = "1"; };
    video?.addEventListener("error", onError);
    // also show if video has no source ready after 2s
    const fallbackTimer = setTimeout(() => {
      if (video && video.readyState === 0) onError();
    }, 2000);

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 110;
    const CONNECTION_DIST = 95;
    interface Particle { x: number; y: number; vx: number; vy: number; r: number; }
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    let raf: number;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!showCanvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.35)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / CONNECTION_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallbackTimer);
      video?.removeEventListener("error", onError);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center text-center px-[5%] overflow-hidden bg-background">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source src={heroData.bg_video || "/assets/v1.webm"} type="video/webm" />
      </video>

      {/* Canvas particle fallback */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 opacity-0 transition-opacity duration-700"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0B0B0F]/80 z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-[120px] pb-[80px] gap-12">
        
        {/* Left Side: Content */}
        <div className="flex-1 flex flex-col items-start text-left">
          {/* Badge — fup at 0.2s */}
          <div className="anim-fup d-02 inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#7C3AED] rounded-full anim-blink"></span>
            {heroData.badge}
          </div>

          {/* Title — word-by-word wrise */}
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 font-heading text-white">
            <span className="anim-wrise d-035 block">{heroData.title_line1}</span>
            <span className="anim-wrise d-05 block text-[#7C3AED]">{heroData.title_line2}</span>
          </h1>

          {/* Subtitle — fup at 0.9s */}
          <p className="anim-fup d-09 max-w-[540px] text-gray-400 text-[1.15rem] font-medium leading-[1.6] mb-10">
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
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-sm transition-all flex items-center gap-2 group"
                >
                  {heroData.cta_secondary}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
          </div>
        </div>

        {/* Right Side: Mockup Element */}
        <div className="flex-1 w-full max-w-[560px] anim-fup d-12">
          <div className="relative aspect-video rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 shadow-2xl">
            <div className="flex flex-col gap-4 h-full">
              <div className="w-[45%] h-5 bg-[#7C3AED]/20 rounded-full"></div>
              <div className="w-full h-4 bg-white/5 rounded-full"></div>
              <div className="w-[80%] h-4 bg-white/5 rounded-full"></div>
              <div className="mt-auto grid grid-cols-2 gap-4">
                <div className="aspect-video bg-[#7C3AED]/10 rounded-2xl border border-[#7C3AED]/20"></div>
                <div className="aspect-video bg-white/5 rounded-2xl border border-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator — fup at 1.7s */}
      <div className="anim-fup d-17 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-[22px] h-[34px] border-2 border-white/20 rounded-full flex items-start justify-center pt-[6px]">
          <div className="w-[3px] h-[7px] bg-[#7C3AED] rounded-full anim-sdown"></div>
        </div>
      </div>
    </section>
  );
}
