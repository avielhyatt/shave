import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
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

const categories = {
  he: [
    { value: "real-estate", label: "נדל״ן", subcategories: ["דירות למכירה", "דירות להשכרה", "בתים למכירה", "קרקעות"] },
    { value: "vehicles", label: "רכב", subcategories: ["מכוניות", "אופנועים", "רכב מסחרי", "חלקי חילוף"] },
    { value: "electronics", label: "אלקטרוניקה", subcategories: ["מחשבים", "טלפונים", "טלוויזיות", "קונסולות"] },
    { value: "furniture", label: "רהיטים", subcategories: ["סלון", "חדר שינה", "מטבח", "משרד"] },
    { value: "jobs", label: "עבודה", subcategories: ["משרות מלאות", "משרות חלקיות", "פרילנס", "סטאז׳"] },
    { value: "services", label: "שירותים", subcategories: ["ניקיון", "שיפוצים", "גינון", "חינוך"] }
  ],
  en: [
    { value: "real-estate", label: "Real Estate", subcategories: ["Apartments for Sale", "Apartments for Rent", "Houses for Sale", "Land"] },
    { value: "vehicles", label: "Vehicles", subcategories: ["Cars", "Motorcycles", "Commercial Vehicles", "Spare Parts"] },
    { value: "electronics", label: "Electronics", subcategories: ["Computers", "Phones", "TVs", "Consoles"] },
    { value: "furniture", label: "Furniture", subcategories: ["Living Room", "Bedroom", "Kitchen", "Office"] },
    { value: "jobs", label: "Jobs", subcategories: ["Full Time", "Part Time", "Freelance", "Internship"] },
    { value: "services", label: "Services", subcategories: ["Cleaning", "Renovations", "Gardening", "Education"] }
  ]
}

const israeliCities = {
  he: [
    "תל אביב", "ירושלים", "חיפה", "ראשון לציון", "אשדוד", "נתניה", "באר שבע", "בני ברק",
    "חולון", "רמת גן", "אשקלון", "רחובות", "בת ים", "בית שמש", "כפר סבא", "חדרה",
    "מודיעין", "נצרת", "לוד", "רמלה", "הרצליה", "קריות", "טבריה", "עפולה"
  ],
  en: [
    "Tel Aviv", "Jerusalem", "Haifa", "Rishon LeZion", "Ashdod", "Netanya", "Beer Sheva", "Bnei Brak",
    "Holon", "Ramat Gan", "Ashkelon", "Rehovot", "Bat Yam", "Beit Shemesh", "Kfar Saba", "Hadera",
    "Modi'in", "Nazareth", "Lod", "Ramla", "Herzliya", "Kiryat", "Tiberias", "Afula"
  ]
}

export default function PostAd() {
  const { user } = useAuth()
  const { t, language, direction } = useLanguage()
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
    // Pre-fill email from user profile if logged in
    if (user) {
      setContactEmail(user.email)
    }
  }, [user, navigate])

  const selectedCategory = categories[language].find(cat => cat.value === category)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 8) {
      toast({
        title: t('postAd.error.tooManyImages'),
        description: t('postAd.error.maxImages'),
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
        title: t('postAd.success.title'),
        description: t('postAd.success.description'),
      })

      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: t('postAd.error.title'),
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className={`text-3xl font-bold mb-4 ${direction === 'rtl' ? 'hebrew-text' : ''}`}>
              {t('postAd.loginRequired')}
            </h1>
            <p className={`text-muted-foreground mb-8 ${direction === 'rtl' ? 'hebrew-text' : ''}`}>
              {t('postAd.loginMessage')}
            </p>
            <div className={`bg-card p-8 rounded-lg shadow-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              <h2 className={`text-xl font-semibold mb-4 ${direction === 'rtl' ? 'hebrew-text' : ''}`}>
                {t('postAd.benefits.title')}
              </h2>
              <ul className={`${direction === 'rtl' ? 'text-right' : 'text-left'} space-y-3 mb-6 ${direction === 'rtl' ? 'hebrew-text' : ''}`} dir={direction}>
                <li>✓ {t('postAd.benefits.unlimited')}</li>
                <li>✓ {t('postAd.benefits.dashboard')}</li>
                <li>✓ {t('postAd.benefits.messages')}</li>
                <li>✓ {t('postAd.benefits.favorites')}</li>
                <li>✓ {t('postAd.benefits.stats')}</li>
              </ul>
            </div>
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
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${direction === 'rtl' ? 'hebrew-text' : ''}`}>
                {t('postAd.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">{t('postAd.form.title')}</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t('postAd.form.titlePlaceholder')}
                      required
                      dir={direction}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">{t('postAd.form.description')}</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('postAd.form.descriptionPlaceholder')}
                      rows={4}
                      required
                      dir={direction}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">{t('postAd.form.price')}</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        required
                        dir={direction}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">{t('postAd.form.location')}</Label>
                      <Select value={location} onValueChange={setLocation} required>
                        <SelectTrigger>
                          <SelectValue placeholder={t('postAd.form.selectCity')} />
                        </SelectTrigger>
                        <SelectContent>
                          {israeliCities[language].map(city => (
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
                    <Label htmlFor="category">{t('postAd.form.category')}</Label>
                    <Select value={category} onValueChange={(value) => {
                      setCategory(value)
                      setSubcategory("")
                    }} required>
                      <SelectTrigger>
                        <SelectValue placeholder={t('postAd.form.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[language].map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory && (
                    <div>
                      <Label htmlFor="subcategory">{t('postAd.form.subcategory')}</Label>
                      <Select value={subcategory} onValueChange={setSubcategory}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('postAd.form.selectSubcategory')} />
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
                  <Label>{t('postAd.form.images')}</Label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`${t('postAd.form.images')} ${index + 1}`}
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
                  <h3 className="font-semibold">{t('postAd.form.contactInfo')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">{t('postAd.form.phone')}</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder={t('postAd.form.phonePlaceholder')}
                        dir={direction}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">{t('postAd.form.email')}</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={t('postAd.form.emailPlaceholder')}
                        dir={direction}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    {t('postAd.form.submit')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    {t('postAd.form.cancel')}
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