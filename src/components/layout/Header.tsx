import { Search, Plus, User, MessageCircle, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">ש</span>
              </div>
              <span className="text-2xl font-bold text-primary hebrew-text">שווה</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="חפשו מוצרים, דירות, רכב ועוד..."
                className="w-full pr-10 hebrew-text"
                dir="rtl"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hebrew-text" asChild>
              <Link to="/browse">
                <Search className="w-4 h-4 ml-2" />
                דפדוף מודעות
              </Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="hebrew-text" asChild>
                  <Link to="/post-ad">
                    <Plus className="w-4 h-4 ml-2" />
                    פרסום מודעה
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="hebrew-text relative">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  הודעות
                  <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 text-xs bg-destructive">
                    3
                  </Badge>
                </Button>
                <Button variant="ghost" size="sm" className="hebrew-text">
                  <Heart className="w-4 h-4 ml-2" />
                  מועדפים
                </Button>
                <Button variant="ghost" size="sm" className="hebrew-text" asChild>
                  <Link to="/dashboard">
                    <User className="w-4 h-4 ml-2" />
                    הדשבורד שלי
                  </Link>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hebrew-text"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="w-4 h-4 ml-2" />
                התחברות
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] hebrew-text">
              <div className="flex flex-col gap-4 mt-6">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="חיפוש..."
                    className="w-full pr-10"
                    dir="rtl"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/browse">
                      <Search className="w-4 h-4 ml-2" />
                      דפדוף מודעות
                    </Link>
                  </Button>
                  {user ? (
                    <>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link to="/post-ad">
                          <Plus className="w-4 h-4 ml-2" />
                          פרסום מודעה
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <MessageCircle className="w-4 h-4 ml-2" />
                        הודעות
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <Heart className="w-4 h-4 ml-2" />
                        מועדפים
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link to="/dashboard">
                          <User className="w-4 h-4 ml-2" />
                          הדשבורד שלי
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => setAuthModalOpen(true)}
                    >
                      <User className="w-4 h-4 ml-2" />
                      התחברות
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
};