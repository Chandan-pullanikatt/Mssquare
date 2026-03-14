"use client";

import { useReveal } from "@/hooks/useReveal";

export function Marquee() {
  const revealRef = useReveal();

  const technologies = [
    "React", "Node.js", "Python", "AWS", "Flutter",
    "PostgreSQL", "Docker", "TensorFlow"
  ];

  return (
    <section className="py-12 bg-black border-b border-white/5 overflow-hidden" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="rev text-center mb-8">
        <span className="text-[0.75rem] text-muted tracking-[0.2em] font-semibold uppercase">Powered by Modern Tech Stack</span>
      </div>

      <div className="relative flex overflow-x-hidden w-full group">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee flex whitespace-nowrap items-center group-hover:[animation-play-state:paused]">
          {[...technologies, ...technologies, ...technologies].map((tech, i) => (
            <span
              key={i}
              className="mx-8 text-[1.4rem] font-bold font-heading text-white/40 tracking-wide transition-colors duration-300 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
