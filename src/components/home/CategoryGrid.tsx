import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Home, 
  Car, 
  Briefcase, 
  Wrench,
  Smartphone,
  Laptop,
  Tv,
  Camera,
  Headphones,
  Armchair,
  Sofa,
  Bed,
  Shirt,
  Building,
  Key,
  Bike,
  Gem,
  Truck,
  Navigation,
  Baby,
  Gift,
  BookOpen,
  Music,
  Gamepad2,
  MapPin,
  Users,
  Stethoscope,
  GraduationCap,
  Hammer,
  PaintBucket,
  Scissors,
  Flower,
  Utensils,
  Coffee,
  Zap,
  ShoppingBag,
  Watch,
  Glasses,
  Heart,
  Dumbbell,
  TreePine,
  Dog,
  Palette,
  Package
} from "lucide-react";

const categories = [
  {
    id: "real-estate",
    name: "נדל״ן",
    description: "דירות ובתים למכירה ולהשכרה",
    icon: Home,
    count: "45,892",
    color: "bg-emerald-500",
    subcategories: [
      { name: "דירות למכירה", count: "18,234", icon: Building },
      { name: "דירות להשכרה", count: "15,421", icon: Key },
      { name: "בתים פרטיים", count: "6,789", icon: Home },
      { name: "מגרשים", count: "3,456", icon: MapPin },
      { name: "משרדים", count: "1,992", icon: Building }
    ]
  },
  {
    id: "vehicles",
    name: "רכב",
    description: "רכבים פרטיים, מסחריים ואופנועים",
    icon: Car,
    count: "32,567",
    color: "bg-blue-600",
    subcategories: [
      { name: "רכבים פרטיים", count: "24,234", icon: Car },
      { name: "רכבים מסחריים", count: "4,892", icon: Truck },
      { name: "אופנועים", count: "2,441", icon: Bike },
      { name: "משאיות", count: "892", icon: Truck },
      { name: "כלי שייט", count: "108", icon: Navigation }
    ]
  },
  {
    id: "electronics",
    name: "אלקטרוניקה ומחשבים",
    description: "מחשבים, סמארטפונים ומוצרי אלקטרוניקה",
    icon: Smartphone,
    count: "28,234",
    color: "bg-indigo-500",
    subcategories: [
      { name: "סמארטפונים וטאבלטים", count: "12,421", icon: Smartphone },
      { name: "מחשבים ולפטופים", count: "8,892", icon: Laptop },
      { name: "טלוויזיות ומסכים", count: "4,567", icon: Tv },
      { name: "מצלמות וצילום", count: "1,892", icon: Camera },
      { name: "אוזניות ואודיו", count: "462", icon: Headphones }
    ]
  },
  {
    id: "furniture",
    name: "רהיטים ועיצוב הבית",
    description: "רהיטים, עיצוב פנים ומוצרי בית",
    icon: Armchair,
    count: "19,567",
    color: "bg-amber-500",
    subcategories: [
      { name: "רהיטי סלון", count: "7,234", icon: Sofa },
      { name: "רהיטי חדר שינה", count: "5,892", icon: Bed },
      { name: "רהיטי מטבח", count: "3,441", icon: Utensils },
      { name: "כסאות ושולחנות", count: "2,567", icon: Armchair },
      { name: "אביזרי נוי", count: "433", icon: Palette }
    ]
  },
  {
    id: "fashion",
    name: "אופנה וביגוד",
    description: "ביגוד, נעליים ואביזרי אופנה",
    icon: Shirt,
    count: "15,892",
    color: "bg-pink-500",
    subcategories: [
      { name: "ביגוד גברים", count: "6,234", icon: Shirt },
      { name: "ביגוד נשים", count: "7,892", icon: Shirt },
      { name: "נעליים", count: "1,456", icon: Shirt },
      { name: "תיקים", count: "310", icon: ShoppingBag }
    ]
  },
  {
    id: "jewelry",
    name: "תכשיטים ושעונים",
    description: "תכשיטים, שעונים ואביזרי יוקרה",
    icon: Gem,
    count: "8,156",
    color: "bg-purple-500",
    subcategories: [
      { name: "שעונים", count: "3,697", icon: Watch },
      { name: "טבעות", count: "1,892", icon: Gem },
      { name: "שרשראות", count: "1,567", icon: Gem },
      { name: "עגילים", count: "800", icon: Gem },
      { name: "משקפיים", count: "200", icon: Glasses }
    ]
  },
  {
    id: "jobs",
    name: "דרושים ועבודה",
    description: "משרות פנויות ומתן שירותים",
    icon: Briefcase,
    count: "12,789",
    color: "bg-green-600",
    subcategories: [
      { name: "הייטק וטכנולוגיה", count: "4,234", icon: Laptop },
      { name: "רפואה ובריאות", count: "2,892", icon: Stethoscope },
      { name: "חינוך והוראה", count: "2,441", icon: GraduationCap },
      { name: "בנייה ותחזוקה", count: "1,892", icon: Hammer },
      { name: "שירותי לקוחות", count: "1,330", icon: Users }
    ]
  },
  {
    id: "services",
    name: "שירותים ובעלי מקצוע",
    description: "שירותים מקצועיים ובעלי מקצוע",
    icon: Wrench,
    count: "9,321",
    color: "bg-teal-500",
    subcategories: [
      { name: "שיפוצים ובנייה", count: "3,234", icon: Hammer },
      { name: "צביעה ועיצוב", count: "1,892", icon: PaintBucket },
      { name: "מספרות ויופי", count: "1,567", icon: Scissors },
      { name: "גינון ונוף", count: "1,328", icon: Flower },
      { name: "חשמל ואינסטלציה", count: "1,300", icon: Zap }
    ]
  },
  {
    id: "hobbies",
    name: "תחביבים ופנאי",
    description: "ספורט, משחקים ופעילויות פנאי",
    icon: Gamepad2,
    count: "11,567",
    color: "bg-orange-500",
    subcategories: [
      { name: "ספורט וכושר", count: "4,234", icon: Dumbbell },
      { name: "משחקי מחשב", count: "2,892", icon: Gamepad2 },
      { name: "ספרים", count: "2,441", icon: BookOpen },
      { name: "מוזיקה", count: "1,567", icon: Music },
      { name: "קמפינג וטיולים", count: "433", icon: TreePine }
    ]
  },
  {
    id: "babies",
    name: "תינוקות וילדים",
    description: "מוצרי תינוקות, ילדים וצעצועים",
    icon: Baby,
    count: "7,892",
    color: "bg-rose-400",
    subcategories: [
      { name: "עגלות ומוצרי בטיחות", count: "2,567", icon: Baby },
      { name: "ביגוד לתינוקות", count: "2,234", icon: Shirt },
      { name: "צעצועים", count: "1,891", icon: Gift },
      { name: "רהיטי ילדים", count: "1,200", icon: Bed }
    ]
  },
  {
    id: "animals",
    name: "חיות מחמד",
    description: "חיות מחמד ואביזרים לחיות",
    icon: Dog,
    count: "4,567",
    color: "bg-yellow-500",
    subcategories: [
      { name: "כלבים", count: "2,234", icon: Dog },
      { name: "חתולים", count: "1,567", icon: Heart },
      { name: "אביזרים לחיות", count: "566", icon: Gift },
      { name: "מזון לחיות", count: "200", icon: Package }
    ]
  },
  {
    id: "wedding",
    name: "חתונות ואירועים",
    description: "שמלות כלה, חליפות וכל מה שקשור לחתונה",
    icon: Heart,
    count: "3,234",
    color: "bg-rose-500",
    subcategories: [
      { name: "שמלות כלה", count: "1,234", icon: Heart },
      { name: "חליפות חתן", count: "892", icon: Shirt },
      { name: "אולמות וגני אירועים", count: "567", icon: Users },
      { name: "צילום ווידאו", count: "441", icon: Camera },
      { name: "עיצוב פרחים", count: "100", icon: Flower }
    ]
  }
];

export const CategoryGrid = () => {
  const { t, direction } = useLanguage()
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" dir={direction}>
            {t('categories.title')}
          </h2>
          <p className="text-xl text-muted-foreground" dir={direction}>
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.slice(0, 6).map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={`/browse?category=${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 p-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold hebrew-text mb-1">{category.name}</h3>
                    <Badge variant="secondary" className="hebrew-text text-xs">
                      {category.count}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={`/browse?category=${category.id}`}>
                <Card 
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
                      {category.subcategories.slice(0, 3).map((sub, index) => {
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
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};