import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "תוכנית בסיסית",
    price: "100₪",
    ads: "10-30",
    icon: <Users className="w-6 h-6" />,
    color: "bg-blue-500",
    features: [
      "עד 30 מודעות בחודש",
      "תמיכה בסיסית",
      "פרסום במערכת",
      "סטטיסטיקות בסיסיות"
    ]
  },
  {
    name: "תוכנית מתקדמת",
    price: "200₪",
    ads: "30-60",
    icon: <Star className="w-6 h-6" />,
    color: "bg-orange-500",
    popular: true,
    features: [
      "עד 60 מודעות בחודש",
      "תמיכה מועדפת",
      "קידום מודעות",
      "סטטיסטיקות מתקדמות",
      "דיווחים חודשיים"
    ]
  },
  {
    name: "תוכנית עסקית",
    price: "300₪",
    ads: "60-100",
    icon: <Crown className="w-6 h-6" />,
    color: "bg-purple-500",
    features: [
      "עד 100 מודעות בחודש",
      "תמיכה VIP",
      "קידום מקסימלי",
      "סטטיסטיקות מלאות",
      "דיווחים יומיים",
      "מנהל חשבון ייעודי"
    ]
  }
];

export const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  const { direction } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={direction}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center hebrew-text">
            תוכניות מחירים לעסקים
          </DialogTitle>
          <p className="text-center text-muted-foreground hebrew-text mt-2">
            בחרו את התוכנית המתאימה לכם והתחילו למכור יותר
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary text-white hebrew-text">
                  הכי פופולרי
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full ${plan.color} text-white flex items-center justify-center mx-auto mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-xl hebrew-text">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mt-2">
                  {plan.price}
                  <span className="text-sm text-muted-foreground">/חודש</span>
                </div>
                <p className="text-muted-foreground hebrew-text">
                  {plan.ads} מודעות בחודש
                </p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="hebrew-text text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full hebrew-text"
                  variant={plan.popular ? "default" : "outline"}
                >
                  בחירת תוכנית
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold hebrew-text mb-3">מה כלול בכל התוכניות?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="hebrew-text">אזור ניהול מתקדם</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="hebrew-text">ביטוח מודעות</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="hebrew-text">צפיות ללא הגבלה</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="hebrew-text">רכיבי SEO מובנים</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground hebrew-text">
            צריכים עזרה? צרו קשר עם צוות התמיכה שלנו
          </p>
          <Button variant="link" className="hebrew-text mt-2">
            צרו קשר
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};