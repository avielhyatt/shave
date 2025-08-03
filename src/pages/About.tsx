import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Target, Heart, Award, TrendingUp, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  const { direction } = useLanguage();

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "אמינות",
      description: "אנחנו מחויבים לספק שירות אמין ובטוח לכל הקהילה"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "קהילתיות",
      description: "אנחנו מאמינים בכוח הקהילה הישראלית ובעזרה הדדית"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "בטיחות",
      description: "הבטיחות שלכם היא בראש סדר העדיפויות שלנו"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "חדשנות",
      description: "אנחנו מפתחים כלים מתקדמים לחוויית קנייה ומכירה טובה יותר"
    }
  ];

  const stats = [
    { number: "50,000+", label: "מודעות פעילות" },
    { number: "100,000+", label: "משתמשים רשומים" },
    { number: "500+", label: "מודעות חדשות יומית" },
    { number: "24/7", label: "תמיכה ושירות" }
  ];

  const team = [
    {
      name: "דני כהן",
      role: "מייסד ומנכ״ל",
      description: "יזם בעל ניסיון של 15 שנה בתחום הטכנולוגיה"
    },
    {
      name: "שרה לוי", 
      role: "מנהלת פיתוח",
      description: "מפתחת מנוסה עם התמחות בחוויית משתמש"
    },
    {
      name: "מיכאל אברהם",
      role: "מנהל שיווק",
      description: "מומחה בשיווק דיגיטלי ופיתוח עסקי"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 hebrew-text">
            אודות שווה
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto hebrew-text leading-relaxed">
            שווה היא פלטפורמת המסחר הגדולה והמובילה בישראל, שמחברת בין קונים ומוכרים 
            בצורה בטוחה, נוחה ויעילה. אנחנו כאן כדי לעזור לכם למצוא בדיוק את מה שאתם מחפשים.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-16">
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 hebrew-text">המשימה שלנו</h2>
            <p className="text-lg text-muted-foreground hebrew-text leading-relaxed max-w-4xl mx-auto">
              ליצור את הפלטפורמה הטובה ביותר עבור הקהילה הישראלית לקנייה ומכירה של מוצרים ושירותים. 
              אנחנו מאמינים שכל אחד יכול למצוא את מה שהוא מחפש ולמכור את מה שהוא לא צריך, 
              בצורה פשוטה, בטוחה ומהירה.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 hebrew-text">הערכים שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 hebrew-text">{value.title}</h3>
                  <p className="text-muted-foreground hebrew-text text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 hebrew-text">המספרים שלנו</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground hebrew-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 hebrew-text">הצוות שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle className="hebrew-text">{member.name}</CardTitle>
                  <p className="text-primary font-semibold hebrew-text">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center hebrew-text text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="p-8 text-center">
            <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4 hebrew-text">הצטרפו אלינו עוד היום</h2>
            <p className="text-lg mb-6 hebrew-text opacity-90">
              בואו להיות חלק מהקהילה הגדולה ביותר של קנייה ומכירה בישראל
            </p>
            <Button size="lg" variant="secondary" className="hebrew-text">
              התחילו עכשיו
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </>
  );
}