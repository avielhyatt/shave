import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, Star, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ListingModal } from "@/components/listing/ListingModal";
import { useToast } from "@/components/ui/use-toast";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  location: string;
  images: string[];
  contact_phone?: string;
  contact_email?: string;
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
  user_id: string;
}

const categoryLabels = {
  "real-estate": "נדל״ן",
  "vehicles": "רכב",
  "electronics": "אלקטרוניקה",
  "furniture": "רהיטים",
  "fashion": "אופנה",
  "jewelry": "תכשיטים",
  "jobs": "עבודה",
  "services": "שירותים",
  "babies": "תינוקות וילדים",
  "animals": "חיות מחמד",
  "wedding": "חתונות ואירועים"
};

const categoryColors = {
  "real-estate": "bg-emerald-500",
  "vehicles": "bg-orange-500",
  "electronics": "bg-blue-500",
  "furniture": "bg-purple-500",
  "fashion": "bg-pink-500",
  "jewelry": "bg-yellow-500",
  "jobs": "bg-teal-500",
  "services": "bg-red-500",
  "babies": "bg-cyan-500",
  "animals": "bg-green-500",
  "wedding": "bg-violet-500"
};

export const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_featured', true)
        .eq('is_sold', false)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את המודעות המובחרות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleContactSeller = (listing: Listing) => {
    toast({
      title: "יצירת קשר",
      description: "פרטי הקשר נפתחו",
    });
  };

  const handleToggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
        toast({
          title: "הוסר מהמועדפים",
          description: "המודעה הוסרה מרשימת המועדפים שלך",
        });
      } else {
        newFavorites.add(listingId);
        toast({
          title: "נוסף למועדפים",
          description: "המודעה נוספה לרשימת המועדפים שלך",
        });
      }
      return newFavorites;
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `לפני ${diffDays} יום${diffDays > 1 ? 'ים' : ''}`;
    } else if (diffHours > 0) {
      return `לפני ${diffHours} שעה${diffHours > 1 ? 'ות' : ''}`;
    } else {
      return 'לפני זמן קצר';
    }
  };

  if (loading) {
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded mb-3 animate-pulse" />
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 hebrew-text bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                מודעות מובחרות
              </h2>
              <p className="text-xl text-muted-foreground hebrew-text">
                המודעות הכי טובות והכי עדכניות שלנו
              </p>
            </div>
            <Button variant="outline" className="hebrew-text shadow-md hover:shadow-lg transition-shadow" asChild>
              <Link to="/browse">צפו בכל המודעות</Link>
            </Button>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground hebrew-text">
                אין מודעות מובחרות כרגע
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing) => {
                const categoryLabel = categoryLabels[listing.category as keyof typeof categoryLabels] || listing.category;
                const categoryColor = categoryColors[listing.category as keyof typeof categoryColors] || "bg-gray-500";
                
                return (
                  <Card 
                    key={listing.id}
                    className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm border-2 hover:border-primary/20 hover:-translate-y-2"
                    onClick={() => handleListingClick(listing)}
                  >
                    <div className="relative overflow-hidden">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {listing.is_featured && (
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hebrew-text">
                          מובחר ⭐
                        </Badge>
                      )}
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-4 left-4 bg-white/90 hover:bg-white shadow-md backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(listing.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 transition-colors ${favorites.has(listing.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </Button>
                      
                      <Badge 
                        className={`absolute bottom-4 right-4 ${categoryColor} text-white shadow-lg hebrew-text backdrop-blur-sm`}
                      >
                        {categoryLabel}
                      </Badge>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-bold text-xl mb-2 hebrew-text line-clamp-2 group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="hebrew-text truncate">{listing.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          ₪{listing.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="hebrew-text">{formatTimeAgo(listing.created_at)}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/50">
                        <p className="text-sm text-muted-foreground hebrew-text line-clamp-2">
                          {listing.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ListingModal
        listing={selectedListing}
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        onContactSeller={handleContactSeller}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedListing ? favorites.has(selectedListing.id) : false}
      />
    </>
  );
};