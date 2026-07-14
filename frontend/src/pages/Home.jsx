import Nav from "@/site/Nav";
import Hero from "@/site/Hero";
import Marquee from "@/site/Marquee";
import Manifesto from "@/site/Manifesto";
import About from "@/site/About";
import Location from "@/site/Location";
import Contact from "@/site/Contact";
import Footer from "@/site/Footer";
import ContactFab from "@/site/ContactFab";
import Preloader from "@/site/Preloader";

export default function Home() {
  return (
    <main data-testid="home-page" className="relative">
      <Preloader />
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />
      <About />
      <Location />
      <Contact />
      <Footer />
      <ContactFab />
    </main>
  );
}
