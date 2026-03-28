"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";
import { websiteApi } from "@/lib/api/website";

export function ProductsBuilt() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing_products");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch products content", err);
      }
    };
    fetchContent();
  }, []);

  const defaultData = {
    badge: "Portfolio",
    title: "Products We've Built",
    description: "We build real products while training developers. From ed-tech to e-commerce, we turn ideas into scalable platforms.",
    items: [
        {
            title: "Our Home Tuition",
            headline: "Connecting students with expert tutors.",
            desc: "A comprehensive ed-tech platform featuring real-time booking, progress tracking, and secure payments.",
            link: "https://our-home-tuition.vercel.app/",
            image: "/assets/projects/home-tuition-v2.png"
        },
        {
            title: "SwiftShop",
            headline: "High-end fashion e-commerce platform.",
            desc: "A high-performance luxury marketplace with real-time inventory management and seamless checkout flows.",
            link: "#",
            image: "/assets/projects/cloth-shop.png"
        },
        {
            title: "Examineer",
            headline: "Secure & scalable examination portal.",
            desc: "A robust testing platform with proctoring for large-scale assessments.",
            link: "#",
            image: "/assets/projects/exam-lms.png"
        }
    ]
  };

  const data = content || defaultData;
  const items = data.items || defaultData.items;

  return (
    <section id="portfolio" className="py-12 bg-white relative z-10">
      <Container>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.14em] uppercase text-[#7C3AED] mb-4 justify-center">
            <span className="w-5 h-[2px] bg-[#7C3AED]"></span>
            {data.badge}
            <span className="w-5 h-[2px] bg-[#7C3AED]"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 font-heading">{data.title}</h2>
          <p className="max-w-[600px] text-gray-500 font-medium">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((project: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-[#F5F5F7] rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#7C3AED]/10 transition-all duration-500 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <img 
                  src={`${project.image}?v=${Date.now()}`} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center text-white text-[0.7rem] font-bold">
                    {project.title.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{project.title}</h3>
                </div>

                <h3 className="text-[1.4rem] font-extrabold mb-3 tracking-[-0.02em] text-gray-900 font-heading leading-tight group-hover:text-[#7C3AED] transition-colors">
                  {project.headline}
                </h3>

                <p className="text-gray-500 text-[0.92rem] leading-[1.6] font-medium mb-6">
                  {project.desc}
                </p>

                <div className="mt-auto pt-4">
                  <Link 
                    href={project.link} 
                    target="_blank"
                    className="inline-flex items-center gap-2 text-[#7C3AED] font-bold hover:gap-3 transition-all underline underline-offset-4 text-sm"
                  >
                    View Project <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
