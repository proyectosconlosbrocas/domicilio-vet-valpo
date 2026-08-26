import { Navbar } from "@/components/Navbar";
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
  return (
    <>
      <a href="#main-content" className="skip-to-main">
        Saltar al contenido
      </a>
      <FloatingButtons />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <Operativos />
        <About />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
