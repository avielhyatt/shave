import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { User, Mail, Phone, Globe, Calendar, MapPin } from 'lucide-react'
import { Navigate } from 'react-router-dom'

interface ProfileData {
  full_name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  date_of_birth: string
  gender: string
  preferred_language: string
  avatar_url: string
  notification_preferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export default function Profile() {
  const { user, loading } = useAuth()
  const { language } = useLanguage()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    date_of_birth: '',
    gender: '',
    preferred_language: 'he',
    avatar_url: '',
    notification_preferences: {
      email: true,
      sms: false,
      push: true
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [profileExists, setProfileExists] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error)
      return
    }

    if (data) {
      setProfileExists(true)
      setProfileData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
        preferred_language: data.preferred_language || 'he',
        avatar_url: data.avatar_url || '',
        notification_preferences: (data.notification_preferences as any) || {
          email: true,
          sms: false,
          push: true
        }
      })
    } else {
      // Profile doesn't exist, use user's email
      setProfileData(prev => ({
        ...prev,
        email: user.email || ''
      }))
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    
    try {
      const profilePayload = {
        user_id: user.id,
        full_name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        date_of_birth: profileData.date_of_birth || null,
        gender: profileData.gender || null,
        preferred_language: profileData.preferred_language,
        avatar_url: profileData.avatar_url,
        notification_preferences: profileData.notification_preferences
      }

      let result
      if (profileExists) {
        result = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('user_id', user.id)
      } else {
        result = await supabase
          .from('profiles')
          .insert(profilePayload)
        setProfileExists(true)
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: language === 'he' ? 'הפרופיל נשמר בהצלחה' : 'Profile saved successfully',
        description: language === 'he' ? 'הפרטים שלך עודכנו' : 'Your profile has been updated'
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: language === 'he' ? 'שגיאה בשמירה' : 'Error saving profile',
        description: language === 'he' ? 'אנא נסה שוב מאוחר יותר' : 'Please try again later',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">טוען...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {language === 'he' ? 'פרופיל אישי' : 'Personal Profile'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'he' ? 'ערוך ועדכן את הפרטים האישיים שלך' : 'Edit and update your personal information'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {language === 'he' ? 'מידע בסיסי' : 'Basic Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar_url} />
                  <AvatarFallback>
                    {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar_url">{language === 'he' ? 'קישור לתמונת פרופיל' : 'Profile Image URL'}</Label>
                  <Input
                    id="avatar_url"
                    value={profileData.avatar_url}
                    onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                    placeholder={language === 'he' ? 'הכנס קישור לתמונה' : 'Enter image URL'}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">{language === 'he' ? 'שם מלא' : 'Full Name'}</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder={language === 'he' ? 'הכנס שם מלא' : 'Enter full name'}
                  />
                </div>

                <div>
                  <Label htmlFor="email">{language === 'he' ? 'כתובת אימייל' : 'Email Address'}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={language === 'he' ? 'הכנס כתובת אימייל' : 'Enter email address'}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{language === 'he' ? 'מספר טלפון' : 'Phone Number'}</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder={language === 'he' ? 'הכנס מספר טלפון' : 'Enter phone number'}
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth">{language === 'he' ? 'תאריך לידה' : 'Date of Birth'}</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profileData.date_of_birth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">{language === 'he' ? 'מגדר' : 'Gender'}</Label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'he' ? 'בחר מגדר' : 'Select gender'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{language === 'he' ? 'זכר' : 'Male'}</SelectItem>
                      <SelectItem value="female">{language === 'he' ? 'נקבה' : 'Female'}</SelectItem>
                      <SelectItem value="other">{language === 'he' ? 'אחר' : 'Other'}</SelectItem>
                      <SelectItem value="prefer_not_to_say">{language === 'he' ? 'מעדיף לא לציין' : 'Prefer not to say'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferred_language">{language === 'he' ? 'שפה מועדפת' : 'Preferred Language'}</Label>
                  <Select value={profileData.preferred_language} onValueChange={(value) => setProfileData(prev => ({ ...prev, preferred_language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he">עברית</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">{language === 'he' ? 'אודות' : 'About'}</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={language === 'he' ? 'ספר על עצמך...' : 'Tell us about yourself...'}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {language === 'he' ? 'מיקום ואתרים' : 'Location & Links'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">{language === 'he' ? 'מיקום' : 'Location'}</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={language === 'he' ? 'הכנס מיקום' : 'Enter location'}
                />
              </div>

              <div>
                <Label htmlFor="website">{language === 'he' ? 'אתר אינטרנט' : 'Website'}</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder={language === 'he' ? 'הכנס קישור לאתר' : 'Enter website URL'}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'he' ? 'העדפות התראות' : 'Notification Preferences'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === 'he' ? 'התראות באימייל' : 'Email Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'he' ? 'קבל התראות על הודעות חדשות ומודעות' : 'Receive notifications about new messages and listings'}
                  </p>
                </div>
                <Switch
                  checked={profileData.notification_preferences.email}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, email: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === 'he' ? 'התראות SMS' : 'SMS Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'he' ? 'קבל התראות חשובות בהודעות SMS' : 'Receive important notifications via SMS'}
                  </p>
                </div>
                <Switch
                  checked={profileData.notification_preferences.sms}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, sms: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{language === 'he' ? 'התראות דחיפה' : 'Push Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'he' ? 'קבל התראות בדפדפן' : 'Receive browser push notifications'}
                  </p>
                </div>
                <Switch
                  checked={profileData.notification_preferences.push}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, push: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? (language === 'he' ? 'שומר...' : 'Saving...') : (language === 'he' ? 'שמור פרופיל' : 'Save Profile')}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}