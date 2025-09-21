import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Scale } from "lucide-react";
import NyayBot from "@/components/NyayBot";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const translations = {
    en: {
      title: "NyayDarpan",
      subtitle: "The Mirror of Justice",
      home: "Home",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact",
      languageToggle: "हिन्दी"
    },
    hi: {
      title: "न्यायदर्पण",
      subtitle: "न्याय का दर्पण",
      home: "होम",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      contact: "संपर्क",
      languageToggle: "English"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{t.title}</h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-foreground hover:text-primary transition-smooth">
                {t.home}
              </Link>
            </nav>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{t.languageToggle}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? "Empowering individuals with AI-powered legal insights."
                  : "एआई-संचालित कानूनी अंतर्दृष्टि के साथ व्यक्तियों को सशक्त बनाना।"
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {language === 'en' ? 'Legal' : 'कानूनी'}
              </h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {t.privacy}
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                  {t.terms}
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {language === 'en' ? 'Support' : 'सहायता'}
              </h4>
              <div className="space-y-2">
                <a href="mailto:support@nyaydarpan.com" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                  support@nyaydarpan.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 NyayDarpan. {language === 'en' ? 'All rights reserved.' : 'सभी अधिकार सुरक्षित।'}
            </p>
          </div>
        </div>
      </footer>
      
      {/* NyayBot Chat Widget */}
      <NyayBot />
    </div>
  );
};

export default Layout;