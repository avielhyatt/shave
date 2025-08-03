import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Clock, MessageSquare, Users } from "lucide-react";

export default function Contact() {
  const { direction } = useLanguage();

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "טלפון",
      value: "03-1234567",
      description: "זמינים א'-ה' 9:00-18:00"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "אימייל",
      value: "support@shave.co.il",
      description: "מענה תוך 24 שעות"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "צ'אט מקוון",
      value: "צ'אט עם נציג",
      description: "זמין בשעות העבודה"
    }
  ];

  const departments = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "תמיכה טכנית",
      email: "tech@shave.co.il",
      description: "בעיות טכניות, שגיאות באתר"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "שירות לקוחות",
      email: "support@shave.co.il", 
      description: "שאלות כלליות, עזרה בשימוש"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "מכירות ושותפויות",
      email: "sales@shave.co.il",
      description: "הצעות עסקיות, פרסום"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 hebrew-text">צרו קשר</h1>
          <p className="text-xl text-muted-foreground hebrew-text">
            אנחנו כאן בשבילכם - יש לכם שאלה? רוצים עזרה? בואו נדבר!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-primary mb-4 flex justify-center">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 hebrew-text">{method.title}</h3>
                <p className="text-xl font-bold text-primary mb-2">{method.value}</p>
                <p className="text-sm text-muted-foreground hebrew-text">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">שלחו לנו הודעה</CardTitle>
              <p className="text-muted-foreground hebrew-text">
                מלאו את הטופס ונחזור אליכם בהקדם
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="שם פרטי" dir={direction} />
                <Input placeholder="שם משפחה" dir={direction} />
              </div>
              <Input placeholder="כתובת אימייל" type="email" dir={direction} />
              <Input placeholder="מספר טלפון" dir={direction} />
              <Input placeholder="נושא ההודעה" dir={direction} />
              <Textarea 
                placeholder="תוכן ההודעה - פרטו על השאלה או הבעיה שלכם" 
                className="min-h-32" 
                dir={direction} 
              />
              <Button className="w-full hebrew-text">שלח הודעה</Button>
              <p className="text-xs text-muted-foreground text-center hebrew-text">
                על ידי שליחת הטופס אתם מסכימים למדיניות הפרטיות שלנו
              </p>
            </CardContent>
          </Card>

          {/* Office Info & Departments */}
          <div className="space-y-6">
            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text">המשרדים שלנו</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">כתובת</p>
                    <p className="text-muted-foreground hebrew-text">רחוב ההסתדרות 123, תל אביב</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold hebrew-text">שעות פעילות</p>
                    <p className="text-muted-foreground hebrew-text">ראשון - חמישי: 9:00 - 18:00</p>
                    <p className="text-muted-foreground hebrew-text">שישי: 9:00 - 14:00</p>
                    <p className="text-muted-foreground hebrew-text">שבת: סגור</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text">מחלקות</CardTitle>
                <p className="text-muted-foreground hebrew-text text-sm">
                  פנו ישירות למחלקה הרלוונטית
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">
                        {dept.icon}
                      </div>
                      <h4 className="font-semibold hebrew-text">{dept.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{dept.email}</p>
                    <p className="text-xs text-muted-foreground hebrew-text">{dept.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Link */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2 hebrew-text">
              לפני שפונים אלינו
            </h3>
            <p className="text-muted-foreground hebrew-text mb-4">
              יתכן שהתשובה לשאלה שלכם כבר נמצאת בשאלות הנפוצות
            </p>
            <Button variant="outline" className="hebrew-text">
              עברו לשאלות נפוצות
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}