import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import shaveliLogo from "@/assets/shaveli-logo-new.png";

export const Footer = () => {
  const footerSections = [
    {
      title: "קטגוריות מובילות",
      links: [
        { name: "דירות למכירה", path: "/browse?category=real-estate&type=sale" },
        { name: "דירות להשכרה", path: "/browse?category=real-estate&type=rent" },
        { name: "רכב יד שנייה", path: "/browse?category=vehicles" },
        { name: "טכנולוגיה", path: "/browse?category=electronics" },
        { name: "בית וגן", path: "/browse?category=home-garden" },
        { name: "אופנה ויופי", path: "/browse?category=fashion" }
      ]
    },
    {
      title: "שירותי לקוחות",
      links: [
        { name: "מרכז עזרה", path: "/help" },
        { name: "כללי בטיחות", path: "/help" },
        { name: "איך לפרסם מודעה", path: "/help" },
        { name: "דיווח על תוכן", path: "/help" },
        { name: "צרו קשר", path: "/contact" },
        { name: "שאלות נפוצות", path: "/help" }
      ]
    },
    {
      title: "שווה לי",
      links: [
        { name: "אודותינו", path: "/about" },
        { name: "משרות פנויות", path: "/contact" },
        { name: "עיתונות", path: "/about" },
        { name: "בלוג החברה", path: "/about" },
        { name: "שותפויות עסקיות", path: "/contact" },
        { name: "משקיעים", path: "/about" }
      ]
    },
    {
      title: "תנאים משפטיים",
      links: [
        { name: "תנאי שימוש", path: "/terms" },
        { name: "מדיניות פרטיות", path: "/privacy" },
        { name: "הסכם משתמש", path: "/terms" },
        { name: "זכויות יוצרים", path: "/terms" },
        { name: "הודעה משפטית", path: "/terms" },
        { name: "נגישות", path: "/help" }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-t from-muted/50 to-background border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="mb-16 text-center">
          <h3 className="text-3xl font-bold mb-4 hebrew-text">
            הצטרפו לקהילה שלנו
          </h3>
          <p className="text-muted-foreground mb-6 hebrew-text max-w-2xl mx-auto">
            קבלו התראות על מודעות חדשות, טיפים למכירה מוצלחת והטבות בלעדיות למנויים
          </p>
          <div className="max-w-lg mx-auto flex gap-3">
            <Input
              placeholder="הכניסו את כתובת האימייל שלכם"
              className="hebrew-text flex-1"
              dir="rtl"
            />
            <Button className="hebrew-text px-8 bg-primary hover:bg-primary/90">
              הרשמה לניוזלטר
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 hebrew-text">
            ללא ספאם • ביטול מנוי בקליק אחד • מידע מאובטח ומוגן
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 hebrew-text">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Button variant="link" className="p-0 h-auto hebrew-text text-muted-foreground hover:text-foreground" asChild>
                      <Link to={link.path}>
                        {link.name}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Contact Info & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4 hebrew-text">צרו קשר</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="hebrew-text">03-1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="ltr">support@shaveli.co.il</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="hebrew-text">תל אביב, ישראל</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 hebrew-text">עקבו אחרינו</h4>
            <div className="flex gap-3">
              <Button size="icon" variant="outline">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src={shaveliLogo} alt="Shave.li Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-primary hebrew-text">שווה לי</span>
          </div>
          
          <p className="text-muted-foreground text-center hebrew-text">
            © 2025 שווה לי - כל הזכויות שמורות. פותח בישראל עבור הקהילה הישראלית
          </p>
          
          <div className="text-sm text-muted-foreground ltr">
            Made with ❤️ in Israel
          </div>
        </div>
      </div>
    </footer>
  );
};