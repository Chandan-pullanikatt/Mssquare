"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { COLORS, SHADOWS } from "@/lib/design-tokens";

interface NavbarProps {
  variant?: "dark" | "light";
}

export function Navbar({ variant = "dark" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For light variant, always use scrolled styling
  const shouldUseLightStyling = variant === "light" || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > (window.innerHeight * 0.8));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-500 border-b ${shouldUseLightStyling
        ? "bg-light-background/95 backdrop-blur-md border-light-border shadow-sm"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="px-[5%] h-[70px] flex items-center justify-between w-full">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className={`text-[1.3rem] font-extrabold tracking-[-0.02em] font-heading transition-colors ${shouldUseLightStyling ? "text-gray-900" : "text-white"}`}>
            MS<span className="text-primary-blue">square</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: "Services", href: "/web-services" },
            { name: "Products", href: "#portfolio" },
            { name: "Courses", href: "/courses" },
            { name: "Testimonials", href: "#testimonials" }
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-colors ${
                shouldUseLightStyling ? "text-[#334155] hover:text-primary-purple" : "text-white/90 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/auth" 
            className={`text-[0.85rem] font-bold tracking-wide transition-colors ${
              shouldUseLightStyling ? "text-[#334155] hover:text-primary-purple" : "text-white/90 hover:text-white"
            }`}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-primary-purple hover:bg-primary-purpleDark text-white font-heading px-6 py-2.5 rounded-xl text-[0.85rem] font-bold transition-all duration-200 shadow-glow-purple"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden transition-colors ${shouldUseLightStyling ? "text-[#334155]" : "text-white/90 hover:text-white"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className={`absolute top-full left-0 right-0 md:hidden backdrop-blur-xl border-b px-[5%] py-6 z-50 transition-all duration-300 ${
          shouldUseLightStyling ? "bg-light-background/95 border-light-border shadow-lg" : "bg-background/95 border-border"
        }`}>
          <nav className="flex flex-col gap-6">
            {[
              { name: "Services", href: "#solutions" },
              { name: "Products", href: "#portfolio" },
              { name: "Testimonials", href: "#testimonials" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg transition-colors uppercase tracking-wider font-bold ${
                  shouldUseLightStyling ? "text-light-foreground/60 hover:text-primary-purple" : "text-light-foreground/50 hover:text-light-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/courses"
              className={`text-lg transition-colors uppercase tracking-wider font-bold ${
                shouldUseLightStyling ? "text-light-foreground/60 hover:text-primary-purple" : "text-light-foreground/50 hover:text-light-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              href="/courses"
              className={`text-lg transition-colors uppercase tracking-wider font-bold ${
                shouldUseLightStyling ? "text-light-foreground/60 hover:text-primary-purple" : "text-light-foreground/50 hover:text-light-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mentorship
            </Link>
            <Link
              href="/courses"
              className={`text-lg transition-colors uppercase tracking-wider font-bold ${
                isScrolled ? "text-light-foreground/60 hover:text-primary-purple" : "text-light-foreground/50 hover:text-light-foreground"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Placements
            </Link>
            <div className={`flex flex-col gap-4 pt-4 border-t ${isScrolled ? "border-light-border" : "border-border"}`}>
              <Link
                href="/auth"
                className={`text-center px-4 py-3 rounded-xl border font-bold transition-colors ${
                  isScrolled ? "text-light-foreground border-light-border" : "text-light-foreground border-border"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary-purple hover:bg-primary-purpleDark text-center text-white px-4 py-3 rounded-xl transition-colors font-heading font-bold shadow-glow-purple"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
