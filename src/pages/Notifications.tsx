import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { AlertsManager } from "@/components/alerts/AlertsManager"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, TrendingUp, Heart, Eye, Share, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

interface RecentActivity {
  id: string
  type: 'view' | 'favorite' | 'message' | 'listing'
  title: string
  description: string
  timestamp: string
  icon: any
}

export default function Notifications() {
  const { user } = useAuth()
  const { t, direction } = useLanguage()
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for recent activity
  const mockActivity: RecentActivity[] = [
    {
      id: "1",
      type: "view",
      title: "iPhone 14 Pro נצפה על ידי 5 משתמשים",
      description: "המודעה שלך זוכה לתשומת לב",
      timestamp: "לפני 2 שעות",
      icon: Eye
    },
    {
      id: "2", 
      type: "favorite",
      title: "המודעה שלך נשמרה כמועדפת",
      description: "דירת 3 חדרים בתל אביב",
      timestamp: "לפני 4 שעות",
      icon: Heart
    },
    {
      id: "3",
      type: "message",
      title: "הודעה חדשה מיואב כהן",
      description: "בנוגע למכונית טויוטה קמרי",
      timestamp: "אתמול",
      icon: Bell
    }
  ]

  useEffect(() => {
    if (!user) return
    
    // In a real app, fetch user's recent activity from Supabase
    setRecentActivity(mockActivity)
    setLoading(false)
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir={direction}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">יש להתחבר כדי לצפות בהתראות</h1>
            <Button asChild>
              <Link to="/">חזור לעמוד הבית</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="w-8 h-8" />
              התראות ופעילות
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/browse">חזור לדפדוף</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">דשבורד</Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="alerts">התראות חכמות</TabsTrigger>
              <TabsTrigger value="activity">פעילות אחרונה</TabsTrigger>
              <TabsTrigger value="stats">סטטיסטיקות</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="mt-6">
              <AlertsManager />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    פעילות אחרונה
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">טוען פעילות...</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">אין פעילות אחרונה</h3>
                      <p className="text-muted-foreground mb-4">
                        התחילו לפרסם מודעות כדי לראות פעילות
                      </p>
                      <Button asChild>
                        <Link to="/post-ad">פרסמו מודעה</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => {
                        const Icon = activity.icon;
                        return (
                          <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium mb-1">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                            </div>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold mb-1">1,234</div>
                    <div className="text-sm text-muted-foreground">צפיות כוללות</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold mb-1">89</div>
                    <div className="text-sm text-muted-foreground">שמירות כמועדף</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Share className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold mb-1">45</div>
                    <div className="text-sm text-muted-foreground">שיתופים</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold mb-1">12</div>
                    <div className="text-sm text-muted-foreground">פניות</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>המודעות הפופולריות שלך השבוע</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "iPhone 14 Pro 256GB", views: 245, favorites: 18, location: "תל אביב" },
                      { title: "דירת 3 חדרים מרוהטת", views: 189, favorites: 31, location: "ירושלים" },
                      { title: "רנו קליאו 2020", views: 156, favorites: 12, location: "חיפה" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{item.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.views} צפיות
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {item.favorites} מועדפים
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item.location}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    ))}
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