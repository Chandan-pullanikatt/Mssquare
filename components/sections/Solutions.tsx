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

  const defaultData = {
    badge: "Our Services",
    title: "Scalable solutions for modern businesses.",
    description: "We help startups and companies design, build, and launch digital products.",
    items: [
        { 
          title: "Website Dev", 
          desc: "High-performance marketing sites that convert visitors into loyal customers.",
          image: "/assets/services/website-dev.png"
        },
        { 
          title: "Web App Dev", 
          desc: "Robust, full-stack applications built with the latest technologies for scale.",
          image: "/assets/services/webapp-dev.png"
        },
        { 
          title: "Startup MVP Dev", 
          desc: "Go from idea to product in weeks, not months. Optimized for speed and agility.",
          image: "/assets/services/startup-mvp.png"
        },
        { 
          title: "Product Consulting", 
          desc: "Strategy, UX design, and technical roadmapping to ensure your product succeeds.",
          image: "/assets/services/product-consulting.png"
        }
    ]
  };

  const data = content || defaultData;
  
  // Ensure images are present if fetched from DB
  const items = (data.items || []).map((item: any, i: number) => ({
    ...item,
    image: item.image || defaultData.items[i]?.image || "/assets/services/website-dev.png"
  }));

  return (
    <section id="solutions" className="bg-[#F5F5F7] py-12 px-[5%] relative border-b border-gray-100" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="mb-10 max-w-4xl mx-auto">
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
        {items.map((solution: any, i: number) => (
          <div key={i} className={`rev rev-d${i + 1} group bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#7C3AED]/10 hover:border-[#7C3AED]/20 hover:-translate-y-2 flex flex-col`}>
            
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={`${solution.image}?v=${Date.now()}`} 
                alt={solution.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-[1.4rem] font-extrabold mb-3 tracking-[-0.02em] text-gray-900 font-heading group-hover:text-[#7C3AED] transition-colors">
                {solution.title}
              </h3>
              <p className="text-gray-500 text-[0.95rem] leading-[1.6] font-medium">
                {solution.desc}
              </p>
              
              <div className="mt-auto pt-6 flex items-center gap-2 text-[#7C3AED] font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                Learn more <Zap size={14} className="fill-[#7C3AED]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
