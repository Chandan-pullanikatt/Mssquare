'use client';

import { useState } from "react";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { Menu, X, Bell, Search } from "lucide-react";

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white text-gray-900 border-[8px] border-[#f5f3ff] overflow-hidden">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex fixed top-1 left-1 bottom-1 h-[calc(100vh-8px)] z-40">
                <InstructorSidebar />
            </aside>

            {/* Sidebar (Mobile) */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                <div className={`absolute top-0 left-0 bottom-0 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <InstructorSidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen bg-[#fafafc] w-full lg:pl-[260px]">
                {/* Header */}
                <header className="h-[80px] bg-white/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between border-b border-gray-100 z-30 sticky top-0">
                    <button className="lg:hidden p-2 -ml-2 text-gray-600" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-2xl relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search in your courses..."
                            className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none placeholder:text-gray-400 font-medium text-gray-700 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 ml-4">
                        <UserMenu variant="light" />
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-[1400px] mx-auto w-full pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
