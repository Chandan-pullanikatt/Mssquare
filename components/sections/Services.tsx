"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Briefcase, Rocket } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { websiteApi } from "@/lib/api/website";

export function Services() {
  const revealRef = useReveal();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultOfferings = [
    {
      icon: <GraduationCap size={24} className="text-primary-blue" />,
      title: "Training Programs",
      desc: "Industry-aligned bootcamps and courses that take you from fundamentals to job-ready. Learn by building — every concept is taught through live projects.",
      tags: ["Web Dev", "Mobile", "UI/UX Design", "Data & ML", "DevOps"],
      accentColor: "bg-primary-blue",
      iconBg: "bg-primary-blue/10",
      iconBorder: "border-primary-blue/20"
    },
    {
      icon: <Briefcase size={24} className="text-primary-cyan" />,
      title: "Internship Programs",
      desc: "Work on real client projects under senior mentorship. Our internships are structured for maximum skill exposure and portfolio building — not coffee runs.",
      tags: ["6–12 Weeks", "Mentored", "Certificate", "Live Projects"],
      accentColor: "bg-primary-cyan",
      iconBg: "bg-primary-cyan/10",
      iconBorder: "border-primary-cyan/20"
    },
    {
      icon: <Rocket size={24} className="text-primary-green" />,
      title: "Tech Consultancy",
      desc: "Early-stage startups and SMEs trust MSsquare to architect, build, and scale their digital products. Strategy to shipping — we handle the full journey.",
      tags: ["MVP Build", "Tech Audit", "Product Strategy", "Team Scaling"],
      accentColor: "bg-primary-green",
      iconBg: "bg-primary-green/10",
      iconBorder: "border-primary-green/20"
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await websiteApi.getSection("landing_solutions");
        if (data?.content_json?.items) {
          const mappedServices = data.content_json.items.map((item: any, i: number) => {
            const icons = [<GraduationCap size={24} key="1" />, <Briefcase size={24} key="2" />, <Rocket size={24} key="3" />];
            const colors = ["primary-blue", "primary-cyan", "primary-green"];
            
            return {
              ...item,
              icon: item.image ? (
                <img src={item.image} className="w-6 h-6 object-contain" alt={item.title} />
              ) : (
                <div className={`text-${colors[i % colors.length]}`}>
                  {icons[i % icons.length]}
                </div>
              ),
              desc: item.description,
              tags: item.tags || [],
              accentColor: `bg-${colors[i % colors.length]}`,
              iconBg: `bg-${colors[i % colors.length]}/10`,
              iconBorder: `border-${colors[i % colors.length]}/20`
            };
          });
          setServices(mappedServices);
        } else {
          setServices(defaultOfferings);
        }
      } catch (err) {
        console.error("Failed to fetch landing services", err);
        setServices(defaultOfferings);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayServices = services.length > 0 ? services : defaultOfferings;

  return (
    <section id="offerings" className="bg-surface border-y border-white/5 py-[100px] px-[5%]" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <div className="rev inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-primary-blue mb-4">
          <span className="w-5 h-[1px] bg-primary-blue"></span>
          What We Do
        </div>
        <h2 className="rev text-[clamp(1.9rem,4vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-5 font-heading">
          Three Ways We Accelerate<br />Your Growth
        </h2>
        <p className="rev text-muted leading-[1.75] font-light max-w-[540px] mx-auto">
          Whether you're a student starting out, a developer seeking real experience, or a startup that needs to ship — MSsquare has a track for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/5 border border-white/5 rounded-2xl overflow-hidden max-w-7xl mx-auto">
        {displayServices.map((offering, i) => (
          <div key={i} className={`rev rev-d${i + 1} group bg-card p-10 relative overflow-hidden transition-colors duration-300 hover:bg-[#161820]`}>
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${offering.accentColor} scale-x-0 origin-left transition-transform duration-[380ms] ease-out group-hover:scale-x-100`}></div>
            
            <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-6 border ${offering.iconBg} ${offering.iconBorder}`}>
              {offering.icon}
            </div>
            
            <h3 className="text-[1.25rem] font-bold mb-3 tracking-[-0.02em] font-heading">{offering.title}</h3>
            
            <p className="text-muted text-[0.92rem] leading-[1.7] font-light mb-6">
              {offering.desc}
            </p>
            
            {offering.tags && offering.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {offering.tags.map((tag: string, j: number) => (
                  <span key={j} className="text-[0.74rem] px-2.5 py-1 rounded bg-white/5 text-muted border border-white/10 tracking-[0.02em]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
