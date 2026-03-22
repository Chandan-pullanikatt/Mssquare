import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-white/5 bg-[#06070a]">
      <div className="px-[5%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="flex flex-col gap-4">
            <Link href="/" className="relative h-9 w-36 transition-transform duration-300 hover:scale-[1.02]">
              <img 
                src="/assets/logo-dark.png" 
                alt="MSSquare" 
                className="h-full w-full object-contain object-left"
              />
            </Link>
            <p className="text-muted text-[0.85rem] leading-[1.6]">
              Hyderabad's leading tech training and consultancy company. We train developers, build products, and accelerate startups — all under one roof.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <a href="tel:+919492982929" className="text-muted hover:text-white text-[0.85rem] transition-colors flex items-center gap-2">
                <Phone size={14} className="text-primary-blue" />
                +91 9492982929
              </a>
              <a href="mailto:operations@mssquaretechnologies.com" className="text-muted hover:text-white text-[0.85rem] transition-colors flex items-center gap-2">
                <Mail size={14} className="text-primary-blue" />
                operations@mssquaretechnologies.com
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold font-heading text-[1rem]">PROGRAMS</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#courses" className="text-muted hover:text-white text-[0.85rem] transition-colors">Mentorship Program</Link></li>
              <li><Link href="#courses" className="text-muted hover:text-white text-[0.85rem] transition-colors">Certification Program</Link></li>
              <li><Link href="#courses" className="text-muted hover:text-white text-[0.85rem] transition-colors">Placement Program</Link></li>
              <li><Link href="#courses" className="text-muted hover:text-white text-[0.85rem] transition-colors">All Courses</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold font-heading text-[1rem]">COMPANY</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/about" className="text-muted hover:text-white text-[0.85rem] transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-muted hover:text-white text-[0.85rem] transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-muted hover:text-white text-[0.85rem] transition-colors">Careers</Link></li>
              <li><Link href="/become-instructor" className="text-muted hover:text-white text-[0.85rem] transition-colors">Become an Instructor</Link></li>
              <li><Link href="#cta" className="text-muted hover:text-white text-[0.85rem] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold font-heading text-[1rem]">LEGAL</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/privacy" className="text-muted hover:text-white text-[0.85rem] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted hover:text-white text-[0.85rem] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="text-muted hover:text-white text-[0.85rem] transition-colors">Refund Policy</Link></li>
              <li><Link href="/faq" className="text-muted hover:text-white text-[0.85rem] transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[0.82rem] text-muted text-center md:text-left">
            © {new Date().getFullYear()} MSsquare Technologies. All rights reserved.
          </div>
          <div className="text-[0.82rem] text-muted bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            📍 Hyderabad, India 🇮🇳
          </div>
        </div>
      </div>
    </footer>
  );
}
