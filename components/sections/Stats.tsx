"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

const stats = [
  { id: 1, name: "Students Trained", value: "3000+" },
  { id: 2, name: "Industry Projects", value: "20+" },
  { id: 3, name: "Expert Mentors", value: "50+" },
  { id: 4, name: "Startup Collaborations", value: "10+" },
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Stats() {
  return (
    <section className="py-20 bg-white relative z-10 border-b border-gray-100">
      <Container>
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { id: 1, name: "Developers Trained", value: "500+" },
            { id: 2, name: "Startups Supported", value: "40+" },
            { id: 3, name: "Placement Support", value: "100%" },
            { id: 4, name: "Learning Tracks", value: "3" },
          ].map((stat) => (
            <motion.div 
              key={stat.id} 
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-center"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-[0.1em]">
                {stat.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
