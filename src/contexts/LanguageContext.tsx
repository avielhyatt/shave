import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'he' | 'en'
type Direction = 'rtl' | 'ltr'

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  he: {
    // Header
    'header.promo': 'חדש! פרסמו מודעות בחינם וקבלו חשיפה מקסימלית',
    // Navigation
    'nav.browse': 'דפדוף מודעות',
    'nav.post': 'פרסום מודעה',
    'nav.messages': 'הודעות',
    'nav.favorites': 'מועדפים',
    'nav.dashboard': 'הדשבורד שלי',
    'nav.login': 'התחברות',
    'nav.signup': 'הרשמה',
    
    // Dashboard
    'dashboard.title': 'הדשבורד שלי',
    'dashboard.welcome': 'ברוך הבא',
    'dashboard.postNew': 'פרסם מודעה חדשה',
    'dashboard.signOut': 'התנתק',
    'dashboard.myListings': 'המודעות שלי',
    'dashboard.favorites': 'מועדפים',
    'dashboard.messages': 'הודעות',
    'dashboard.settings': 'הגדרות',
    'dashboard.noListings': 'עדיין לא פרסמת מודעות',
    'dashboard.postFirst': 'פרסם את המודעה הראשונה שלך',
    'dashboard.loading': 'טוען מודעות...',
    'dashboard.featured': 'מומלץ',
    'dashboard.sold': 'נמכר',
    'dashboard.deleteSuccess': 'המודעה נמחקה בהצלחה',
    'dashboard.deleteError': 'שגיאה במחיקת המודעה',
    'dashboard.accountDetails': 'פרטי חשבון',
    'dashboard.email': 'אימייל',
    'dashboard.joined': 'הצטרף',
    'dashboard.signOutAccount': 'התנתק מהחשבון',
    
    // Favorites
    'favorites.title': 'המועדפים שלי',
    'favorites.backToBrowse': 'חזור לדפדוף',
    'favorites.noFavorites': 'אין עדיין מועדפים',
    'favorites.startSaving': 'התחל לשמור מודעות שמעניינות אותך',
    'favorites.searchAds': 'חפש מודעות',
    'favorites.found': 'נמצאו',
    'favorites.favoriteAds': 'מודעות מועדפות',
    'favorites.contact': 'צור קשר',
    'favorites.removeFavorite': 'הסר מועדף',
    'favorites.posted': 'פורסם',
    'favorites.loadError': 'שגיאה בטעינת המועדפים',
    'favorites.removeSuccess': 'הוסר מהמועדפים',
    'favorites.removeError': 'שגיאה בהסרת המועדף',
    
    // Messages
    'messages.title': 'הודעות',
    'messages.conversations': 'שיחות',
    'messages.noConversations': 'אין עדיין שיחות',
    'messages.chatWith': 'שיחה עם משתמש',
    'messages.selectChat': 'בחר שיחה כדי להתחיל לצטט',
    'messages.typeMessage': 'כתוב הודעה...',
    'messages.about': 'בנוגע ל',
    'messages.loadError': 'שגיאה בטעינת השיחות',
    'messages.sendError': 'שגיאה בשליחת ההודעה',
    'messages.loadingChats': 'טוען שיחות...',
    
    // Browse
    'browse.searchAds': 'חפש מודעות...',
    'browse.category': 'קטגוריה',
    'browse.location': 'מיקום',
    'browse.minPrice': 'מחיר מינימלי',
    'browse.maxPrice': 'מחיר מקסימלי',
    'browse.sort': 'מיון',
    'browse.newest': 'החדשות ביותר',
    'browse.oldest': 'הישנות ביותר',
    'browse.priceLowHigh': 'מחיר נמוך לגבוה',
    'browse.priceHighLow': 'מחיר גבוה לנמוך',
    'browse.found': 'נמצאו',
    'browse.ads': 'מודעות',
    'browse.postNewAd': 'פרסם מודעה חדשה',
    'browse.noResults': 'לא נמצאו תוצאות',
    'browse.changeFilters': 'נסה לשנות את הפילטרים או החיפוש',
    'browse.clearFilters': 'נקה פילטרים',
    'browse.contact': 'צור קשר',
    'browse.loginRequired': 'נדרשת התחברות',
    'browse.loginToSave': 'יש להתחבר כדי לשמור מועדפים',
    'browse.addedToFavorites': 'נוסף למועדפים',
    'browse.removedFromFavorites': 'הוסר מהמועדפים',
    'browse.error': 'שגיאה',
    'browse.cantUpdateFavorites': 'לא הצלחנו לעדכן את המועדפים',
    'browse.noContactInfo': 'אין פרטי יצירת קשר',
    'browse.sellerNoContact': 'המוכר לא השאיר פרטי יצירת קשר',
    'browse.loadError': 'שגיאה בטעינת המודעות',
    'browse.refreshPage': 'נסה לרענן את הדף',
    
    // Auth
    'auth.loginRequired': 'יש להתחבר כדי לצפות בדף זה',
    'auth.backHome': 'חזור לעמוד הבית',
    
    // Hero Section
    'hero.title': 'שווה לי - השוק הישראלי שלכם',
    'hero.subtitle': 'קנו, מכרו והשכירו בקלות ובביטחון',
    'hero.search': 'מה אתם מחפשים היום?',
    'hero.searchButton': 'חיפוש',
    'hero.postAd': 'פרסמו מודעה בחינם',
    'hero.stats.activeAds': 'מודעות פעילות',
    'hero.stats.users': 'משתמשים רשומים',
    'hero.stats.dailyAds': 'מודעות חדשות יומית',
    
    // Categories
    'categories.title': 'חקרו את הקטגוריות שלנו',
    'categories.subtitle': 'מצאו בדיוק מה שאתם מחפשים במגוון רחב של קטגוריות',
    'category.electronics': 'אלקטרוניקה',
    'category.realEstate': 'נדל״ן',
    'category.vehicles': 'רכב',
    'category.jobs': 'עבודה',
    'category.services': 'שירותים',
    'category.furniture': 'רהיטים',
    'category.all': 'כל הקטגוריות',
    
    // Common
    'common.contact': 'צור קשר',
    'common.price': 'מחיר',
    'common.location': 'מיקום',
    'common.description': 'תיאור',
    'common.title': 'כותרת',
    'common.save': 'שמור',
    'common.cancel': 'ביטול',
    'common.delete': 'מחק',
    'common.edit': 'עריכה',
    'common.loading': 'טוען...',
    'common.noResults': 'לא נמצאו תוצאות',
    
    // Footer
    'footer.about': 'אודות',
    'footer.contact': 'צור קשר',
    'footer.terms': 'תנאי שימוש',
    'footer.privacy': 'מדיניות פרטיות',
    'footer.help': 'עזרה',
  },
  en: {
    // Header
    'header.promo': 'New! Post ads for free and get maximum exposure',
    // Navigation
    'nav.browse': 'Browse Listings',
    'nav.post': 'Post Ad',
    'nav.messages': 'Messages',
    'nav.favorites': 'Favorites',
    'nav.dashboard': 'My Dashboard',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Dashboard
    'dashboard.title': 'My Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.postNew': 'Post New Ad',
    'dashboard.signOut': 'Sign Out',
    'dashboard.myListings': 'My Listings',
    'dashboard.favorites': 'Favorites',
    'dashboard.messages': 'Messages',
    'dashboard.settings': 'Settings',
    'dashboard.noListings': 'No listings posted yet',
    'dashboard.postFirst': 'Post your first listing',
    'dashboard.loading': 'Loading listings...',
    'dashboard.featured': 'Featured',
    'dashboard.sold': 'Sold',
    'dashboard.deleteSuccess': 'Listing deleted successfully',
    'dashboard.deleteError': 'Error deleting listing',
    'dashboard.accountDetails': 'Account Details',
    'dashboard.email': 'Email',
    'dashboard.joined': 'Joined',
    'dashboard.signOutAccount': 'Sign Out Account',
    
    // Favorites
    'favorites.title': 'My Favorites',
    'favorites.backToBrowse': 'Back to Browse',
    'favorites.noFavorites': 'No favorites yet',
    'favorites.startSaving': 'Start saving listings that interest you',
    'favorites.searchAds': 'Search Listings',
    'favorites.found': 'Found',
    'favorites.favoriteAds': 'favorite listings',
    'favorites.contact': 'Contact',
    'favorites.removeFavorite': 'Remove Favorite',
    'favorites.posted': 'Posted',
    'favorites.loadError': 'Error loading favorites',
    'favorites.removeSuccess': 'Removed from favorites',
    'favorites.removeError': 'Error removing favorite',
    
    // Messages
    'messages.title': 'Messages',
    'messages.conversations': 'Conversations',
    'messages.noConversations': 'No conversations yet',
    'messages.chatWith': 'Chat with user',
    'messages.selectChat': 'Select a conversation to start chatting',
    'messages.typeMessage': 'Type a message...',
    'messages.about': 'About',
    'messages.loadError': 'Error loading conversations',
    'messages.sendError': 'Error sending message',
    'messages.loadingChats': 'Loading conversations...',
    
    // Browse
    'browse.searchAds': 'Search listings...',
    'browse.category': 'Category',
    'browse.location': 'Location',
    'browse.minPrice': 'Min Price',
    'browse.maxPrice': 'Max Price',
    'browse.sort': 'Sort',
    'browse.newest': 'Newest',
    'browse.oldest': 'Oldest',
    'browse.priceLowHigh': 'Price Low to High',
    'browse.priceHighLow': 'Price High to Low',
    'browse.found': 'Found',
    'browse.ads': 'listings',
    'browse.postNewAd': 'Post New Ad',
    'browse.noResults': 'No results found',
    'browse.changeFilters': 'Try changing the filters or search',
    'browse.clearFilters': 'Clear Filters',
    'browse.contact': 'Contact',
    'browse.loginRequired': 'Login Required',
    'browse.loginToSave': 'Please login to save favorites',
    'browse.addedToFavorites': 'Added to favorites',
    'browse.removedFromFavorites': 'Removed from favorites',
    'browse.error': 'Error',
    'browse.cantUpdateFavorites': 'Could not update favorites',
    'browse.noContactInfo': 'No contact information',
    'browse.sellerNoContact': 'Seller did not provide contact information',
    'browse.loadError': 'Error loading listings',
    'browse.refreshPage': 'Try refreshing the page',
    
    // Auth
    'auth.loginRequired': 'Please login to view this page',
    'auth.backHome': 'Back to Home',
    
    // Hero Section
    'hero.title': 'Shaveli - Your Israeli Marketplace',
    'hero.subtitle': 'Buy, sell and rent with ease and confidence',
    'hero.search': 'What are you looking for today?',
    'hero.searchButton': 'Search',
    'hero.postAd': 'Post Ad for Free',
    'hero.stats.activeAds': 'Active Ads',
    'hero.stats.users': 'Registered Users',
    'hero.stats.dailyAds': 'New Daily Ads',
    
    // Categories
    'categories.title': 'Explore Our Categories',
    'categories.subtitle': 'Find exactly what you\'re looking for in our wide range of categories',
    'category.electronics': 'Electronics',
    'category.realEstate': 'Real Estate',
    'category.vehicles': 'Vehicles',
    'category.jobs': 'Jobs',
    'category.services': 'Services',
    'category.furniture': 'Furniture',
    'category.all': 'All Categories',
    
    // Common
    'common.contact': 'Contact',
    'common.price': 'Price',
    'common.location': 'Location',
    'common.description': 'Description',
    'common.title': 'Title',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.noResults': 'No results found',
    
    // Footer
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.help': 'Help',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('he')

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    localStorage.setItem('language', lang)
  }

  const direction: Direction = language === 'he' ? 'rtl' : 'ltr'

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['he', 'en'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  const value = {
    language,
    direction,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      <div className={direction} dir={direction}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}