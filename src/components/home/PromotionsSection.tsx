import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Clock, Users } from "lucide-react";
import { useState } from "react";
import { PricingModal } from "@/components/pricing/PricingModal";

const promotions = [
  {
    id: 1,
    title: "חודש חינם לעסקים!",
    description: "הירשמו עכשיו וקבלו חודש ראשון חינם לפרסום מודעות עסקיות",
    cta: "הצטרפו עכשיו",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Sparkles
  },
  {
    id: 2, 
    title: "מוקדם לתפוס!",
    description: "היו הראשונים לראות מודעות חדשות עם התראות מותאמות אישית",
    cta: "הפעילו התראות",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    icon: TrendingUp
  },
  {
    id: 3,
    title: "תמיכה 24/7",
    description: "צוות התמיכה שלנו כאן בשבילכם בכל שעות היום",
    cta: "צרו קשר",
    color: "bg-gradient-to-r from-green-500 to-emerald-500", 
    icon: Users
  }
];

export const PromotionsSection = () => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 hebrew-text">
            מבצעים חמים השבוע!
          </h2>
          <p className="text-xl text-muted-foreground hebrew-text">
            הזדמנויות מיוחדות שלא כדאי לפספס
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {promotions.map((promo) => {
            const Icon = promo.icon;
            return (
              <Card key={promo.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 ${promo.color}`} />
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${promo.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 hebrew-text">{promo.title}</h3>
                  <p className="text-muted-foreground mb-6 hebrew-text leading-relaxed">
                    {promo.description}
                  </p>
                  {promo.id === 1 ? (
                    <Button 
                      className={`${promo.color} text-white border-0 hover:opacity-90`}
                      onClick={() => setShowPricing(true)}
                    >
                      {promo.cta}
                    </Button>
                  ) : (
                    <Button className={`${promo.color} text-white border-0 hover:opacity-90`} asChild>
                      <Link to={promo.id === 2 ? "/notifications" : "/messages"}>
                        {promo.cta}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground hebrew-text">מודעות פעילות</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100,000+</div>
              <div className="text-muted-foreground hebrew-text">משתמשים רשומים</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground hebrew-text">מודעות חדשות יומית</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground hebrew-text">תמיכה ושירות</div>
            </div>
          </div>
        </div>
      </div>
      
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </section>
  );
};