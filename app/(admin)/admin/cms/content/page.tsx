"use client";

import { Globe, Layout, Info, HelpCircle, Shield, FileText, Users } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: "landing",
    name: "Landing Page",
    description: "Hero section, features, CTA, and stats",
    icon: Layout,
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "/admin/cms/content/landing"
  },
  {
    id: "about",
    name: "About Us",
    description: "Company mission, team, and description",
    icon: Info,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    href: "/admin/cms/content/about"
  },
  {
    id: "faq",
    name: "FAQ Management",
    description: "Frequently asked questions and answers",
    icon: HelpCircle,
    color: "text-orange-600",
    bg: "bg-orange-50",
    href: "/admin/cms/faq-legal"
  },
  {
    id: "legal",
    name: "Legal Pages",
    description: "Privacy policy, terms, and refund policy",
    icon: Shield,
    color: "text-rose-600",
    bg: "bg-rose-50",
    href: "/admin/cms/faq-legal"
  },
  {
    id: "careers",
    name: "Careers Page",
    description: "Job openings, hero text, and benefits",
    icon: FileText,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    href: "/admin/cms/content/careers"
  },
  {
    id: "webservices",
    name: "Web Services Page",
    description: "Services, tech stack, and showcase",
    icon: Globe,
    color: "text-violet-600",
    bg: "bg-violet-50",
    href: "/admin/cms/content/webservices"
  },
  {
    id: "become-instructor",
    name: "Become Instructor",
    description: "Join us section and instructor hero",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    href: "/admin/cms/content/become-instructor"
  }
];

export default function ContentManagement() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Website Content</h1>
        <p className="text-gray-500 font-medium">Manage all dynamic sections of your website without touching code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="group bg-white border border-gray-100 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all"
          >
            <div className={`w-14 h-14 rounded-2xl ${section.bg} ${section.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-all`}>
              <section.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{section.name}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {section.description}
            </p>
            <div className="flex items-center gap-2 text-[#8b5cf6] font-bold text-sm">
              <span>Edit Section</span>
              <Globe size={16} className="group-hover:rotate-12 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

