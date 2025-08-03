import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate(`/browse?q=${encodeURIComponent(searchQuery)}`)
  }

  const stats = [
    { number: "50,000+", label: "מודעות פעילות" },
    { number: "100,000+", label: "משתמשים רשומים" },
    { number: "500+", label: "מודעות חדשות יומית" },
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 hebrew-text">
            שווה - השוק הישראלי שלכם
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 hebrew-text">
            קנו, מכרו והשכירו בקלות ובביטחון
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="p-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="מה אתם מחפשים היום?"
                    className="w-full pr-12 h-12 text-lg hebrew-text"
                    dir="rtl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button size="lg" className="px-8 hebrew-text" onClick={handleSearch}>
                  חיפוש
                </Button>
              </div>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg hebrew-text" asChild>
              <Link to="/post-ad">
                <Plus className="w-5 h-5 ml-2" />
                פרסמו מודעה בחינם
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg text-white/80 hebrew-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};