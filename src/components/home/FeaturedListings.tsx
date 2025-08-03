import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, Star } from "lucide-react";

const featuredListings = [
  {
    id: 1,
    title: "דירת 4 חדרים בתל אביב",
    price: "₪ 8,500",
    period: "לחודש",
    location: "תל אביב - הצפון הישן",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    category: "נדל\"ן",
    categoryColor: "bg-green-500",
    featured: true,
    timeAgo: "לפני 2 שעות",
    seller: "מתווך מוסמך",
    rating: 4.8
  },
  {
    id: 2,
    title: "מזדה CX-5 2021",
    price: "₪ 185,000",
    period: "",
    location: "חיפה",
    image: "https://images.unsplash.com/photo-1549399728-8b5e37e05602?w=400&h=300&fit=crop",
    category: "רכב",
    categoryColor: "bg-orange-500",
    featured: true,
    timeAgo: "לפני שעה",
    seller: "מוכר פרטי",
    rating: 4.9
  },
  {
    id: 3,
    title: "מחשב נייד MacBook Pro M3",
    price: "₪ 8,900",
    period: "",
    location: "ירושלים",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "אלקטרוניקה",
    categoryColor: "bg-blue-500",
    featured: false,
    timeAgo: "לפני 4 שעות",
    seller: "חנות מוסמכת",
    rating: 4.7
  },
  {
    id: 4,
    title: "ספה 3 מושבים איקאה",
    price: "₪ 1,200",
    period: "",
    location: "ראשון לציון",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    category: "רהיטים",
    categoryColor: "bg-purple-500",
    featured: false,
    timeAgo: "לפני 6 שעות",
    seller: "מוכר פרטי",
    rating: 4.5
  },
  {
    id: 5,
    title: "מנהל/ת מכירות בהיי-טק",
    price: "₪ 18,000",
    period: "לחודש",
    location: "הרצליה פיתוח",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    category: "עבודה",
    categoryColor: "bg-teal-500",
    featured: true,
    timeAgo: "לפני יום",
    seller: "חברת גיוס",
    rating: 4.6
  },
  {
    id: 6,
    title: "שירותי תיקון מכשירי חשמל",
    price: "₪ 120",
    period: "לשעה",
    location: "נתניה",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop",
    category: "שירותים",
    categoryColor: "bg-red-500",
    featured: false,
    timeAgo: "לפני 3 שעות",
    seller: "טכנאי מוסמך",
    rating: 4.9
  }
];

export const FeaturedListings = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 hebrew-text">
              מודעות מובחרות
            </h2>
            <p className="text-xl text-muted-foreground hebrew-text">
              המודעות הכי טובות והכי עדכניות שלנו
            </p>
          </div>
          <Button variant="outline" className="hebrew-text">
            צפו בכל המודעות
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Card 
              key={listing.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {listing.featured && (
                  <Badge className="absolute top-3 right-3 bg-shave-orange text-white hebrew-text">
                    מובחר
                  </Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 left-3 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge 
                  className={`absolute bottom-3 right-3 ${listing.categoryColor} text-white hebrew-text`}
                >
                  {listing.category}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1 hebrew-text line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="hebrew-text">{listing.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-xl font-bold text-primary">
                    {listing.price}
                    {listing.period && (
                      <span className="text-sm font-normal text-muted-foreground hebrew-text">
                        {" "}{listing.period}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="hebrew-text">{listing.timeAgo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{listing.rating}</span>
                  </div>
                  <span className="text-muted-foreground hebrew-text">
                    {listing.seller}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};