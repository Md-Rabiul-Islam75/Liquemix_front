import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import SegmentsGrid from "@/components/home/SegmentsGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SolutionsSection from "@/components/home/SolutionsSection";
import ReferencesGrid from "@/components/home/ReferencesGrid";
import NewsSection from "@/components/home/NewsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <SegmentsGrid />
      <FeaturedProducts />
      <SolutionsSection />
      <ReferencesGrid />
      <NewsSection />
    </>
  );
}
