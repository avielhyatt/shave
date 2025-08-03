import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MessageSquare, FileText, Shield, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Help() {
  const { direction } = useLanguage();

  const helpSections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "איך לפרסם מודעה",
      description: "מדריך שלב אחר שלב לפרסום מודעות ביעילות",
      content: [
        "כנסו לעמוד 'פרסום מודעה'",
        "בחרו קטגוריה מתאימה",
        "מלאו את כל הפרטים הנדרשים",
        "העלו תמונות איכותיות",
        "לחצו על 'פרסם מודעה'"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "כללי בטיחות",
      description: "כיצד להישאר בטוחים בעת קניה ומכירה",
      content: [
        "פגשו תמיד במקום ציבורי ובטוח",
        "אל תשלחו כסף מראש",
        "בדקו את המוצר לפני התשלום",
        "השתמשו בשיטות תשלום בטוחות",
        "סמכו על האינטואיציה שלכם"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "דיווח על תוכן",
      description: "איך לדווח על מודעות חשודות או בלתי הולמות",
      content: [
        "לחצו על כפתור 'דיווח' במודעה",
        "בחרו את סוג הבעיה",
        "הוסיפו פרטים נוספים אם נדרש",
        "הצוות שלנו יבדוק תוך 24 שעות",
        "תקבלו עדכון על הטיפול"
      ]
    }
  ];

  const faqs = [
    {
      question: "האם הפרסום בחינם?",
      answer: "כן, פרסום מודעות פרטיות הוא בחינם לחלוטין. עבור עסקים יש תוכניות מנוי מיוחדות."
    },
    {
      question: "כמה זמן מודעה נשארת באתר?",
      answer: "מודעות נשארות פעילות למשך 60 יום, ואחר כך הן מועברות לארכיון."
    },
    {
      question: "איך אני יכול לעדכן את המודעה שלי?",
      answer: "כנסו לאזור האישי, בחרו את המודעה ולחצו על 'עריכה'."
    },
    {
      question: "מה לעשות אם שכחתי את הסיסמה?",
      answer: "לחצו על 'שכחתי סיסמה' בעמוד ההתחברות ופעלו לפי ההוראות."
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 hebrew-text">מרכז עזרה</h1>
          <p className="text-xl text-muted-foreground hebrew-text">
            כאן תמצאו את כל המידע שאתם צריכים
          </p>
        </div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {helpSections.map((section, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {section.icon}
                  </div>
                  <CardTitle className="hebrew-text">{section.title}</CardTitle>
                </div>
                <p className="text-muted-foreground hebrew-text">{section.description}</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {section.content.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {stepIndex + 1}
                      </span>
                      <span className="hebrew-text text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl hebrew-text">שאלות נפוצות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2 hebrew-text">{faq.question}</h3>
                  <p className="text-muted-foreground hebrew-text">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">דרכי התקשרות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">טלפון</p>
                  <p className="text-muted-foreground">03-1234567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">אימייל</p>
                  <p className="text-muted-foreground">support@shave.co.il</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">שעות פעילות</p>
                  <p className="text-muted-foreground hebrew-text">א'-ה' 9:00-18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">שלחו לנו הודעה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="השם שלכם" dir={direction} />
              <Input placeholder="כתובת אימייל" dir={direction} />
              <Input placeholder="נושא ההודעה" dir={direction} />
              <Textarea placeholder="תוכן ההודעה" className="min-h-24" dir={direction} />
              <Button className="w-full hebrew-text">שלח הודעה</Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}