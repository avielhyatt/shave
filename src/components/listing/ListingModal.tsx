import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { MapPin, Phone, Mail, Heart, Eye, Calendar, User } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

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

interface ListingModalProps {
  listing: Listing | null
  isOpen: boolean
  onClose: () => void
  onContactSeller: (listing: Listing) => void
  onToggleFavorite: (listingId: string) => void
  isFavorite: boolean
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

export const ListingModal = ({
  listing,
  isOpen,
  onClose,
  onContactSeller,
  onToggleFavorite,
  isFavorite
}: ListingModalProps) => {
  const { t, direction } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!listing) return null

  const categoryLabel = categories.find(c => c.value === listing.category)?.label || listing.category
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold ${direction === 'rtl' ? 'hebrew-text text-right' : 'text-left'}`}>
            {listing.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images Section */}
          <div className="space-y-4">
            {listing.images.length > 0 ? (
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {listing.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-video bg-muted overflow-hidden rounded-lg">
                          <img 
                            src={image} 
                            alt={`${listing.title} - תמונה ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {listing.images.length > 1 && (
                    <>
                      <CarouselPrevious className={direction === 'rtl' ? 'right-2 left-auto' : ''} />
                      <CarouselNext className={direction === 'rtl' ? 'left-2 right-auto' : ''} />
                    </>
                  )}
                </Carousel>
                
                {/* Image counter */}
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {listing.images.length}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {listing.is_featured && (
                    <Badge className="bg-shave-primary text-white">
                      מומלץ
                    </Badge>
                  )}
                  {listing.is_sold && (
                    <Badge variant="destructive">
                      נמכר
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
                <Eye className="w-16 h-16 text-muted-foreground" />
              </div>
            )}

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`תמונה ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price and Basic Info */}
            <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="text-4xl font-bold text-primary mb-4">
                ₪{listing.price.toLocaleString()}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{categoryLabel}</Badge>
                {listing.subcategory && (
                  <Badge variant="outline">{listing.subcategory}</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span className="hebrew-text">{listing.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span className="hebrew-text">פורסם ב-{formatDate(listing.created_at)}</span>
              </div>
            </div>

            {/* Description */}
            <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <h3 className="text-lg font-semibold mb-3 hebrew-text">תיאור</h3>
              <p className="text-muted-foreground leading-relaxed hebrew-text whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Contact Information */}
            {(listing.contact_phone || listing.contact_email) && (
              <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-semibold mb-3 hebrew-text">פרטי יצירת קשר</h3>
                <div className="space-y-2">
                  {listing.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono">{listing.contact_phone}</span>
                    </div>
                  )}
                  {listing.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="break-all">{listing.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1" 
                onClick={() => onContactSeller(listing)}
                dir={direction}
              >
                <Phone className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t('browse.contact')}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onToggleFavorite(listing.id)}
                className={isFavorite ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}