"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "AI",
  "PostgreSQL",
  "Supabase",
  "AWS",
];

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
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function TechStack() {
  return (
    <section className="py-24 bg-secondary-background border-y border-white/5 relative z-10 overflow-hidden">
      <Container>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Powered by Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Technology</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            We use the best tools in the industry to build scalable, fast, and secure products.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {technologies.map((tech, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)" }}
              className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center min-w-[140px] transition-all cursor-default"
            >
              <span className="text-lg font-bold text-foreground/80 lowercase tracking-wider">{tech}</span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
