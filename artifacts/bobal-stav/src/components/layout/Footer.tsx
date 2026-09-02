import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent } from "@workspace/api-client-react";
import { localizeText } from "@/contexts/LanguageContext";
import { getServiceHref, serviceDefinitions } from "@/data/services";

export function Footer() {
  const { t, language } = useLanguage();
  const { data: content } = useGetSiteContent();

  if (!content) return null;

  return (
    <footer className="bg-background border-t border-border pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="mb-8 inline-flex w-48 transition-transform duration-300 hover:scale-[1.02]">
              <img src="/bobal-stav-logo.png" alt="Bobal Stav" className="block h-auto w-full object-contain object-left" />
            </Link>
            <p className="text-muted-foreground text-sm leading-loose">
              {t(
                "Komplexní stavební a rekonstrukční práce v Praze a okolí. Kvalita, spolehlivost a preciznost.",
                "Комплексні будівельні та ремонтні роботи в Празі та околицях. Якість, надійність та точність."
              )}
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-8 text-foreground border-b border-border pb-4">
              {t("Kontakt", "Контакти")}
            </h4>
            <ul className="space-y-6">
              <li className="text-muted-foreground text-sm">
                <span className="block text-xs uppercase tracking-wider text-foreground mb-1">Telefon</span>
                <a href={`tel:${content.phone}`} className="hover:text-primary transition-colors text-base text-foreground font-medium">
                  {content.phone}
                </a>
              </li>
              <li className="text-muted-foreground text-sm">
                <span className="block text-xs uppercase tracking-wider text-foreground mb-1">E-mail</span>
                <a href="mailto:bobalstav.cz@gmail.com" className="break-all text-base font-medium text-foreground transition-colors hover:text-primary">
                  bobalstav.cz@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground text-sm">
                <span className="block text-xs uppercase tracking-wider text-foreground mb-1">Adresa</span>
                <span>{content.address}</span>
              </li>
              <li className="text-muted-foreground text-sm">
                <span className="block text-xs uppercase tracking-wider text-foreground mb-1">IČO</span>
                <span>{content.registrationNumber}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-8 text-foreground border-b border-border pb-4">
              {t("Navigace", "Навігація")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/sluzby" className="text-muted-foreground hover:text-primary text-sm transition-colors uppercase tracking-wider font-semibold">
                  {t("Služby", "Послуги")}
                </Link>
              </li>
              {serviceDefinitions.map((service, index) => (
                <li key={service.slug}>
                  <Link href={getServiceHref(service.titleCs, index)} className="text-muted-foreground hover:text-primary text-xs transition-colors uppercase tracking-wider">
                    {localizeText(`${service.titleCs} / ${service.titleUk}`, language)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projekty" className="text-muted-foreground hover:text-primary text-sm transition-colors uppercase tracking-wider font-semibold">
                  {t("Projekty", "Проєкти")}
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="text-muted-foreground hover:text-primary text-sm transition-colors uppercase tracking-wider font-semibold">
                  {t("O nás", "Про нас")}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-muted-foreground hover:text-primary text-sm transition-colors uppercase tracking-wider font-semibold">
                  {t("Kontakt", "Контакти")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-8 text-foreground border-b border-border pb-4">
              {t("Pracovní doba", "Робочий час")}
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="uppercase tracking-wider text-xs">{t("Po - Pá", "Пн - Пт")}</span>
                <span className="font-medium text-foreground">8:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="uppercase tracking-wider text-xs">{t("Sobota", "Субота")}</span>
                <span className="font-medium text-foreground">{t("Dle dohody", "За домовленістю")}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="uppercase tracking-wider text-xs">{t("Neděle", "Неділя")}</span>
                <span className="font-medium text-primary">{t("Zavřeno", "Зачинено")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] tracking-widest uppercase font-semibold text-muted-foreground">
            &copy; {new Date().getFullYear()} {content.companyName}. {t("Všechna práva vyhrazena.", "Всі права захищені.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
