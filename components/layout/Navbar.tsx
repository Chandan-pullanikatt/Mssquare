"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import { COLORS, SHADOWS } from "@/lib/design-tokens";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserMenu } from "./UserMenu";

interface NavbarProps {
  variant?: "dark" | "light";
}

export function Navbar({ variant = "dark" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const isPublicPage = ["/", "/careers", "/become-instructor"].includes(pathname);

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
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-500 border-b ${
        isLandingPage && !isScrolled && !isMobileMenuOpen
          ? "bg-transparent border-transparent"
          : "bg-white border-gray-100 shadow-sm"
        }`}
    >
      <div className="px-[4%] h-[70px] flex items-center justify-between w-full">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="relative h-12 w-48 transition-transform duration-300 hover:scale-[1.02]">
            <Image 
              src="/assets/nobglogo.png" 
              alt="MSSquare" 
              fill
              priority
              className={`object-contain object-left transition-all duration-500 ${
                (isLandingPage && !isScrolled && !isMobileMenuOpen) ? "" : "brightness-0"
              }`}
              sizes="(max-width: 768px) 192px, 192px"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Services", href: "/web-services" },
            { name: "Courses", href: "/courses" },
            { name: "Careers", href: "/careers" }
          ].filter(item => !(item.name === "Home" && isLandingPage)).map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-colors ${
                (isLandingPage && !isScrolled && !isMobileMenuOpen) ? "text-white/90 hover:text-white" : "text-[#334155] hover:text-primary-purple"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <UserMenu variant={shouldUseLightStyling ? "light" : "dark"} />
            </div>
          ) : (
            <>
              <Link 
                href="/auth" 
                className={`text-[0.85rem] font-bold tracking-wide transition-colors ${
                  (isLandingPage && !isScrolled && !isMobileMenuOpen) ? "text-white/90 hover:text-white" : "text-[#334155] hover:text-primary-purple"
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
            </>
          )}
        </div>


        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden transition-colors ${(isLandingPage && !isScrolled && !isMobileMenuOpen) ? "text-white/90 hover:text-white" : "text-[#334155]"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-white border-b border-gray-100 px-[5%] py-8 z-[100] transition-all duration-300 h-[calc(100vh-70px)] overflow-y-auto shadow-2xl">
          <nav className="flex flex-col gap-6">
            {[
              { name: "Home", href: "/" },
              { name: "Services", href: "/web-services" },
              { name: "Careers", href: "/careers" }
            ].filter(item => !(item.name === "Home" && isLandingPage)).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg transition-colors uppercase tracking-wider font-bold text-[#334155] hover:text-primary-purple"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/courses"
              className="text-lg transition-colors uppercase tracking-wider font-bold text-[#334155] hover:text-primary-purple"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              href="/courses?type=Mentorship"
              className="text-lg transition-colors uppercase tracking-wider font-bold text-[#334155] hover:text-primary-purple"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mentorship
            </Link>
            <Link
              href="/courses?type=Placement"
              className="text-lg transition-colors uppercase tracking-wider font-bold text-[#334155] hover:text-primary-purple"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Placements
            </Link>
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
              {user && !isPublicPage ? (
                <div className="flex flex-col gap-4">

                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-100 text-rose-500 font-bold transition-colors bg-rose-50/30"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-center px-4 py-3 rounded-xl border border-gray-200 font-bold transition-colors text-[#334155] hover:bg-gray-50"
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
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
