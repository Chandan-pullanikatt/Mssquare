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

  const data = content || {
    badge: "Portfolio",
    title: "Products We've Built",
    description: "We build real products while training developers. Here is a platform developed through our consultancy.",
    product: {
        title: "Our Home Tuition",
        headline: "Connecting thousands of students with expert tutors.",
        description: "A comprehensive ed-tech platform featuring real-time booking, progress tracking, and secure payment integration. Built to scale for nationwide operations.",
        features: ["Microservices Architecture", "Real-time Analytics Dashboard"],
        link: "https://our-home-tuition.vercel.app/",
        image: "/assets/home-tuition-product.png"
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-white relative z-10">
      <Container>
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[#7C3AED] font-bold text-xs uppercase tracking-[0.2em] mb-4">{data.badge}</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 font-heading">{data.title}</h2>
          <p className="max-w-[600px] text-gray-500 font-medium">
            {data.description}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-[#F5F5F7] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#7C3AED]/10 transition-all duration-500 border border-gray-100 p-10 md:p-14 lg:p-16 flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center shadow-sm text-white font-bold">
                  {data.product.title.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{data.product.title}</h3>
                </div>
              </div>
              
              <h3 className="text-3xl font-extrabold text-gray-900 leading-[1.2] tracking-[-0.02em]">
                {data.product.headline}
              </h3>

              <p className="text-gray-500 font-medium leading-relaxed text-[1rem]">
                {data.product.description}
              </p>

              <div className="flex flex-col gap-3 pt-2">
                 {data.product.features.map((feat: string, i: number) => (
                   <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                     <div className="w-5 h-5 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                       <ShieldCheck size={12} className="text-[#7C3AED]" />
                     </div>
                     {feat}
                   </div>
                 ))}
              </div>

              <div className="pt-4">
                <Link 
                  href={data.product.link} 
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[#7C3AED] font-bold hover:gap-3 transition-all underline underline-offset-4"
                >
                  Visit Product <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-inner group-hover:-translate-y-2 transition-transform duration-700">
              <img 
                src={data.product.image} 
                alt={data.product.title} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

