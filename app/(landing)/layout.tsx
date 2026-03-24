import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar variant="dark" />
            <main className="flex-1 relative z-10 flex flex-col">
                {children}
            </main>
            <Footer />
        </>
    );
}
