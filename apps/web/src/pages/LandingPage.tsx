import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { BrandStrip } from "@/components/motion/BrandStrip";
import { FloatingButtons } from "@/components/FloatingButtons";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Operativos } from "@/components/Operativos";
import { About } from "@/components/About";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export function LandingPage() {
  // reducedMotion="user": con prefers-reduced-motion se quitan desplazamientos
  // y parallax, y quedan solo fundidos.
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-to-main">
        Saltar al contenido
      </a>
      <FloatingButtons />
      <Navbar />
      <main id="main-content">
        <Hero />
        <BrandStrip />
        <Services />
        <About />
        <Operativos />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
    </MotionConfig>
  );
}
