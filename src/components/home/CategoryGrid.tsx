import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Home, 
  Car, 
  Briefcase, 
  Wrench,
  Smartphone,
  Armchair,
  Shirt,
  Building,
  Key,
  Bike
} from "lucide-react";

const categories = [
  {
    id: "second-hand",
    name: "יד שנייה",
    description: "מוצרי אלקטרוניקה, רהיטים וכל מה שצריך",
    icon: Package,
    count: "15,234",
    color: "bg-blue-500",
    subcategories: [
      { name: "אלקטרוניקה", count: "5,421", icon: Smartphone },
      { name: "רהיטים", count: "3,892", icon: Armchair },
      { name: "ביגוד", count: "2,567", icon: Shirt }
    ]
  },
  {
    id: "real-estate",
    name: "נדל\"ן",
    description: "דירות ובתים למכירה ולהשכרה",
    icon: Home,
    count: "8,932",
    color: "bg-green-500",
    subcategories: [
      { name: "דירות למכירה", count: "4,234", icon: Building },
      { name: "דירות להשכרה", count: "3,421", icon: Key }
    ]
  },
  {
    id: "vehicles",
    name: "רכב",
    description: "מכוניות, אופנועים וכלי רכב",
    icon: Car,
    count: "12,567",
    color: "bg-orange-500",
    subcategories: [
      { name: "מכוניות", count: "9,234", icon: Car },
      { name: "אופנועים", count: "1,892", icon: Bike }
    ]
  },
  {
    id: "jobs",
    name: "עבודה",
    description: "דרושים ומשרות פנויות בכל התחומים",
    icon: Briefcase,
    count: "6,789",
    color: "bg-purple-500",
    subcategories: []
  },
  {
    id: "services",
    name: "שירותים",
    description: "שירותים מקצועיים ועסקים מקומיים",
    icon: Wrench,
    count: "4,321",
    color: "bg-teal-500",
    subcategories: []
  }
];

export const CategoryGrid = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 hebrew-text">
            חקרו את הקטגוריות שלנו
          </h2>
          <p className="text-xl text-muted-foreground hebrew-text">
            מצאו בדיוק מה שאתם מחפשים במגוון רחב של קטגוריות
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold hebrew-text">{category.name}</h3>
                        <Badge variant="secondary" className="hebrew-text">
                          {category.count}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm hebrew-text">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {category.subcategories.length > 0 && (
                    <div className="space-y-2">
                      {category.subcategories.map((sub, index) => {
                        const SubIcon = sub.icon;
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <SubIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="hebrew-text">{sub.name}</span>
                            </div>
                            <Badge variant="outline" className="hebrew-text text-xs">
                              {sub.count}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};