import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Problem } from "@/sections/Problem";
import { ScoreAnatomy } from "@/sections/ScoreAnatomy";
import { HowItWorks } from "@/sections/HowItWorks";
import { Audiences } from "@/sections/Audiences";
import { Placement } from "@/sections/Placement";
import { Compliance } from "@/sections/Compliance";
import { Platform } from "@/sections/Platform";
import { Founder } from "@/sections/Founder";
import { Cta } from "@/sections/Cta";
import { Footer } from "@/sections/Footer";

export default function App() {
  return (
    <div className="grain relative">
      <a href="#problem" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <ScoreAnatomy />
        <HowItWorks />
        <Audiences />
        <Placement />
        <Compliance />
        <Platform />
        <Founder />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
