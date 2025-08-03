import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X, MapPin, Eye, ArrowLeft, Phone, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

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
  view_count?: number
}

interface TinderViewProps {
  listings: Listing[]
  onBack: () => void
  onContactSeller: (listing: Listing) => void
}

const categories = [
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

export const TinderView = ({ listings, onBack, onContactSeller }: TinderViewProps) => {
  const { user } = useAuth()
  const { t, direction } = useLanguage()
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const constraintsRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchUserFavorites()
    }
  }, [user])

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

  const updateViewCount = async (listingId: string) => {
    try {
      await supabase.rpc('increment_view_count', { listing_id: listingId })
    } catch (error) {
      console.error('Error updating view count:', error)
    }
  }

  const handleSwipeLeft = () => {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      toast({
        title: "סוף המודעות",
        description: "בדקת את כל המודעות הזמינות"
      })
    }
  }

  const handleSwipeRight = async () => {
    const currentListing = listings[currentIndex]
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "כדי לשמור מודעות במועדפים יש להתחבר",
        variant: "destructive"
      })
      return
    }

    try {
      await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          listing_id: currentListing.id
        })
      
      setFavorites([...favorites, currentListing.id])
      toast({
        title: "נשמר למועדפים ❤️",
        description: currentListing.title
      })
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }

    if (currentIndex < listings.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleSwipeRight()
      } else {
        handleSwipeLeft()
      }
    }
    setDragOffset({ x: 0, y: 0 })
  }

  const handleCardClick = (listing: Listing) => {
    updateViewCount(listing.id)
  }

  const currentListing = listings[currentIndex]
  const categoryLabel = categories.find(c => c.value === currentListing?.category)?.label || currentListing?.category

  if (!currentListing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold">סיימת לעבור על כל המודעות!</h3>
          <p className="text-muted-foreground">חזור מאוחר יותר למודעות חדשות</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            חזור לדפדוף רגיל
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          חזור
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-bold">מוד Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} מתוך {listings.length}
          </p>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Cards Stack */}
      <div className="relative max-w-sm mx-auto" ref={constraintsRef}>
        <AnimatePresence>
          {listings.slice(currentIndex, currentIndex + 3).map((listing, index) => (
            <motion.div
              key={listing.id}
              className="absolute inset-0"
              style={{
                zIndex: 3 - index,
                scale: 1 - index * 0.05,
                opacity: 1 - index * 0.3
              }}
              drag={index === 0}
              dragConstraints={constraintsRef}
              dragElastic={0.7}
              onDragEnd={index === 0 ? handleDragEnd : undefined}
              whileDrag={index === 0 ? { scale: 1.05 } : {}}
              onClick={() => handleCardClick(listing)}
              animate={index === 0 ? { x: dragOffset.x, y: dragOffset.y } : {}}
            >
              <Card className="w-full h-[600px] overflow-hidden shadow-2xl bg-card border-2">
                {/* Image */}
                <div className="relative h-2/3 bg-muted overflow-hidden">
                  {listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    {listing.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        ⭐ מומלץ
                      </Badge>
                    )}
                    {listing.view_count && (
                      <Badge variant="secondary" className="bg-background/80">
                        <Eye className="w-3 h-3 mr-1" />
                        {listing.view_count}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="h-1/3 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold line-clamp-2 mb-2">
                        {listing.title}
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        ₪{listing.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{categoryLabel}</Badge>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-2">
                    {user ? (
                      <div className="space-y-1">
                        {listing.contact_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            <span className="font-mono">{listing.contact_phone}</span>
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            onContactSeller(listing)
                          }}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          צור קשר
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Lock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          התחבר כדי לראות פרטי יצירת קשר
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
          onClick={handleSwipeLeft}
        >
          <X className="w-8 h-8" />
        </Button>
        
        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          onClick={handleSwipeRight}
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-full">
          גרור ימינה ❤️ או שמאלה ✖️ לדלג
        </p>
      </div>
    </div>
  )
}