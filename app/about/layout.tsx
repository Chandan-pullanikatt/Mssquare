import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us | MSsquare Technologies",
  description: "Learn about MSSquare Technologies - a leading EdTech and Tech Consulting company dedicated to shaping the next generation of tech leaders.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <Navbar variant="light" />
      <div className="pt-[70px]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
