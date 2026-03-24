import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { ProductsBuilt } from "@/components/sections/ProductsBuilt";
import { FAQ } from "@/components/sections/FAQ";
import { Programs } from "@/components/sections/Programs";
import { Solutions } from "@/components/sections/Solutions";
import { Marquee } from "@/components/sections/Marquee";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Hero />
      <Stats />
      <ProductsBuilt />
      <Solutions />
      <Programs />
      <Marquee />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
