import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";

const urbanist = localFont({
  src: [
    {
      path: "../public/fonts/urbanist-latin-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/urbanist-latin-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-urbanist",
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
    <html lang="en" className={`scroll-smooth ${urbanist.variable}`} data-scroll-behavior="smooth">
      <body 
        className={`font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary-blue/30`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
