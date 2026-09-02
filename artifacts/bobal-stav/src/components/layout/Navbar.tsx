import { Link, useLocation } from "wouter";
import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent } from "@workspace/api-client-react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getServiceHref, serviceDefinitions } from "@/data/services";

export function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { data: content } = useGetSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsServicesOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", labelCs: "Domů", labelUk: "Головна" },
    { href: "/projekty", labelCs: "Projekty", labelUk: "Проєкти" },
    { href: "/o-nas", labelCs: "O nás", labelUk: "Про нас" },
    { href: "/kontakt", labelCs: "Kontakt", labelUk: "Контакти" },
  ];
  const defaultServices = serviceDefinitions.map((service) => `${service.titleCs} / ${service.titleUk}`);
  const serviceItems = content?.services?.length ? content.services : defaultServices;
  const servicesActive = location.startsWith("/sluzby");

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
              <div className="relative">
                <div className="flex items-center">
                  <Link
                    href="/sluzby"
                    className={`text-[13px] tracking-widest uppercase font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
                      servicesActive ? "text-primary after:w-full" : "text-foreground/80 hover:text-foreground after:w-0 hover:after:w-full"
                    }`}
                  >
                    {t("Služby", "Послуги")}
                  </Link>
                  <button
                    type="button"
                    aria-label={t("Zobrazit služby", "Показати послуги")}
                    aria-expanded={isServicesOpen}
                    onClick={() => setIsServicesOpen((open) => !open)}
                    className={`ml-1 p-1 transition-colors ${servicesActive ? "text-primary" : "text-foreground/70 hover:text-primary"}`}
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {isServicesOpen && (
                  <div className="absolute left-0 top-full mt-5 w-80 border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-md">
                    <Link href="/sluzby" className="block border-b border-border px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-primary hover:bg-card">
                      {t("Přehled všech služeb", "Переглянути всі послуги")}
                    </Link>
                    {serviceItems.map((service, index) => (
                      <Link key={`${service}-${index}`} href={getServiceHref(service, index)} className="block border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/80 last:border-0 hover:bg-card hover:text-primary">
                        {localizeText(service, language)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
            <Link
              href="/sluzby"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between py-4 text-sm tracking-widest uppercase font-bold border-b border-border/50 ${servicesActive ? "text-primary" : "text-foreground hover:text-primary"}`}
            >
              {t("Služby", "Послуги")}
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Link>
            <div className="border-b border-border/50 pb-2">
              {serviceItems.map((service, index) => (
                <Link
                  key={`${service}-${index}`}
                  href={getServiceHref(service, index)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-3 pl-4 text-xs tracking-wider uppercase font-semibold text-muted-foreground hover:text-primary"
                >
                  {localizeText(service, language)}
                  <span className="text-primary">↗</span>
                </Link>
              ))}
            </div>
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
