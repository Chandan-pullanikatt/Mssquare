"use client";

import { useReveal } from "@/hooks/useReveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const programs = [
  {
    image: "/assets/course-fullstack.png",
    badge: "POPULAR",
    title: "Advanced Fullstack Mastery",
    desc: "Next.js, TypeScript, and AWS Serverless architecture.",
    meta: "12 WEEKS · INTENSIVE",
    highlight: true,
  },
  {
    image: "/assets/course-design.png",
    badge: null,
    title: "UX & Product Design",
    desc: "Figma, Design Systems, and Behavioral Psychology.",
    meta: "8 WEEKS · PRACTICAL",
    highlight: false,
  },
  {
    image: "/assets/course-backend.png",
    badge: null,
    title: "Distributed Systems",
    desc: "Go, Kubernetes, and Scalable Database Design.",
    meta: "10 WEEKS · ENGINEERING",
    highlight: false,
  },
];

export function Programs() {
  const revealRef = useReveal();

  return (
    <section id="courses" className="bg-[#F5F5F7] py-20 px-[5%] relative border-b border-gray-100" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="rev inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] uppercase text-[#7C3AED] mb-4">
            Academy
          </div>
          <h2 className="rev text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-6 font-heading text-gray-900">
            Learn By Building Real Products
          </h2>
          <p className="rev text-gray-500 leading-[1.6] font-medium text-[1.1rem]">
            Ditch the tutorials. Learn production-grade engineering by contributing to live projects used by thousands.
          </p>
        </div>
        <Link 
          href="/courses" 
          className="rev font-bold text-gray-900 underline underline-offset-8 hover:text-[#7C3AED] transition-colors"
        >
          Browse All Tracks
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {programs.map((program, i) => (
          <div
            key={i}
            className={`rev rev-d${i + 1} flex flex-col group cursor-pointer bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500`}
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-gray-100 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#7C3AED]/10 group-hover:-translate-y-1">
              <img 
                src={program.image} 
                alt={program.title}
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />
              {program.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[0.65rem] font-bold tracking-widest text-gray-900 shadow-sm rounded-md uppercase">
                    {program.badge}
                  </span>
                </div>
              )}
            </div>

            <h3 className="text-[1.25rem] font-extrabold mb-2 tracking-[-0.02em] text-gray-900 font-heading group-hover:text-[#7C3AED] transition-colors">
              {program.title}
            </h3>

            <p className="text-gray-400 text-[0.92rem] leading-[1.5] font-medium mb-4">
              {program.desc}
            </p>

            <div className="flex items-center gap-3 text-[0.7rem] font-bold tracking-widest text-gray-900 uppercase">
              {program.meta.split(' · ').map((m, idx) => (
                <span key={idx} className="flex items-center gap-3">
                  {m}
                  {idx === 0 && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
