import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useLanguage } from '@/contexts/LanguageContext'
import { toast } from 'sonner'

interface ImageCarouselProps {
  images: string[]
  title: string
  className?: string
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  title, 
  className = '' 
}) => {
  const { direction } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({})
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <div className="text-center text-muted-foreground">
          <ZoomIn className="w-16 h-16 mx-auto mb-2" />
          <p>אין תמונות זמינות</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (direction === 'rtl') {
      if (isLeftSwipe) nextImage()
      if (isRightSwipe) prevImage()
    } else {
      if (isLeftSwipe) prevImage()
      if (isRightSwipe) nextImage()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      direction === 'rtl' ? nextImage() : prevImage()
    } else if (e.key === 'ArrowRight') {
      direction === 'rtl' ? prevImage() : nextImage()
    } else if (e.key === 'Escape') {
      setIsFullscreen(false)
    }
  }

  React.useEffect(() => {
    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, direction])

  const handleImageLoad = (index: number) => {
    setIsLoading(prev => ({ ...prev, [index]: false }))
  }

  const handleImageError = (index: number) => {
    setIsLoading(prev => ({ ...prev, [index]: false }))
    toast.error('שגיאה בטעינת התמונה')
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = images[currentIndex]
    link.download = `${title}-image-${currentIndex + 1}.jpg`
    link.click()
  }

  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: images[currentIndex]
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(images[currentIndex])
      toast.success('קישור התמונה הועתק ללוח')
    }
  }

  return (
    <>
      {/* Main Carousel */}
      <div className={`relative group ${className}`}>
        <div 
          className="aspect-video bg-muted overflow-hidden rounded-lg relative cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsFullscreen(true)}
        >
          {isLoading[currentIndex] && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <img
            src={images[currentIndex]}
            alt={`${title} - תמונה ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onLoad={() => handleImageLoad(currentIndex)}
            onError={() => handleImageError(currentIndex)}
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 ${
                  direction === 'rtl' ? 'right-2' : 'left-2'
                } bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm`}
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 ${
                  direction === 'rtl' ? 'left-2' : 'right-2'
                } bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm`}
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} מתוך {images.length}
            </div>
          )}

          {/* Zoom Indicator */}
          <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ZoomIn className="w-4 h-4" />
          </div>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToImage(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentIndex === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`עבור לתמונה ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                  currentIndex === index 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img 
                  src={image} 
                  alt={`תמונה ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={downloadImage}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={shareImage}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Fullscreen Image */}
            <img
              src={images[currentIndex]}
              alt={`${title} - תמונה ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    direction === 'rtl' ? 'right-4' : 'left-4'
                  } bg-black/50 hover:bg-black/70 text-white rounded-full p-3`}
                  onClick={prevImage}
                >
                  {direction === 'rtl' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    direction === 'rtl' ? 'left-4' : 'right-4'
                  } bg-black/50 hover:bg-black/70 text-white rounded-full p-3`}
                  onClick={nextImage}
                >
                  {direction === 'rtl' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </Button>
              </>
            )}

            {/* Fullscreen Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-lg font-medium backdrop-blur-sm">
                {currentIndex + 1} מתוך {images.length}
              </div>
            )}

            {/* Fullscreen Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      currentIndex === index 
                        ? 'border-white shadow-lg' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`תמונה ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}