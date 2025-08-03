import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Search, Filter, MapPin, Heart, Phone, Mail, Eye } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
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
  contact_phone?: string
  contact_email?: string
  is_featured: boolean
  is_sold: boolean
  created_at: string
  user_id: string
}

const categories = [
  { value: "all", label: "כל הקטגוריות" },
  { value: "real-estate", label: "נדל״ן" },
  { value: "vehicles", label: "רכב" },
  { value: "electronics", label: "אלקטרוניקה ומחשבים" },
  { value: "furniture", label: "רהיטים ועיצוב הבית" },
  { value: "fashion", label: "אופנה וביגוד" },
  { value: "jewelry", label: "תכשיטים ושעונים" },
  { value: "jobs", label: "דרושים ועבודה" },
  { value: "services", label: "שירותים ובעלי מקצוע" },
  
  { value: "babies", label: "תינוקות וילדים" },
  { value: "animals", label: "חיות מחמד" },
  { value: "wedding", label: "חתונות ואירועים" }
]

const israeliCities = [
  { value: "all", label: "כל הערים" },
  { value: "תל אביב", label: "תל אביב" },
  { value: "ירושלים", label: "ירושלים" },
  { value: "חיפה", label: "חיפה" },
  { value: "ראשון לציון", label: "ראשון לציון" },
  { value: "אשדוד", label: "אשדוד" },
  { value: "נתניה", label: "נתניה" },
  { value: "באר שבע", label: "באר שבע" }
]

export default function Browse() {
  const { user } = useAuth()
  const { t, direction } = useLanguage()
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("newest")
  const { toast } = useToast()

  useEffect(() => {
    fetchListings()
    if (user) {
      fetchUserFavorites()
    }
  }, [user])

  useEffect(() => {
    // Set initial filters from URL
    const categoryParam = searchParams.get('category')
    const queryParam = searchParams.get('q')
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    }
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam)
    }
  }, [searchParams])

  useEffect(() => {
    filterListings()
  }, [listings, searchQuery, selectedCategory, selectedLocation, priceRange, sortBy])

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_sold', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast({
        title: t('browse.loadError'),
        description: t('browse.refreshPage'),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserFavorites = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data?.map(f => f.listing_id) || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const toggleFavorite = async (listingId: string) => {
    if (!user) {
      toast({
        title: t('browse.loginRequired'),
        description: t('browse.loginToSave'),
        variant: "destructive"
      })
      return
    }

    const isFavorite = favorites.includes(listingId)

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId)

        if (error) throw error
        setFavorites(favorites.filter(id => id !== listingId))
        toast({
          title: t('browse.removedFromFavorites'),
          description: "המודעה הוסרה מרשימת המועדפים שלך"
        })
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: listingId
          })

        if (error) throw error
        setFavorites([...favorites, listingId])
        toast({
          title: t('browse.addedToFavorites'),
          description: "המודעה נשמרה ברשימת המועדפים שלך"
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: t('browse.error'),
        description: t('browse.cantUpdateFavorites'),
        variant: "destructive"
      })
    }
  }

  const filterListings = () => {
    let filtered = [...listings]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(listing => listing.category === selectedCategory)
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(listing => listing.location === selectedLocation)
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(listing => listing.price >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(listing => listing.price <= parseInt(priceRange.max))
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    // Featured listings first
    filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))

    setFilteredListings(filtered)
  }

  const handleContactSeller = (listing: Listing) => {
    if (listing.contact_phone) {
      window.open(`tel:${listing.contact_phone}`, '_self')
    } else if (listing.contact_email) {
      window.open(`mailto:${listing.contact_email}`, '_self')
    } else {
      toast({
        title: t('browse.noContactInfo'),
        description: t('browse.sellerNoContact'),
        variant: "destructive"
      })
    }
  }

  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
                <Input
                  placeholder={t('browse.searchAds')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={direction === 'rtl' ? 'pr-10' : 'pl-10'}
                  dir={direction}
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="מיקום" />
                  </SelectTrigger>
                  <SelectContent>
                    {israeliCities.map(city => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder={t('browse.minPrice')}
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  dir={direction}
                />

                <Input
                  placeholder={t('browse.maxPrice')}
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  dir={direction}
                />

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('browse.sort')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('browse.newest')}</SelectItem>
                    <SelectItem value="oldest">{t('browse.oldest')}</SelectItem>
                    <SelectItem value="price-low">{t('browse.priceLowHigh')}</SelectItem>
                    <SelectItem value="price-high">{t('browse.priceHighLow')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" dir={direction}>
              {t('browse.found')} {filteredListings.length} {t('browse.ads')}
            </h1>
            <Button asChild>
              <Link to="/post-ad" dir={direction}>{t('browse.postNewAd')}</Link>
            </Button>
          </div>

          {/* Listings Grid */}
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
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2" dir={direction}>{t('browse.noResults')}</h3>
                <p className="text-muted-foreground mb-4" dir={direction}>
                  {t('browse.changeFilters')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedLocation("all")
                    setPriceRange({ min: "", max: "" })
                  }}
                  dir={direction}
                >
                  {t('browse.clearFilters')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Image */}
                  <div className="aspect-video bg-muted overflow-hidden">
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
                        <Badge variant="secondary">{categories.find(c => c.value === listing.category)?.label}</Badge>
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
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleContactSeller(listing)}
                      dir={direction}
                    >
                      <Phone className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      {t('browse.contact')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toggleFavorite(listing.id)}
                      className={favorites.includes(listing.id) ? "text-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(listing.id) ? "fill-current" : ""}`} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}