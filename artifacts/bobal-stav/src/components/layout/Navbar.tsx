import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", labelCs: "Domů", labelUk: "Головна" },
    { href: "/sluzby", labelCs: "Služby", labelUk: "Послуги" },
    { href: "/projekty", labelCs: "Projekty", labelUk: "Проєкти" },
    { href: "/o-nas", labelCs: "O nás", labelUk: "Про нас" },
    { href: "/kontakt", labelCs: "Kontakt", labelUk: "Контакти" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background border-b border-border shadow-none py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="relative flex items-center justify-between h-16">
          <div className="hidden md:block w-1/3">
            <div className="flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] tracking-widest uppercase font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
                    location === link.href
                      ? "text-primary after:w-full"
                      : "text-foreground/80 hover:text-foreground after:w-0 hover:after:w-full"
                  }`}
                >
                  {t(link.labelCs, link.labelUk)}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/"
            aria-label="Bobal Stav — domů"
            className="absolute left-1/2 top-1/2 z-10 w-[178px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-[1.03] md:w-[238px]"
          >
            <img
              src="/bobal-stav-logo.png"
              alt="Bobal Stav"
              className="block h-auto w-full object-contain"
            />
          </Link>

          <div className="hidden md:flex w-1/3 items-center justify-end">
            <div className="flex items-center border border-border rounded-md overflow-hidden bg-card/50">
              <button
                onClick={() => setLanguage('cs')}
                className={`px-3 py-1.5 text-[11px] tracking-widest uppercase font-bold transition-colors ${language === 'cs' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-transparent'}`}
              >
                CS
              </button>
              <button
                onClick={() => setLanguage('uk')}
                className={`px-3 py-1.5 text-[11px] tracking-widest uppercase font-bold transition-colors border-l border-border ${language === 'uk' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-transparent'}`}
              >
                UK
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-6 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-4 text-sm tracking-widest uppercase font-bold border-b border-border/50 ${
                  location === link.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t(link.labelCs, link.labelUk)}
              </Link>
            ))}
            <div className="py-6 flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase font-bold text-muted-foreground">{t("Jazyk", "Мова")}</span>
              <div className="flex border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => { setLanguage('cs'); setIsOpen(false); }}
                  className={`px-4 py-2 text-xs tracking-widest uppercase font-bold ${language === 'cs' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground'}`}
                >
                  CS
                </button>
                <button
                  onClick={() => { setLanguage('uk'); setIsOpen(false); }}
                  className={`px-4 py-2 text-xs tracking-widest uppercase font-bold border-l border-border ${language === 'uk' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground'}`}
                >
                  UK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
