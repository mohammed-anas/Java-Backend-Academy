import { lazy, Suspense } from "react";
import Nav from "@/site/Nav";
import Hero from "@/site/Hero";
import Preloader from "@/site/Preloader";

const Marquee     = lazy(() => import("@/site/Marquee"));
const WhoFor      = lazy(() => import("@/site/WhoFor"));
const Manifesto   = lazy(() => import("@/site/Manifesto"));
const Projects    = lazy(() => import("@/site/Projects"));
const Batches     = lazy(() => import("@/site/Batches"));
const About       = lazy(() => import("@/site/About"));
const Compare     = lazy(() => import("@/site/Compare"));
const Reviews     = lazy(() => import("@/site/Reviews"));
const LeadMagnet  = lazy(() => import("@/site/LeadMagnet"));
const FAQ         = lazy(() => import("@/site/FAQ"));
const Location    = lazy(() => import("@/site/Location"));
const Contact     = lazy(() => import("@/site/Contact"));
const Footer      = lazy(() => import("@/site/Footer"));
const ContactFab  = lazy(() => import("@/site/ContactFab"));

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
      <LazySection><WhoFor /></LazySection>
      <LazySection><Manifesto /></LazySection>
      <LazySection><Projects /></LazySection>
      <LazySection><Batches /></LazySection>
      <LazySection><About /></LazySection>
      <LazySection><Compare /></LazySection>
      <LazySection><Reviews /></LazySection>
      <LazySection><LeadMagnet /></LazySection>
      <LazySection><FAQ /></LazySection>
      <LazySection><Location /></LazySection>
      <LazySection><Contact /></LazySection>
      <LazySection><Footer /></LazySection>
      <LazySection><ContactFab /></LazySection>
    </main>
  );
}
