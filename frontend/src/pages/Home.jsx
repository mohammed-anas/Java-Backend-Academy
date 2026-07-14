import { lazy, Suspense } from "react";
import Nav from "@/site/Nav";
import Hero from "@/site/Hero";
import Preloader from "@/site/Preloader";

const Marquee = lazy(() => import("@/site/Marquee"));
const Manifesto = lazy(() => import("@/site/Manifesto"));
const Batches = lazy(() => import("@/site/Batches"));
const About = lazy(() => import("@/site/About"));
const FAQ = lazy(() => import("@/site/FAQ"));
const Location = lazy(() => import("@/site/Location"));
const Contact = lazy(() => import("@/site/Contact"));
const Footer = lazy(() => import("@/site/Footer"));
const ContactFab = lazy(() => import("@/site/ContactFab"));

const LazySection = ({ children }) => (
  <Suspense fallback={<div className="min-h-[200px]" />}>
    {children}
  </Suspense>
);

export default function Home() {
  return (
    <main data-testid="home-page" className="relative">
      <Preloader />
      <Nav />
      <Hero />
      <LazySection><Marquee /></LazySection>
      <LazySection><Manifesto /></LazySection>
      <LazySection><Batches /></LazySection>
      <LazySection><About /></LazySection>
      <LazySection><FAQ /></LazySection>
      <LazySection><Location /></LazySection>
      <LazySection><Contact /></LazySection>
      <LazySection><Footer /></LazySection>
      <LazySection><ContactFab /></LazySection>
    </main>
  );
}
