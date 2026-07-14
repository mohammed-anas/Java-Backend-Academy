import Nav from "@/site/Nav";
import Hero from "@/site/Hero";
import Marquee from "@/site/Marquee";
import Manifesto from "@/site/Manifesto";
import Outcomes from "@/site/Outcomes";
import About from "@/site/About";
import Mentors from "@/site/Mentors";
import Reviews from "@/site/Reviews";
import Contact from "@/site/Contact";
import Location from "@/site/Location";
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
      <Outcomes />
      <About />
      <Mentors />
      <Reviews />
      <Contact />
      <Location />
      <Footer />
      <ContactFab />
    </main>
  );
}
