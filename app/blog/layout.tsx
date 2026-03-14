import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Blog | MSsquare Technologies",
  description: "Read the latest insights, stories, and updates from the MSsquare Technologies team. Learn about technology, innovation, and our journey.",
};

export default function BlogLayout({
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
