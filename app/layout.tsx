import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MSsquare — Build. Learn. Launch.",
  description: "MSsquare is a hybrid tech company that trains the next generation of developers, runs real-project internships, and builds scalable products for startups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${urbanist.variable}`}>
      <body className={`font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary-blue/30`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
