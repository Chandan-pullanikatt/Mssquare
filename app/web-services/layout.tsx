import { Footer } from "@/components/layout/Footer";

export default function WebServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1 relative z-10 flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
