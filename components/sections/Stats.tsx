"use client";

import { useEffect, useState, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { motion, useInView, animate } from "framer-motion";
import { websiteApi } from "@/lib/api/website";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      // Better regex to separate prefix, numeric part, and suffix
      // Captures anything NOT a digit/comma/dot at start, then the number, then the rest
      const match = value.match(/^([^\d,.]*)([\d,.]+)([^\d,.]*)$/);
      
      if (!match) {
        ref.current.textContent = value;
        return;
      }

      const prefix = match[1];
      const numericPart = match[2];
      const suffix = match[3];
      const endValue = parseFloat(numericPart.replace(/,/g, ""));

      const controls = animate(0, endValue, {
        duration: 1,
        ease: "easeOut",
        onUpdate(latest) {
          if (ref.current) {
            const formatted = Math.floor(latest).toLocaleString();
            ref.current.textContent = `${prefix}${formatted}${suffix}`;
          }
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>0</span>;
}

export function Stats() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("landing_stats");
        if (data?.content_json) {
          const statsArray = Array.isArray(data.content_json) 
            ? data.content_json 
            : (data.content_json.stats || []);
          
          // Apply requested overrides: Change 1200 to 1,000+ and ensure no prefix plus
          const finalStats = statsArray.map((s: any) => {
            const label = s.label || s.name || "";
            if (label.toLowerCase().includes("active students")) {
              return { ...s, value: "1,000+" };
            }
            return s;
          });
          setStats(finalStats);
        } else {
          // Updated fallbacks based on user request
          setStats([
            { id: 1, label: "Active Students", value: "1,000+" },
            { id: 2, label: "Courses Offered", value: "45+" },
            { id: 3, label: "Successful Placements", value: "95%" },
            { id: 4, label: "Years of Excellence", value: "5+" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch stats content", err);
      }
    };
    fetchContent();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-12 bg-white relative z-10 border-b border-gray-100">
      <Container>
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-center"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
                <CountUp value={stat.value} />
              </span>
              <span className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-[0.1em]">
                {stat.label || stat.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
