import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Upload, X, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const categories = [
  { value: "real-estate", label: "נדל״ן", subcategories: ["דירות למכירה", "דירות להשכרה", "בתים למכירה", "קרקעות"] },
  { value: "vehicles", label: "רכב", subcategories: ["מכוניות", "אופנועים", "רכב מסחרי", "חלקי חילוף"] },
  { value: "electronics", label: "אלקטרוניקה", subcategories: ["מחשבים", "טלפונים", "טלוויזיות", "קונסולות"] },
  { value: "furniture", label: "רהיטים", subcategories: ["סלון", "חדר שינה", "מטבח", "משרד"] },
  { value: "jobs", label: "עבודה", subcategories: ["משרות מלאות", "משרות חלקיות", "פרילנס", "סטאז׳"] },
  { value: "services", label: "שירותים", subcategories: ["ניקיון", "שיפוצים", "גינון", "חינוך"] }
]

const israeliCities = [
  "תל אביב", "ירושלים", "חיפה", "ראשון לציון", "אשדוד", "נתניה", "באר שבע", "בני ברק",
  "חולון", "רמת גן", "אשקלון", "רחובות", "בת ים", "בית שמש", "כפר סבא", "חדרה",
  "מודיעין", "נצרת", "לוד", "רמלה", "הרצליה", "קריות", "טבריה", "עפולה"
]

export default function PostAd() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [location, setLocation] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    
    // Pre-fill email from user profile
    setContactEmail(user.email)
  }, [user, navigate])

  const selectedCategory = categories.find(cat => cat.value === category)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 8) {
      toast({
        title: "יותר מדי תמונות",
        description: "ניתן להעלות עד 8 תמונות",
        variant: "destructive"
      })
      return
    }

    setImages([...images, ...files])
    
    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setImageUrls(prev => [...prev, url])
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const image of images) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `listings/${fileName}`

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, image)

      if (error) {
        throw error
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      uploadedUrls.push(data.publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload images first
      const uploadedImageUrls = await uploadImages()

      // Create listing
      const { error } = await supabase
        .from('listings')
        .insert({
          user_id: user!.id,
          title,
          description,
          price: parseInt(price),
          category,
          subcategory,
          location,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          images: uploadedImageUrls,
          is_featured: false,
          is_sold: false
        })

      if (error) throw error

      toast({
        title: "המודעה פורסמה בהצלחה!",
        description: "המודעה שלך עלתה לאוויר ונראית לכל המשתמשים",
      })

      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: "שגיאה בפרסום המודעה",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold hebrew-text">
                פרסם מודעה חדשה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">כותרת המודעה *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="תיאור קצר ומשיך של הפריט"
                      required
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">תיאור מפורט *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="תאר את הפריט בפירוט - מצב, גיל, מפרט וכו'"
                      rows={4}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">מחיר (₪) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        required
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">מיקום *</Label>
                      <Select value={location} onValueChange={setLocation} required>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר עיר" />
                        </SelectTrigger>
                        <SelectContent>
                          {israeliCities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">קטגוריה *</Label>
                    <Select value={category} onValueChange={(value) => {
                      setCategory(value)
                      setSubcategory("")
                    }} required>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory && (
                    <div>
                      <Label htmlFor="subcategory">תת-קטגוריה</Label>
                      <Select value={subcategory} onValueChange={setSubcategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר תת-קטגוריה" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory.subcategories.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <Label>תמונות (עד 8 תמונות)</Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`תמונה ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {images.length < 8 && (
                      <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">פרטי יצירת קשר</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">טלפון</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="050-1234567"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">אימייל</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="email@example.com"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    פרסם מודעה
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}