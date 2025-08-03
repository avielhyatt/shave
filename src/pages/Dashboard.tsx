import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Plus, MessageCircle, Heart, Settings, Edit, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface Listing {
  id: string
  title: string
  price: number
  category: string
  location: string
  is_featured: boolean
  is_sold: boolean
  created_at: string
  images: string[]
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchUserListings()
  }, [user, navigate])

  const fetchUserListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)

      if (error) throw error

      setListings(listings.filter(listing => listing.id !== listingId))
      toast({
        title: "המודעה נמחקה בהצלחה",
        description: "המודעה הוסרה מהאתר",
      })
    } catch (error) {
      toast({
        title: "שגיאה במחיקת המודעה",
        description: "נסה שוב מאוחר יותר",
        variant: "destructive"
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold hebrew-text">הדשבורד שלי</h1>
              <p className="text-muted-foreground mt-2">
                ברוך הבא {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/post-ad">
                  <Plus className="w-4 h-4 ml-2" />
                  פרסם מודעה חדשה
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                התנתק
              </Button>
            </div>
          </div>

          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="listings">המודעות שלי</TabsTrigger>
              <TabsTrigger value="favorites">מועדפים</TabsTrigger>
              <TabsTrigger value="messages">הודעות</TabsTrigger>
              <TabsTrigger value="settings">הגדרות</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    המודעות שלי ({listings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">טוען מודעות...</div>
                  ) : listings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">עדיין לא פרסמת מודעות</p>
                      <Button asChild>
                        <Link to="/post-ad">
                          <Plus className="w-4 h-4 ml-2" />
                          פרסם את המודעה הראשונה שלך
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {listings.map((listing) => (
                        <Card key={listing.id} className="group hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            {listing.images.length > 0 && (
                              <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                                <img 
                                  src={listing.images[0]} 
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteListing(listing.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-lg font-bold text-primary">
                                ₪{listing.price.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{listing.category}</Badge>
                                {listing.is_featured && (
                                  <Badge className="bg-yellow-500">מומלץ</Badge>
                                )}
                                {listing.is_sold && (
                                  <Badge variant="destructive">נמכר</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{listing.location}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(listing.created_at).toLocaleDateString('he-IL')}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    מודעות מועדפות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">עדיין לא שמרת מודעות מועדפות</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    הודעות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">אין הודעות חדשות</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    הגדרות חשבון
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">פרטי חשבון</h3>
                    <p className="text-sm text-muted-foreground">אימייל: {user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      הצטרף: {new Date(user.created_at).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="destructive" onClick={handleSignOut}>
                      התנתק מהחשבון
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}