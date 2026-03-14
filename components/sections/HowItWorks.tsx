"use client";

import { useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

export function HowItWorks() {
  const revealRef = useReveal();
  const metricsRef = useRef<HTMLDivElement>(null);

  /* Bar animation: paused by default, play when panel is in view */
  useEffect(() => {
    const panel = metricsRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          panel.querySelectorAll(".anim-barg").forEach((bar) => {
            bar.classList.add("playing");
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { num: "01", title: "Apply & Get Matched", desc: "Tell us your goals — we'll place you in the right track. Students join a cohort; startups get a discovery call." },
    { num: "02", title: "Learn Through Real Work", desc: "No theoretical fluff. Every lesson is applied to live projects, giving you a portfolio that actually speaks." },
    { num: "03", title: "Get Mentored & Reviewed", desc: "Senior engineers and product leads review your work, close gaps, and push you beyond your comfort zone." },
    { num: "04", title: "Graduate, Ship, or Scale", desc: "Students graduate placement-ready. Startups ship their product. Everyone leaves with something tangible." }
  ];

  return (
    <section id="how" className="py-[100px] px-[5%] max-w-[1100px] mx-auto" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-12">
        <div>
          <div className="rev inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-primary-blue mb-4">
            <span className="w-5 h-[1px] bg-primary-blue"></span>
            How It Works
          </div>
          <h2 className="rev text-[clamp(1.9rem,4vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-5 font-heading">
            Your Journey at<br />MSsquare
          </h2>
          <p className="rev text-muted leading-[1.75] font-light mb-10">
            A structured path that turns raw potential into real-world impact — for students and startups alike.
          </p>

          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div key={i} className={`rev rev-d${i + 1} flex gap-6 py-7 relative cursor-pointer hover-nudge ${i !== steps.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="font-heading text-[0.75rem] font-bold text-primary-blue tracking-[0.1em] min-w-[32px] pt-[3px]">
                  {step.num}
                </span>
                <div>
                  <h4 className="text-[1.05rem] font-bold mb-1.5 tracking-[-0.01em] font-heading">{step.title}</h4>
                  <p className="text-muted text-[0.9rem] leading-[1.65] font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={metricsRef} className="rev relative bg-card border border-white/5 rounded-[20px] p-10 overflow-hidden group">
          <div className="absolute -top-[80px] -right-[80px] w-[250px] h-[250px] bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_70%)] rounded-full"></div>

          <div className="text-[0.75rem] uppercase tracking-[0.1em] mb-6 font-heading font-medium text-muted">Cohort Outcomes</div>

          {[
            { label: "Job Placement (3 months)", value: "92%", color: "text-primary-green", width: "92%" },
            { label: "Projects Shipped Per Cohort", value: "8+", color: "text-primary-cyan", width: "80%" },
            { label: "Startup MVP Delivery Rate", value: "97%", color: "text-primary-blue", width: "97%" },
            { label: "Student Satisfaction Score", value: "4.9★", color: "text-[#fbbf24]", width: "95%" },
          ].map((metric, i) => (
            <div key={i} className="flex flex-col p-4 bg-white/[0.03] border border-white/5 rounded-xl mb-3 hover-lighten">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[0.85rem] text-muted">{metric.label}</span>
                <span className={`font-heading text-[1.1rem] font-bold ${metric.color}`}>{metric.value}</span>
              </div>
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-blue to-primary-cyan anim-barg" style={{ width: metric.width, animationDelay: `${i * 0.15}s` }}></div>
              </div>
            </div>
          ))}

          <div className="mt-7 pt-6 border-t border-white/5 flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] border-2 border-card flex items-center justify-center text-[0.65rem] font-bold z-30">AK</div>
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#10d98a] to-[#06b6d4] border-2 border-card flex items-center justify-center text-[0.65rem] font-bold z-20">SR</div>
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#a78bfa] to-[#3b82f6] border-2 border-card flex items-center justify-center text-[0.65rem] font-bold z-10">MT</div>
            </div>
            <span className="text-[0.82rem] text-muted">Join <strong className="text-white font-medium">47 active</strong> students this cohort</span>
          </div>
        </div>
      </div>
    </section>
  );
}
