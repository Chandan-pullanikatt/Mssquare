"use client";

import { useReveal } from "@/hooks/useReveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Audience() {
  const revealRef = useReveal();

  return (
    <section id="what-we-do" className="bg-white py-[120px] px-[5%] relative border-b border-gray-100" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <div className="rev inline-flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#7C3AED] mb-4">
          <span className="w-5 h-[1px] bg-[#7C3AED]"></span>
          What We Do
        </div>
        <h2 className="rev text-[clamp(2.5rem,5vw,3.8rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-5 font-heading text-gray-900">
          Two Worlds. <span className="text-[#7C3AED]">One Roof.</span>
        </h2>
        <p className="rev text-gray-500 leading-[1.75] font-medium text-[1.05rem] max-w-[540px] mx-auto">
          Whether you're learning to build or paying someone to build for you — MSsquare is your partner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl">

        {/* Left Column - Students */}
        <div className="rev rev-d1 relative bg-white p-10 lg:p-14 overflow-hidden group flex flex-col">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.04)_0%,transparent_60%)] pointer-events-none"></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-[1.6rem] mb-10 shadow-inner">
              🎓
            </div>

            <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#7C3AED] uppercase mb-4">
              For Students
            </div>
            <h3 className="text-[2.2rem] font-extrabold tracking-[-0.02em] text-gray-900 font-heading leading-tight mb-2">
              Not in Tech yet?<br />
              <span className="text-[#7C3AED]">We'll get you in.</span>
            </h3>
            <p className="text-gray-500 text-[0.95rem] leading-[1.7] mb-10 font-medium pr-4">
              Industry-aligned bootcamps and real internships that take you from zero to job-ready. Every concept is taught through live projects — not slides.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-violet-50 hover:border-violet-100 transition-all duration-300">
                <div className="text-[1.2rem] mt-1">📚</div>
                <div>
                  <div className="font-bold text-gray-900 text-[0.95rem] mb-1">Training Programs</div>
                  <div className="text-gray-500 text-[0.85rem] font-medium">Bootcamps across Web, Mobile, AI & more</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-violet-50 hover:border-violet-100 transition-all duration-300">
                <div className="text-[1.2rem] mt-1">💼</div>
                <div>
                  <div className="font-bold text-gray-900 text-[0.95rem] mb-1">Internship Programs</div>
                  <div className="text-gray-500 text-[0.85rem] font-medium">Real projects, real mentorship, real experience</div>
                </div>
              </div>
            </div>

            {/* Tags removed for cleaner look or transformed */}
            <div className="flex flex-wrap gap-2 mb-10">
              {['Web Dev', 'Mobile', 'UI/UX Design', 'Data & ML', 'DevOps', '6-12 Weeks', 'Mentored', 'Certificate'].map((tag, i) => (
                <span key={i} className="text-[0.7rem] text-[#7C3AED] font-bold bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100/50">
                  {tag}
                </span>
              ))}
            </div>

            <Link href="/portal" className="mt-auto inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-7 py-4 rounded-2xl text-[0.95rem] font-bold tracking-wide transition-all duration-300 font-heading shadow-lg shadow-violet-200">
              Apply for Cohort
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Right Column - Businesses - Using /web-services link */}
        <div className="rev rev-d2 relative bg-[#F5F5F7] p-10 lg:p-14 overflow-hidden border-t md:border-t-0 md:border-l border-gray-100 group flex flex-col">
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.06)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[1.6rem] mb-10 shadow-sm">
              🏢
            </div>

            <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#7C3AED] uppercase mb-4">
              For Businesses
            </div>
            <h3 className="text-[2.2rem] font-extrabold tracking-[-0.02em] text-gray-900 font-heading leading-tight mb-2">
              Have an idea?<br />
              <span className="text-[#7C3AED]">We'll build it.</span>
            </h3>
            <p className="text-gray-500 text-[0.95rem] leading-[1.7] mb-10 font-medium pr-4">
              Early-stage startups and SMEs trust MSsquare to architect, build, and scale their digital products. From strategy to shipping — we handle the full journey.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:bg-violet-50 hover:border-violet-100 transition-all duration-300">
                <div className="text-[1.2rem] mt-1">🚀</div>
                <div>
                  <div className="font-bold text-gray-900 text-[0.95rem] mb-1">Product Engineering</div>
                  <div className="text-gray-500 text-[0.85rem] font-medium">End-to-end product builds, MVP to scale</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:bg-violet-50 hover:border-violet-100 transition-all duration-300">
                <div className="text-[1.2rem] mt-1">🧠</div>
                <div>
                  <div className="font-bold text-gray-900 text-[0.95rem] mb-1">AI Implementation</div>
                  <div className="text-gray-500 text-[0.85rem] font-medium">Integrate intelligence into your product</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {['MVP Build', 'Product Strategy', 'Team Scaling', 'CTO-as-a-Service'].map((tag, i) => (
                <span key={i} className="text-[0.7rem] text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full font-bold">
                  {tag}
                </span>
              ))}
            </div>

            <Link href="/web-services" className="mt-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-7 py-4 rounded-2xl text-[0.95rem] font-bold tracking-wide transition-all duration-300 font-heading">
              Launch Your Product
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
