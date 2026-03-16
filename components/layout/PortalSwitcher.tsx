"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Settings,
  Grid3X3
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function PortalSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const portals = [
    { 
      name: 'Student LMS', 
      href: '/student-dashboard', 
      icon: GraduationCap,
      description: 'Your learning journey'
    },
    { 
      name: 'Business Dashboard', 
      href: '/business-dashboard', 
      icon: Briefcase,
      description: 'Manage projects & teams'
    },
    { 
      name: 'Admin Panel', 
      href: '/admin', 
      icon: ShieldCheck,
      description: 'Core system administration',
      roles: ['admin', 'ceo']
    },
    { 
      name: 'LMS Admin', 
      href: '/lms-admin', 
      icon: Settings,
      description: 'Course & content management',
      roles: ['admin', 'ceo', 'content_admin']
    },
    { 
      name: 'Central Portal', 
      href: '/portal', 
      icon: Grid3X3,
      description: 'All-access unified view'
    }
  ];

  // Filter portals based on role if necessary (optional, but good for UX)
  const filteredPortals = portals.filter(p => !p.roles || (role && p.roles.includes(role)));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary-purple/30 hover:bg-white transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-purple/10 flex items-center justify-center text-primary-purple">
          <LayoutDashboard size={18} />
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-[0.75rem] font-bold text-gray-900 leading-tight">Switch Portal</span>
          <span className="text-[0.65rem] text-gray-400 font-medium capitalize">{role?.replace('_', ' ') || 'User'}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-3 w-72 bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl overflow-hidden z-[100]"
          >
            <div className="p-4 bg-gray-50/50 border-b border-gray-100">
              <span className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">Available Portals</span>
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto">
              {filteredPortals.map((portal) => (
                <Link
                  key={portal.href}
                  href={portal.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-purple/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary-purple group-hover:border-primary-purple/20 transition-all shadow-sm">
                    <portal.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary-purple transition-colors">{portal.name}</span>
                    <span className="text-[0.65rem] text-gray-400 font-medium">{portal.description}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
              <Link 
                href="/auth" 
                className="text-[0.7rem] font-bold text-gray-500 hover:text-primary-purple transition-colors block text-center"
              >
                Control Center Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
