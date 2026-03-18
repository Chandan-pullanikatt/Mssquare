"use client";

import { useReveal } from "@/hooks/useReveal";
import { useEffect, useState } from "react";
import { websiteApi } from "@/lib/api/website";
import { Globe, Cpu, Zap, PenTool } from "lucide-react";

export function Solutions() {
  const revealRef = useReveal();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing_solutions");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch solutions content", err);
      }
    };
    fetchContent();
  }, []);

  const data = content || {
    badge: "Our Services",
    title: "Scalable solutions for modern businesses.",
    description: "We help startups and companies design, build, and launch digital products.",
    items: [
        { title: "Website Dev", desc: "High-performance marketing sites that convert visitors into loyal customers." },
        { title: "Web App Dev", desc: "Robust, full-stack applications built with the latest technologies for scale." },
        { title: "Startup MVP Dev", desc: "Go from idea to product in weeks, not months. Optimized for speed and agility." },
        { title: "Product Consulting", desc: "Strategy, UX design, and technical roadmapping to ensure your product succeeds." }
    ]
  };

  const icons = [<Globe size={24} />, <Cpu size={24} />, <Zap size={24} />, <PenTool size={24} />];

  return (
    <section id="solutions" className="bg-[#F5F5F7] py-20 px-[5%] relative border-b border-gray-100" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="mb-16 max-w-4xl mx-auto">
        <div className="rev inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.14em] uppercase text-[#7C3AED] mb-4">
          {data.badge}
        </div>
        <h2 className="rev text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-6 font-heading text-gray-900">
          {data.title}
        </h2>
        <p className="rev text-gray-500 text-[1.1rem] leading-[1.6] font-medium max-w-[620px]">
          {data.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {(data.items || []).map((solution: any, i: number) => (
          <div key={i} className={`rev rev-d${i + 1} group bg-white border border-gray-100 rounded-3xl p-10 relative overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-[#7C3AED]/5 hover:border-[#7C3AED]/10 hover:-translate-y-1`}>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 bg-white shadow-sm border border-gray-100 transition-transform group-hover:scale-105`}>
              <div className="text-[#7C3AED]">
                {icons[i] || <Zap size={24} />}
              </div>
            </div>

            <h3 className="text-[1.3rem] font-extrabold mb-4 tracking-[-0.02em] text-gray-900 font-heading">{solution.title}</h3>

            <p className="text-gray-500 text-[0.92rem] leading-[1.6] font-medium">
              {solution.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
