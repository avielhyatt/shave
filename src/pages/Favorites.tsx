import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Heart, MapPin, Phone, Trash2, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  subcategory?: string
  location: string
  images: string[]
  is_featured: boolean
  is_sold: boolean
  created_at: string
}

const categories = [
  { value: "real-estate", label: "נדל״ן" },
  { value: "vehicles", label: "רכב" },
  { value: "electronics", label: "אלקטרוניקה" },
  { value: "furniture", label: "רהיטים" },
  { value: "jobs", label: "עבודה" },
  { value: "services", label: "שירותים" }
]

export default function Favorites() {
  const { user } = useAuth()
  const { t, direction } = useLanguage()
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          listing_id,
          listings (
            id,
            title,
            description,
            price,
            category,
            subcategory,
            location,
            images,
            is_featured,
            is_sold,
            created_at
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const favoriteListings = data
        ?.map(item => item.listings)
        .filter(listing => listing !== null) as Listing[]

      setFavorites(favoriteListings || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast({
        title: t('favorites.loadError'),
        description: t('browse.refreshPage'),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user!.id)
        .eq('listing_id', listingId)

      if (error) throw error

      setFavorites(favorites.filter(listing => listing.id !== listingId))
      toast({
        title: t('favorites.removeSuccess'),
        description: "המודעה הוסרה מרשימת המועדפים שלך"
      })
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast({
        title: t('favorites.removeError'),
        description: "נסה שוב",
        variant: "destructive"
      })
    }
  }

  if (!user) {
    return (
      <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" dir={direction}>{t('auth.loginRequired')}</h1>
            <Button asChild>
              <Link to="/" dir={direction}>{t('auth.backHome')}</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2" dir={direction}>
              <Heart className="w-8 h-8 text-red-500" />
              {t('favorites.title')}
            </h1>
            <Button asChild>
              <Link to="/browse" dir={direction}>{t('favorites.backToBrowse')}</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2" dir={direction}>{t('favorites.noFavorites')}</h3>
                <p className="text-muted-foreground mb-4" dir={direction}>
                  {t('favorites.startSaving')}
                </p>
                <Button asChild>
                  <Link to="/browse" dir={direction}>{t('favorites.searchAds')}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-muted-foreground" dir={direction}>
                {t('favorites.found')} {favorites.length} {t('favorites.favoriteAds')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((listing) => (
                  <Card key={listing.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                    {/* Image */}
                    <div className="aspect-video bg-muted overflow-hidden relative">
                      {listing.images.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      {listing.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-shave-primary">
                          מומלץ
                        </Badge>
                      )}
                      {listing.is_sold && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          נמכר
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFavorite(listing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {categories.find(c => c.value === listing.category)?.label}
                          </Badge>
                          {listing.subcategory && (
                            <Badge variant="outline">{listing.subcategory}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          ₪{listing.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          פורסם: {new Date(listing.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button className="flex-1" dir={direction}>
                        <Phone className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {t('favorites.contact')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => removeFavorite(listing.id)}
                        dir={direction}
                      >
                        {t('favorites.removeFavorite')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}