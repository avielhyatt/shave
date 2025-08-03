import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, Eye, UserCheck, Settings, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  const { direction } = useLanguage();

  const privacyPoints = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "מידע שאנחנו אוספים",
      content: [
        "מידע אישי: שם, כתובת אימייל, מספר טלפון",
        "מידע על השימוש: עמודים שביקרתם, זמן השימוש",
        "מידע טכני: כתובת IP, סוג דפדפן, מערכת הפעלה",
        "תוכן שאתם מפרסמים: מודעות, תמונות, תיאורים"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "איך אנחנו משתמשים במידע",
      content: [
        "לספק ולשפר את השירותים שלנו",
        "ליצור קשר איתכם בנוגע לחשבון או לשירות",
        "לשלוח התראות ועדכונים רלוונטיים",
        "לנתח ולשפר את הביצועים של האתר"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "שיתוף מידע עם צדדים שלישיים",
      content: [
        "איננו מוכרים את המידע האישי שלכם",
        "ייתכן שנשתף מידע עם ספקי שירות מורשים",
        "נשתף מידע אם נדרש על פי חוק",
        "בעת מכירת החברה, המידע עלול לעבור לבעלים החדש"
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "הזכויות שלכם",
      content: [
        "לדעת איזה מידע אנחנו שומרים עליכם",
        "לבקש תיקון מידע שגוי",
        "לבקש מחיקת המידע שלכם",
        "להתנגד לשימושים מסוימים במידע"
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "אבטחת המידע",
      content: [
        "אנחנו משתמשים בהצפנה מתקדמת",
        "שרתים מאובטחים ומוגנים",
        "גישה מוגבלת למידע רק לעובדים מורשים",
        "עדכונים קבועים של מערכות האבטחה"
      ]
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      title: "מחיקת מידע",
      content: [
        "תוכלו למחוק את החשבון שלכם בכל עת",
        "מידע מסוים יישמר בהתאם לדרישות החוק",
        "ניתן לבקש מחיקת מודעות ספציפיות",
        "תהליך המחיקה מתבצע תוך 30 יום"
      ]
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background" dir={direction}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 hebrew-text">מדיניות פרטיות</h1>
          <p className="text-muted-foreground hebrew-text">
            עדכון אחרון: ינואר 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground hebrew-text leading-relaxed mb-4">
              הפרטיות שלכם חשובה לנו. מדיניות הפרטיות הזו מסבירה איך אנחנו אוספים, משתמשים 
              ומגנים על המידע האישי שלכם כשאתם משתמשים באתר שווה.
            </p>
            <p className="text-muted-foreground hebrew-text leading-relaxed">
              על ידי השימוש באתר שלנו, אתם מסכימים לאיסוף ולשימוש במידע בהתאם למדיניות זו.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Points */}
        <div className="space-y-6">
          {privacyPoints.map((point, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {point.icon}
                  </div>
                  <CardTitle className="hebrew-text">{point.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {point.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <span className="hebrew-text text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GDPR Notice */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 hebrew-text">זכויותיכם לפי GDPR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 hebrew-text text-sm leading-relaxed">
              אם אתם תושבי האיחוד האירופי, יש לכם זכויות נוספות לפי תקנת GDPR. 
              תוכלו לבקש גישה למידע שלכם, תיקון, מחיקה, או העברה למקום אחר. 
              לממש זכויות אלו, צרו איתנו קשר בכתובת privacy@shave.co.il
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="hebrew-text">פרטי התקשרות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-muted-foreground">
              <p className="hebrew-text">
                לשאלות בנוגע למדיניות הפרטיות או למימוש זכויותיכם:
              </p>
              <div className="space-y-1">
                <p>אימייל: privacy@shave.co.il</p>
                <p>טלפון: 03-1234567</p>
                <p className="hebrew-text">כתובת: רחוב ההסתדרות 123, תל אביב</p>
              </div>
              <p className="hebrew-text text-sm mt-4">
                נענה לפניותיכם תוך 30 יום עבודה.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}