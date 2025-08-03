import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  const { direction } = useLanguage();

  const sections = [
    {
      title: "1. הגדרות כלליות",
      content: [
        "האתר - אתר שווה המופעל על ידי חברת שווה בע״מ",
        "המשתמש - כל אדם המשתמש בשירותי האתר",
        "מודעה - כל תוכן שמפרסם משתמש באתר",
        "השירות - כלל השירותים הניתנים באתר"
      ]
    },
    {
      title: "2. תנאי השימוש",
      content: [
        "השימוש באתר מותנה בקבלת תנאים אלו",
        "המשתמש מתחייב לספק מידע נכון ומעודכן",
        "אסור לפרסם תוכן פוגעני, לא חוקי או מטעה",
        "החברה שומרת על הזכות לחסום משתמשים המפרים את התנאים"
      ]
    },
    {
      title: "3. פרסום מודעות",
      content: [
        "המשתמש אחראי לתוכן המודעות שהוא מפרסם",
        "אסור לפרסם מוצרים לא חוקיים או מסוכנים",
        "החברה רשאית להסיר מודעות שאינן עומדות בתנאים",
        "פרסום מודעות מרובות לאותו מוצר אסור"
      ]
    },
    {
      title: "4. אחריות ואחריות משפטית",
      content: [
        "החברה אינה אחראית לתוכן המודעות",
        "העסקאות מתבצעות בין המשתמשים בלבד",
        "החברה ממליצה על זהירות בעת ביצוע עסקאות",
        "המשתמש אחראי לכל נזק שיגרם עקב שימושו באתר"
      ]
    },
    {
      title: "5. פרטיות ומידע אישי",
      content: [
        "החברה מתחייבת לשמור על פרטיות המשתמשים",
        "מידע אישי יישמר בהתאם למדיניות הפרטיות",
        "המידע לא יועבר לצדדים שלישיים ללא הסכמה",
        "המשתמש רשאי לבקש מחיקת המידע שלו"
      ]
    },
    {
      title: "6. שינוי תנאים",
      content: [
        "החברה רשאית לשנות תנאים אלו בכל עת",
        "שינויים יפורסמו באתר ויכנסו לתוקף מיד",
        "המשך השימוש באתר מהווה הסכמה לשינויים",
        "מומלץ לעיין בתנאים מעת לעת"
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
          <h1 className="text-4xl font-bold mb-4 hebrew-text">תנאי השימוש</h1>
          <p className="text-muted-foreground hebrew-text">
            עדכון אחרון: ינואר 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground hebrew-text leading-relaxed">
              ברוכים הבאים לשווה! תנאי השימוש הבאים מסדירים את השימוש שלכם באתר ובשירותים שלנו. 
              על ידי השימוש באתר, אתם מסכימים לתנאים אלו במלואם. אנא קראו אותם בעיון לפני השימוש באתר.
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="hebrew-text">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
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

        <Separator className="my-8" />

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="hebrew-text">פרטי התקשרות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-muted-foreground">
              <p className="hebrew-text">
                לשאלות או הבהרות בנוגע לתנאי השימוש, ניתן לפנות אלינו:
              </p>
              <div className="space-y-1">
                <p>אימייל: legal@shave.co.il</p>
                <p>טלפון: 03-1234567</p>
                <p className="hebrew-text">כתובת: רחוב ההסתדרות 123, תל אביב</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}