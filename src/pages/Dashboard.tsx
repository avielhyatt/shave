import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Plus, MessageCircle, Heart, Settings, Edit, Trash2, Eye, TrendingUp } from "lucide-react"
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
  view_count?: number
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { t, direction, language } = useLanguage()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalViews: 0, totalListings: 0, activeListings: 0 })
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
      
      // Calculate stats
      const totalViews = data?.reduce((sum, listing) => sum + (listing.view_count || 0), 0) || 0
      const activeListings = data?.filter(listing => !listing.is_sold).length || 0
      setStats({
        totalViews,
        totalListings: data?.length || 0,
        activeListings
      })
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
        title: t('dashboard.deleteSuccess'),
        description: "המודעה הוסרה מהאתר",
      })
    } catch (error) {
      toast({
        title: t('dashboard.deleteError'),
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
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : ''}`} dir={direction}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" dir={direction}>{t('dashboard.title')}</h1>
              <p className="text-muted-foreground mt-2" dir={direction}>
                {t('dashboard.welcome')} {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/post-ad" dir={direction}>
                  <Plus className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('dashboard.postNew')}
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut} dir={direction}>
                {t('dashboard.signOut')}
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalViews}</p>
                    <p className="text-sm text-muted-foreground">סה״כ צפיות</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Edit className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeListings}</p>
                    <p className="text-sm text-muted-foreground">מודעות פעילות</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalListings}</p>
                    <p className="text-sm text-muted-foreground">סה״כ מודעות</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="listings" dir={direction}>{t('dashboard.myListings')}</TabsTrigger>
              <TabsTrigger value="favorites" dir={direction}>{t('dashboard.favorites')}</TabsTrigger>
              <TabsTrigger value="messages" dir={direction}>{t('dashboard.messages')}</TabsTrigger>
              <TabsTrigger value="settings" dir={direction}>{t('dashboard.settings')}</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={direction}>
                    <Edit className="w-5 h-5" />
                    {t('dashboard.myListings')} ({listings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8" dir={direction}>{t('dashboard.loading')}</div>
                  ) : listings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4" dir={direction}>{t('dashboard.noListings')}</p>
                      <Button asChild>
                        <Link to="/post-ad" dir={direction}>
                          <Plus className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                          {t('dashboard.postFirst')}
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
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    asChild
                                  >
                                    <Link to={`/edit-listing/${listing.id}`}>
                                      <Edit className="w-4 h-4" />
                                    </Link>
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
                                    <Badge className="bg-yellow-500" dir={direction}>{t('dashboard.featured')}</Badge>
                                  )}
                                  {listing.is_sold && (
                                    <Badge variant="destructive" dir={direction}>{t('dashboard.sold')}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">{listing.location}</p>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    <span>{listing.view_count || 0}</span>
                                  </div>
                                </div>
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
                  <CardTitle className="flex items-center gap-2" dir={direction}>
                    <Heart className="w-5 h-5" />
                    {t('dashboard.favorites')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground" dir={direction}>{t('favorites.noFavorites')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={direction}>
                    <MessageCircle className="w-5 h-5" />
                    {t('dashboard.messages')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground" dir={direction}>{t('messages.noConversations')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir={direction}>
                    <Settings className="w-5 h-5" />
                    {t('dashboard.settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" dir={direction}>{t('dashboard.accountDetails')}</h3>
                  <p className="text-sm text-muted-foreground" dir={direction}>{t('dashboard.email')}: {user.email}</p>
                  <p className="text-sm text-muted-foreground" dir={direction}>
                    {t('dashboard.joined')}: {new Date(user.created_at).toLocaleDateString(direction === 'rtl' ? 'he-IL' : 'en-US')}
                  </p>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" onClick={() => navigate('/profile')} className="w-full" dir={direction}>
                    {direction === 'rtl' ? 'ערוך פרופיל' : 'Edit Profile'}
                  </Button>
                  <Button variant="destructive" onClick={handleSignOut} dir={direction}>
                    {t('dashboard.signOutAccount')}
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