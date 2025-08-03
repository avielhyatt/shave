import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Heart, MapPin, Share2, X, Info, Eye } from "lucide-react"
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

interface MarketplaceViewProps {
  listings: Listing[]
  onContactSeller: (listing: Listing) => void
  onToggleFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  onViewDetails: (listing: Listing) => void
  onClose: () => void
}

export const MarketplaceView = ({
  listings,
  onContactSeller,
  onToggleFavorite,
  isFavorite,
  onViewDetails,
  onClose
}: MarketplaceViewProps) => {
  const { direction } = useLanguage()
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)

  const currentListing = listings[currentIndex]

  const handleNext = () => {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setImageIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setImageIndex(0)
    }
  }

  const handleImageNext = () => {
    if (currentListing && imageIndex < currentListing.images.length - 1) {
      setImageIndex(imageIndex + 1)
    }
  }

  const handleImagePrevious = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1)
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleNext()
    } else {
      handlePrevious()
    }
  }

  const handleShare = () => {
    if (currentListing) {
      if (navigator.share) {
        navigator.share({
          title: currentListing.title,
          text: `${currentListing.title} - ₪${currentListing.price.toLocaleString()}`,
          url: window.location.href
        }).catch(console.error)
      } else {
        navigator.clipboard.writeText(window.location.href)
        toast.success('קישור המודעה הועתק ללוח')
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNext()
      } else if (e.key === 'ArrowRight') {
        handlePrevious()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  if (!currentListing) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-background" dir={direction}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} מתוך {listings.length}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onViewDetails(currentListing)}>
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32 h-full overflow-hidden">
        <div className="relative h-full">
          {/* Image Section */}
          <div className="h-2/3 relative">
            {currentListing.images.length > 0 ? (
              <div className="relative h-full">
                <img
                  src={currentListing.images[imageIndex]}
                  alt={currentListing.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {currentListing.images.length > 1 && (
                  <>
                    <button
                      onClick={handleImagePrevious}
                      disabled={imageIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 disabled:opacity-50"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleImageNext}
                      disabled={imageIndex === currentListing.images.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 disabled:opacity-50"
                    >
                      →
                    </button>
                    
                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {currentListing.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === imageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {currentListing.is_featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-large">
                      מומלץ
                    </Badge>
                  )}
                  {currentListing.is_sold && (
                    <Badge variant="destructive">נמכר</Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-24 h-24 bg-muted-foreground/20 rounded-lg mx-auto mb-4"></div>
                  <p>אין תמונות זמינות</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="h-1/3 bg-background border-t">
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold hebrew-text mb-2">
                      {currentListing.title}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="hebrew-text">{currentListing.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-3xl font-bold text-primary">
                      ₪{currentListing.price.toLocaleString()}
                    </div>
                    {currentListing.view_count && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Eye className="w-3 h-3" />
                        <span>{currentListing.view_count} צפיות</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground hebrew-text leading-relaxed">
                  {currentListing.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onToggleFavorite(currentListing.id)}
            className={isFavorite(currentListing.id) ? "text-red-500 border-red-500 bg-red-50" : ""}
          >
            <Heart className={`w-5 h-5 ${isFavorite(currentListing.id) ? "fill-current" : ""}`} />
          </Button>
          
          <Button
            className="flex-1 gradient-primary text-white shadow-large"
            onClick={() => onContactSeller(currentListing)}
            disabled={!user}
          >
            {user ? 'צור קשר' : 'התחבר כדי ליצור קשר'}
          </Button>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {listings.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Navigation Areas */}
      <button
        onClick={() => handleSwipe('right')}
        disabled={currentIndex === 0}
        className="absolute left-0 top-20 bottom-32 w-20 bg-transparent disabled:cursor-not-allowed"
        aria-label="מודעה קודמת"
      />
      <button
        onClick={() => handleSwipe('left')}
        disabled={currentIndex === listings.length - 1}
        className="absolute right-0 top-20 bottom-32 w-20 bg-transparent disabled:cursor-not-allowed"
        aria-label="מודעה הבאה"
      />
    </div>
  )
}