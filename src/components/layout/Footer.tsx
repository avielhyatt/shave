import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const footerSections = [
    {
      title: "קטגוריות פופולריות",
      links: [
        { name: "דירות למכירה", path: "/browse?category=real-estate&subcategory=sale" },
        { name: "דירות להשכרה", path: "/browse?category=real-estate&subcategory=rent" },
        { name: "מכוניות יד שנייה", path: "/browse?category=vehicles&subcategory=cars" },
        { name: "אלקטרוניקה", path: "/browse?category=electronics" },
        { name: "משרות בהיי-טק", path: "/browse?category=jobs&subcategory=tech" },
        { name: "רהיטים לבית", path: "/browse?category=home&subcategory=furniture" }
      ]
    },
    {
      title: "עזרה ותמיכה",
      links: [
        { name: "מרכז עזרה", path: "/help" },
        { name: "איך לפרסם מודעה", path: "/help#how-to-post" },
        { name: "כללי בטיחות", path: "/help#safety" },
        { name: "דיווח על תוכן", path: "/help#report" },
        { name: "צרו קשר", path: "/contact" },
        { name: "שאלות נפוצות", path: "/help#faq" }
      ]
    },
    {
      title: "החברה",
      links: [
        { name: "אודות שווה", path: "/about" },
        { name: "קריירה", path: "/about#careers" },
        { name: "עיתונות", path: "/about#press" },
        { name: "משקיעים", path: "/about#investors" },
        { name: "בלוג", path: "/about#blog" },
        { name: "שותפויות", path: "/contact" }
      ]
    },
    {
      title: "חוקים ותנאים",
      links: [
        { name: "תנאי שימוש", path: "/terms" },
        { name: "מדיניות פרטיות", path: "/privacy" },
        { name: "עוגיות", path: "/privacy#cookies" },
        { name: "זכויות יוצרים", path: "/terms#copyright" },
        { name: "הסכם רישיון", path: "/terms#license" },
        { name: "הודעה משפטית", path: "/terms#legal" }
      ]
    }
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-bold mb-4 hebrew-text">
            הישארו מעודכנים
          </h3>
          <p className="text-muted-foreground mb-6 hebrew-text">
            הירשמו לניוזלטר שלנו וקבלו עדכונים על מודעות חדשות והטבות מיוחדות
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              placeholder="הכניסו את האימייל שלכם"
              className="hebrew-text"
              dir="rtl"
            />
            <Button className="hebrew-text">
              הרשמה
            </Button>
          </div>
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
                <span className="ltr">support@shave.co.il</span>
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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">ש</span>
            </div>
            <span className="text-2xl font-bold text-primary hebrew-text">שווה</span>
          </div>
          
          <p className="text-muted-foreground text-center hebrew-text">
            © 2024 שווה - כל הזכויות שמורות. פותח בישראל עבור הקהילה הישראלית
          </p>
          
          <div className="text-sm text-muted-foreground ltr">
            Made with ❤️ in Israel
          </div>
        </div>
      </div>
    </footer>
  );
};