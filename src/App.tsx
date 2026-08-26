import { Navbar } from "@/components/Navbar";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Operativos } from "@/components/Operativos";
import { About } from "@/components/About";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <>
      <FloatingButtons />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Operativos />
        <About />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
