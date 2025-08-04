import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageCarousel } from "./ImageCarousel"
import { MapPin, Phone, Mail, Heart, Calendar, Star, Eye, Share2, Flag } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from 'sonner'

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

interface ListingModalProps {
  listing: Listing | null
  isOpen: boolean
  onClose: () => void
  onContactSeller: (listing: Listing) => void
  onToggleFavorite: (listingId: string) => void
  isFavorite: boolean
  viewCount?: number
  onShare?: () => void
  onReport?: () => void
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
  isFavorite,
  viewCount = 0,
  onShare,
  onReport
}: ListingModalProps) => {
  const { user } = useAuth()
  const { t, direction } = useLanguage()

  if (!listing) return null

  const categoryLabel = categories.find(c => c.value === listing.category)?.label || listing.category
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `${listing.title} - ₪${listing.price.toLocaleString()}`,
        url: window.location.href
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('קישור המודעה הועתק ללוח')
    }
    onShare?.()
  }

  const handleReport = () => {
    toast.info('תודה על הדיווח, נבדוק את המודעה')
    onReport?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
        <DialogHeader className="pb-0">
          <div className="flex items-start justify-between">
            <DialogTitle className={`text-2xl font-bold flex-1 ${direction === 'rtl' ? 'hebrew-text text-right' : 'text-left'}`}>
              {listing.title}
            </DialogTitle>
            <div className="flex items-center gap-2 ml-4">
              {listing.is_featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
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
          
          {/* Stats Bar */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{listing.view_count || 0} צפיות</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>פורסם ב-{formatDate(listing.created_at)}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images Section */}
          <div className="space-y-4">
            <ImageCarousel 
              images={listing.images} 
              title={listing.title} 
              className="w-full"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price and Basic Info */}
            <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-baseline gap-3 mb-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  ₪{listing.price.toLocaleString()}
                </div>
                <div className="text-lg text-muted-foreground">
                  {listing.category === 'real-estate' ? 'לחודש' : ''}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">{categoryLabel}</Badge>
                {listing.subcategory && (
                  <Badge variant="outline">{listing.subcategory}</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span className="hebrew-text">{listing.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <h3 className="text-lg font-semibold mb-3 hebrew-text">תיאור</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-muted-foreground leading-relaxed hebrew-text whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <h3 className="text-lg font-semibold mb-3 hebrew-text">פרטי יצירת קשר</h3>
              {user ? (
                (listing.contact_phone || listing.contact_email) ? (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    {listing.contact_phone && (
                      <div className="flex items-center gap-3 p-2 bg-background rounded-md">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="font-mono font-medium">{listing.contact_phone}</span>
                      </div>
                    )}
                    {listing.contact_email && (
                      <div className="flex items-center gap-3 p-2 bg-background rounded-md">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="break-all">{listing.contact_email}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground">אין פרטי יצירת קשר זמינים</p>
                  </div>
                )
              ) : (
                <div className="bg-muted/30 rounded-lg p-4 text-center space-y-2">
                  <div className="w-8 h-8 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground hebrew-text">
                    רק משתמשים רשומים יכולים לראות פרטי יצירת קשר
                  </p>
                  <p className="text-sm text-muted-foreground">
                    התחבר כדי לצפות במספרי טלפון ואימייל
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
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
                  className={isFavorite ? "text-red-500 border-red-500 bg-red-50" : "hover:text-red-500 hover:border-red-500"}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  שתף
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleReport}
                  className="flex-1"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  דווח
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}