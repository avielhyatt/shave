import { Search, Plus, User, MessageCircle, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import shaveLiLogo from "@/assets/shave-li-logo.png";

export const Header = () => {
  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadMessagesCount();
      
      // Set up real-time updates for new messages
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          },
          () => {
            fetchUnreadMessagesCount();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchUnreadMessagesCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Error fetching unread messages count:', error);
        return;
      }

      setUnreadMessagesCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread messages count:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-1 text-sm" dir={direction}>
        🔥 {t('header.promo')} 🔥
      </div>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img src={shaveLiLogo} alt="Shave.li Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary hebrew-text leading-none">{direction === 'rtl' ? 'שווה לי' : 'Shave.li'}</span>
                <span className="text-xs text-muted-foreground">{direction === 'rtl' ? 'השוק שלכם' : 'Your Marketplace'}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
              <Input
                placeholder={t('hero.search')}
                className={`w-full ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
                dir={direction}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/browse">
                <Search className="w-4 h-4 ml-2" />
                {t('nav.browse')}
              </Link>
            </Button>
            {user ? (
              <>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0" 
                  size="sm" 
                  asChild
                >
                  <Link to="/post-ad">
                    <Plus className="w-4 h-4 ml-2" />
                    {t('nav.post')}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="relative" asChild>
                  <Link to="/messages">
                    <MessageCircle className="w-4 h-4 ml-2" />
                    {t('nav.messages')}
                    {unreadMessagesCount > 0 && (
                      <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 text-xs bg-destructive">
                        {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/favorites">
                    <Heart className="w-4 h-4 ml-2" />
                    {t('nav.favorites')}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <User className="w-4 h-4 ml-2" />
                    {t('nav.dashboard')}
                  </Link>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="w-4 h-4 ml-2" />
                {t('nav.login')}
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
                  <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
                  <Input
                    placeholder={t('hero.search')}
                    className={`w-full ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
                    dir={direction}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <LanguageSwitcher />
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/browse">
                      <Search className="w-4 h-4 ml-2" />
                      {t('nav.browse')}
                    </Link>
                  </Button>
                  {user ? (
                    <>
                      <Button 
                        className="justify-start hebrew-text bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0" 
                        asChild
                      >
                        <Link to="/post-ad">
                          <Plus className="w-4 h-4 ml-2" />
                          {t('nav.post')}
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start relative" asChild>
                        <Link to="/messages">
                          <MessageCircle className="w-4 h-4 ml-2" />
                          {t('nav.messages')}
                          {unreadMessagesCount > 0 && (
                            <Badge className="absolute top-1 left-1 h-4 w-4 p-0 text-xs bg-destructive">
                              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link to="/favorites">
                          <Heart className="w-4 h-4 ml-2" />
                          {t('nav.favorites')}
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link to="/dashboard">
                          <User className="w-4 h-4 ml-2" />
                          {t('nav.dashboard')}
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
                      {t('nav.login')}
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