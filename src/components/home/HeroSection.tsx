import { Search, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { PricingModal } from "@/components/pricing/PricingModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { toast } from "sonner";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showPricing, setShowPricing] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()
  const { t, direction } = useLanguage()
  const { user } = useAuth()

  const handleSearch = () => {
    navigate(`/browse?q=${encodeURIComponent(searchQuery)}`)
  }

  const handlePostAd = () => {
    if (user) {
      navigate('/post-ad')
    } else {
      setShowAuth(true)
      toast.error('נדרשת התחברות כדי לפרסם מודעה')
    }
  }

  const stats = [
    { number: "10,000+", label: t('hero.stats.activeAds') },
    { number: "25,000+", label: t('hero.stats.users') },
    { number: "150+", label: t('hero.stats.dailyAds') },
  ];

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 shave-hero-gradient opacity-90" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]" />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" dir={direction}>
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8" dir={direction}>
            {t('hero.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="p-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5`} />
                  <Input
                    placeholder={t('hero.search')}
                    className={`w-full ${direction === 'rtl' ? 'pr-12' : 'pl-12'} h-12 text-lg`}
                    dir={direction}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button size="lg" className="px-8" onClick={handleSearch} dir={direction}>
                  {t('hero.searchButton')}
                </Button>
              </div>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg"
              onClick={handlePostAd}
              dir={direction}
            >
              <Plus className={`w-5 h-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {user ? t('hero.postAd') : 'פרסם מודעה'}
            </Button>
            
            <Button 
              size="lg" 
              className="px-6 py-4 text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg"
              onClick={() => navigate('/browse?mode=tinder')}
              dir={direction}
            >
              <Zap className={`w-5 h-5 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              MarketPlace Mode
            </Button>
          </div>
          
          <div className="mb-8 flex justify-center">
            <Button 
              size="sm" 
              variant="outline"
              className="px-6 py-3 text-sm bg-white/90 hover:bg-white text-primary border-2 border-white shadow-lg hebrew-text"
              onClick={() => setShowPricing(true)}
              dir={direction}
            >
              חודש חינם לעסקים
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-white/80" dir={direction}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
      
      <AuthModal 
        open={showAuth} 
        onOpenChange={setShowAuth} 
      />
    </section>
  );
};