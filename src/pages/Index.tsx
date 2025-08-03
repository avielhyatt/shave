import { Header } from "@/components/layout/Header";
import { CategoryNavigation } from "@/components/layout/CategoryNavigation";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PromotionsSection } from "@/components/home/PromotionsSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { Footer } from "@/components/layout/Footer";

import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { direction } = useLanguage();
  
  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
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
