import { Header } from "@/components/layout/Header";
import { CategoryNavigation } from "@/components/layout/CategoryNavigation";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PromotionsSection } from "@/components/home/PromotionsSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background rtl">
      <Header />
      <CategoryNavigation />
      <main>
        <HeroSection />
        <CategoryGrid />
        <PromotionsSection />
        <FeaturedListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
