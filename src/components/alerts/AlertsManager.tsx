import { useState } from "react"
import { Bell, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/LanguageContext"

interface AlertSettings {
  keyword: string
  category: string
  priceMin: string
  priceMax: string
  location: string
  emailEnabled: boolean
  pushEnabled: boolean
}

export const AlertsManager = () => {
  const { t, direction } = useLanguage()
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<AlertSettings[]>([])
  const [newAlert, setNewAlert] = useState<AlertSettings>({
    keyword: '',
    category: '',
    priceMin: '',
    priceMax: '',
    location: '',
    emailEnabled: true,
    pushEnabled: true
  })
  const [showForm, setShowForm] = useState(false)

  const categories = [
    { value: "electronics", label: t('category.electronics') },
    { value: "real-estate", label: t('category.realEstate') },
    { value: "vehicles", label: t('category.vehicles') },
    { value: "jobs", label: t('category.jobs') },
    { value: "services", label: t('category.services') }
  ]

  const israeliCities = [
    "תל אביב", "ירושלים", "חיפה", "ראשון לציון", "אשדוד", "נתניה", "באר שבע"
  ]

  const handleCreateAlert = () => {
    if (!newAlert.keyword && !newAlert.category) {
      toast({
        title: "שגיאה",
        description: "יש להזין לפחות מילת חיפוש או קטגוריה",
        variant: "destructive"
      })
      return
    }

    setAlerts([...alerts, { ...newAlert }])
    setNewAlert({
      keyword: '',
      category: '',
      priceMin: '',
      priceMax: '',
      location: '',
      emailEnabled: true,
      pushEnabled: true
    })
    setShowForm(false)
    
    toast({
      title: "התראה נוצרה בהצלחה!",
      description: "תקבלו עדכונים על מודעות חדשות שמתאימות לקריטריונים"
    })
  }

  const handleDeleteAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index))
    toast({
      title: "התראה נמחקה",
      description: "ההתראה הוסרה בהצלחה"
    })
  }

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="text-2xl font-bold">התראות חכמות</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>
          יצירת התראה חדשה
        </Button>
      </div>

      {/* Existing Alerts */}
      <div className="grid gap-4">
        {alerts.map((alert, index) => (
          <Card key={index} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-4">
                    {alert.keyword && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                        "{alert.keyword}"
                      </span>
                    )}
                    {alert.category && (
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                        {categories.find(c => c.value === alert.category)?.label}
                      </span>
                    )}
                    {alert.location && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                        {alert.location}
                      </span>
                    )}
                  </div>
                  {(alert.priceMin || alert.priceMax) && (
                    <p className="text-sm text-muted-foreground">
                      טווח מחירים: {alert.priceMin ? `₪${alert.priceMin}` : '0'} - {alert.priceMax ? `₪${alert.priceMax}` : '∞'}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      📧 {alert.emailEnabled ? 'פעיל' : 'כבוי'}
                    </span>
                    <span className="flex items-center gap-1">
                      🔔 {alert.pushEnabled ? 'פעיל' : 'כבוי'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAlert(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">אין התראות פעילות</h3>
            <p className="text-muted-foreground mb-4">
              צרו התראות כדי לקבל עדכונים על מודעות חדשות שמעניינות אתכם
            </p>
            <Button onClick={() => setShowForm(true)}>
              יצירת התראה ראשונה
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create New Alert Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              יצירת התראה חדשה
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyword">מילת חיפוש</Label>
              <Input
                id="keyword"
                value={newAlert.keyword}
                onChange={(e) => setNewAlert({ ...newAlert, keyword: e.target.value })}
                placeholder="למשל: iPhone, דירה, מכונית"
                dir={direction}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>קטגוריה</Label>
                <Select value={newAlert.category} onValueChange={(value) => setNewAlert({ ...newAlert, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>מיקום</Label>
                <Select value={newAlert.location} onValueChange={(value) => setNewAlert({ ...newAlert, location: value })}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceMin">מחיר מינימלי (₪)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  value={newAlert.priceMin}
                  onChange={(e) => setNewAlert({ ...newAlert, priceMin: e.target.value })}
                  placeholder="0"
                  dir={direction}
                />
              </div>
              <div>
                <Label htmlFor="priceMax">מחיר מקסימלי (₪)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  value={newAlert.priceMax}
                  onChange={(e) => setNewAlert({ ...newAlert, priceMax: e.target.value })}
                  placeholder="ללא הגבלה"
                  dir={direction}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>הגדרות התראות</Label>
              <div className="flex items-center justify-between">
                <span>התראות במייל</span>
                <Switch
                  checked={newAlert.emailEnabled}
                  onCheckedChange={(checked) => setNewAlert({ ...newAlert, emailEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>התראות בדפדפן</span>
                <Switch
                  checked={newAlert.pushEnabled}
                  onCheckedChange={(checked) => setNewAlert({ ...newAlert, pushEnabled: checked })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateAlert} className="flex-1">
                יצירת התראה
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                ביטול
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
