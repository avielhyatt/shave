import { Button } from "@/components/ui/button";
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
    icon: Package,
    subcategories: [
      { id: "electronics", name: "אלקטרוניקה", icon: Smartphone },
      { id: "furniture", name: "רהיטים", icon: Armchair },
      { id: "clothing", name: "ביגוד", icon: Shirt },
    ]
  },
  {
    id: "real-estate",
    name: "נדל\"ן",
    icon: Home,
    subcategories: [
      { id: "apartments-for-sale", name: "דירות למכירה", icon: Building },
      { id: "apartments-for-rent", name: "דירות להשכרה", icon: Key },
    ]
  },
  {
    id: "vehicles",
    name: "רכב",
    icon: Car,
    subcategories: [
      { id: "cars", name: "מכוניות", icon: Car },
      { id: "motorcycles", name: "אופנועים", icon: Bike },
    ]
  },
  {
    id: "jobs",
    name: "עבודה",
    icon: Briefcase,
    subcategories: []
  },
  {
    id: "services",
    name: "שירותים",
    icon: Wrench,
    subcategories: []
  }
];

export const CategoryNavigation = () => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto">
          <Button variant="ghost" size="sm" className="hebrew-text whitespace-nowrap">
            כל הקטגוריות
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className="hebrew-text whitespace-nowrap"
              >
                <Icon className="w-4 h-4 ml-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};