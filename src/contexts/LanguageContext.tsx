import { createContext, useContext, useState, ReactNode } from 'react'

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
    
    // Hero Section
    'hero.title': 'שווה - השוק הישראלי שלכם',
    'hero.subtitle': 'קנו, מכרו והשכירו בקלות ובביטחון',
    'hero.search': 'מה אתם מחפשים היום?',
    'hero.searchButton': 'חיפוש',
    'hero.postAd': 'פרסמו מודעה בחינם',
    
    // Categories
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
    
    // Hero Section
    'hero.title': 'Shave - Your Israeli Marketplace',
    'hero.subtitle': 'Buy, sell and rent with ease and confidence',
    'hero.search': 'What are you looking for today?',
    'hero.searchButton': 'Search',
    'hero.postAd': 'Post Ad for Free',
    
    // Categories
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
  useState(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['he', 'en'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  })

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