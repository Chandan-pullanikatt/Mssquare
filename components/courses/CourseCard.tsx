"use client";

import { motion } from "framer-motion";
import { BookOpen, BarChart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  programType: "Certification" | "Mentorship" | "Placement";
  image: string;
  description: string;
  modules: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  category: string;
}

export default function CourseCard({
  id,
  title,
  programType,
  image,
  description,
  modules,
  level,
  price,
  category,
}: CourseCardProps) {
  const getBadgeColor = () => {
    switch (programType) {
      case "Certification": return "bg-[#7C3AED]";
      case "Mentorship": return "bg-[#3B82F6]";
      case "Placement": return "bg-[#10B981]";
      default: return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col h-full relative"
    >
      {/* Course Image */}
      <Link href={`/courses/${id}`} className="relative h-48 lg:h-52 overflow-hidden block">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Program Badge */}
        <div className={`absolute top-4 left-4 ${getBadgeColor()} text-white text-[0.65rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg z-10`}>
          {programType}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-gray-400 text-xs font-bold mb-3">
          <div className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-gray-300" />
            <span>{modules} Modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart size={14} className="text-gray-300" />
            <span>{level}</span>
          </div>
        </div>

        <Link href={`/courses/${id}`}>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2 font-heading leading-tight group-hover:text-[#7C3AED] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">Starts from</span>
            <span className="text-2xl font-black text-[#7C3AED]">₹{price.toLocaleString()}</span>
          </div>
          
          <Link 
            href={`/courses/${id}`}
            className="w-10 h-10 bg-[#7C3AED]/5 text-[#7C3AED] rounded-full flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300 shadow-sm border border-[#7C3AED]/10"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Hover Gradient Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#7C3AED]/20 rounded-2xl transition-colors pointer-events-none" />
    </motion.div>
  );
}
