import React, { useState } from 'react'
import { Search, MapPin, Filter, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { useLanguage } from '@/contexts/LanguageContext'

interface SearchFilters {
  query: string
  category: string
  location: string
  minPrice: number
  maxPrice: number
  sortBy: string
  onlyFeatured: boolean
  onlyWithImages: boolean
}

interface AdvancedSearchBarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  className?: string
}

const categories = [
  { value: "", label: "כל הקטגוריות" },
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

const locations = [
  { value: "", label: "כל הארץ" },
  { value: "tel-aviv", label: "תל אביב" },
  { value: "jerusalem", label: "ירושלים" },
  { value: "haifa", label: "חיפה" },
  { value: "beer-sheva", label: "באר שבע" },
  { value: "netanya", label: "נתניה" },
  { value: "ashdod", label: "אשדוד" },
  { value: "petah-tikva", label: "פתח תקווה" },
  { value: "rishon-lezion", label: "ראשון לציון" },
  { value: "ashkelon", label: "אשקלון" },
  { value: "rehovot", label: "רחובות" }
]

const sortOptions = [
  { value: "newest", label: "החדשים ביותר" },
  { value: "oldest", label: "הישנים ביותר" },
  { value: "price-low", label: "מחיר: נמוך לגבוה" },
  { value: "price-high", label: "מחיר: גבוה לנמוך" },
  { value: "featured", label: "מומלצים" }
]

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  className = ''
}) => {
  const { direction } = useLanguage()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
    
    // Count active filters
    let count = 0
    if (newFilters.category) count++
    if (newFilters.location) count++
    if (newFilters.minPrice > 0 || newFilters.maxPrice < 10000000) count++
    if (newFilters.onlyFeatured) count++
    if (newFilters.onlyWithImages) count++
    setActiveFiltersCount(count)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      query: filters.query,
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 10000000,
      sortBy: 'newest',
      onlyFeatured: false,
      onlyWithImages: false
    })
    setActiveFiltersCount(0)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className={`bg-background border rounded-lg shadow-lg ${className}`}>
      {/* Main Search Bar */}
      <div className="flex items-center gap-2 p-4">
        <div className="flex-1 relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${
            direction === 'rtl' ? 'right-3' : 'left-3'
          }`} />
          <Input
            placeholder="חפש מודעות..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            onKeyPress={handleKeyPress}
            className={`${direction === 'rtl' ? 'pr-10' : 'pl-10'} h-12 text-lg`}
          />
        </div>

        {/* Quick Filters */}
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className="w-48 h-12">
            <SelectValue placeholder="קטגוריה" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
          <SelectTrigger className="w-40 h-12">
            <MapPin className="w-4 h-4 mr-2" />
            <SelectValue placeholder="מיקום" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="h-12 relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              פילטרים
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-6" align="end">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">פילטרים מתקדמים</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-2" />
                    נקה הכל
                  </Button>
                )}
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium">טווח מחירים</label>
                <div className="space-y-3">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => {
                      updateFilter('minPrice', min)
                      updateFilter('maxPrice', max)
                    }}
                    max={10000000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>₪{filters.minPrice.toLocaleString()}</span>
                    <span>-</span>
                    <span>₪{filters.maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium">מיון לפי</label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Filters */}
              <div className="space-y-4">
                <label className="text-sm font-medium">אפשרויות נוספות</label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.onlyFeatured}
                    onCheckedChange={(checked) => updateFilter('onlyFeatured', checked)}
                  />
                  <label htmlFor="featured" className="text-sm cursor-pointer">
                    רק מודעות מומלצות
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="withImages"
                    checked={filters.onlyWithImages}
                    onCheckedChange={(checked) => updateFilter('onlyWithImages', checked)}
                  />
                  <label htmlFor="withImages" className="text-sm cursor-pointer">
                    רק מודעות עם תמונות
                  </label>
                </div>
              </div>

              <Button onClick={() => { onSearch(); setIsFilterOpen(false) }} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                חפש עכשיו
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button onClick={onSearch} size="lg" className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80">
          <Search className="w-5 h-5 mr-2" />
          חפש
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">פילטרים פעילים:</span>
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                {categories.find(c => c.value === filters.category)?.label}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('category', '')}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                {locations.find(l => l.value === filters.location)?.label}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('location', '')}
                />
              </Badge>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 10000000) && (
              <Badge variant="secondary" className="gap-1">
                ₪{filters.minPrice.toLocaleString()} - ₪{filters.maxPrice.toLocaleString()}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    updateFilter('minPrice', 0)
                    updateFilter('maxPrice', 10000000)
                  }}
                />
              </Badge>
            )}
            {filters.onlyFeatured && (
              <Badge variant="secondary" className="gap-1">
                מומלצות
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('onlyFeatured', false)}
                />
              </Badge>
            )}
            {filters.onlyWithImages && (
              <Badge variant="secondary" className="gap-1">
                עם תמונות
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('onlyWithImages', false)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}