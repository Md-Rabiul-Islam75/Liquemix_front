import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import CertificationStrip from "@/components/home/CertificationStrip";
import TopClientsCarousel from "@/components/home/TopClientsCarousel";
import SegmentsGrid from "@/components/home/SegmentsGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SolutionsSection from "@/components/home/SolutionsSection";
import ReferencesGrid from "@/components/home/ReferencesGrid";
import NewsSection from "@/components/home/NewsSection";
import FaqSection from "@/components/home/FaqSection";
import {
  HeroFallback,
  SectionFallback,
} from "@/components/home/SectionFallback";

// Each async (data-fetching) section gets its own Suspense boundary so a
// slow backend call only delays that section — the rest of the page
// streams in immediately. TrustStrip, ReferencesGrid and FaqSection are
// synchronous, so they render without a boundary.
export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroFallback />}>
        <Hero />
      </Suspense>
      <Suspense fallback={null}>
        <CertificationStrip />
      </Suspense>
      <Suspense fallback={null}>
        <TopClientsCarousel />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SegmentsGrid />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <SolutionsSection />
      </Suspense>
      <ReferencesGrid />
      <Suspense fallback={<SectionFallback />}>
        <NewsSection />
      </Suspense>
      <FaqSection />
    </>
  );
}
