"use client";

import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  {
    title: "AI Content Platform",
    category: "SaaS Product",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mentor Booking System",
    category: "Internal Tool",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "EdTech Learning Platform",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Startup MVP Development",
    category: "Consulting",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 bg-secondary-background border-t border-white/5 relative z-10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Featured <span className="text-primary-accent">Projects</span>
            </h2>
            <p className="text-muted text-lg max-w-xl">
              A glimpse into the diverse digital experiences built by our teams and students.
            </p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold whitespace-nowrap"
          >
            View All Work
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col gap-4"
            >
              <div 
                className="w-full aspect-square rounded-2xl bg-secondary-background border border-white/10 overflow-hidden relative"
              >
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Image Placeholder Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 border border-white/20 rounded-full bg-black/50">View Details</span>
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted font-semibold">{project.category}</span>
                <h3 className="text-lg font-bold text-foreground mt-1 group-hover:text-primary-accent transition-colors">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
