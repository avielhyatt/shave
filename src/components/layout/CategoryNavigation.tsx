import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home, 
  Car, 
  Briefcase, 
  Wrench,
  Smartphone,
  Armchair,
  Gem,
  Gamepad2,
  Baby,
  Dog,
  Heart
} from "lucide-react";

const categories = [
  {
    id: "real-estate",
    name: "נדל״ן",
    icon: Home,
    subcategories: []
  },
  {
    id: "vehicles",
    name: "רכב",
    icon: Car,
    subcategories: []
  },
  {
    id: "electronics",
    name: "אלקטרוניקה",
    icon: Smartphone,
    subcategories: []
  },
  {
    id: "furniture",
    name: "רהיטים",
    icon: Armchair,
    subcategories: []
  },
  {
    id: "jewelry",
    name: "תכשיטים",
    icon: Gem,
    subcategories: []
  },
  {
    id: "jobs",
    name: "דרושים",
    icon: Briefcase,
    subcategories: []
  },
  {
    id: "services",
    name: "שירותים",
    icon: Wrench,
    subcategories: []
  },
  {
    id: "babies",
    name: "תינוקות",
    icon: Baby,
    subcategories: []
  },
  {
    id: "animals",
    name: "חיות מחמד",
    icon: Dog,
    subcategories: []
  },
  {
    id: "wedding",
    name: "חתונות",
    icon: Heart,
    subcategories: []
  }
];

export const CategoryNavigation = () => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto">
          <Button variant="ghost" size="sm" className="hebrew-text whitespace-nowrap" asChild>
            <Link to="/browse">כל הקטגוריות</Link>
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className="hebrew-text whitespace-nowrap"
                asChild
              >
                <Link to={`/browse?category=${category.id}`}>
                  <Icon className="w-4 h-4 ml-2" />
                  {category.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};