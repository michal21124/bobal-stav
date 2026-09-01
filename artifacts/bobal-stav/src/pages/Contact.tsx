import { useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Hammer, Shield } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const { data: content, isLoading } = useGetSiteContent();

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background">
      <div className="w-12 h-12 border border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <div className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 lg:px-12 bg-background">
      <div className="max-w-4xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <span className="w-8 h-[1px] bg-primary"></span>
            {t("Jsme tu pro vás", "Ми тут для вас")}
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight uppercase leading-[0.9]">
            {t("Kontakt", "Контакти")}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light border-l border-primary pl-6">
            {t("Jsme připraveni prokonzultovat váš projekt. Nejrychlejší cesta je zavolat nám přímo.", "Ми готові обговорити ваш проєкт. Найшвидший спосіб - зателефонувати нам безпосередньо.")}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="bg-card p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 text-primary/5 opacity-50 translate-x-1/4 translate-y-1/4 pointer-events-none">
            <Hammer className="w-96 h-96" />
          </div>
          
          <h2 className="text-3xl font-display font-bold mb-12 uppercase tracking-tight relative z-10">
            {t("Kontaktní údaje", "Контактні дані")}
          </h2>
          
          <div className="space-y-12 relative z-10">
            <a href={`tel:${content?.phone}`} className="flex items-start gap-6 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 border border-primary text-primary flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2">
                  {t("Zavolejte nám", "Зателефонуйте нам")}
                </p>
                <p className="text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {content?.phone}
                </p>
              </div>
            </a>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 border border-border text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2">
                  {t("Sídlo společnosti", "Місцезнаходження")}
                </p>
                <p className="text-lg font-light text-foreground">
                  {content?.address}
                </p>
                <p className="text-sm text-muted-foreground mt-2 font-light">
                  IČO: {content?.registrationNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 border border-border text-primary flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="w-full">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-4">
                  {t("Pracovní doba", "Робочий час")}
                </p>
                <div className="space-y-2 text-sm font-light w-full max-w-xs">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="uppercase tracking-wider">{t("Po - Pá:", "Пн - Пт:")}</span>
                    <span className="font-bold text-foreground">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="uppercase tracking-wider">{t("Sobota:", "Субота:")}</span>
                    <span className="font-bold text-foreground">{t("Dle dohody", "За домовл.")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-background p-10 md:p-16 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-display font-bold mb-8 uppercase tracking-tight">
            {t("Máte zájem o spolupráci?", "Зацікавлені у співпраці?")}
          </h2>
          <p className="text-muted-foreground mb-12 font-light leading-relaxed text-lg">
            {t(
              "Dáváme přednost osobnímu přístupu. Zavolejte nám, popište nám svůj záměr a my pro vás připravíme nezávaznou nabídku na míru. Každý projekt je jedinečný a zaslouží si individuální ocenění.", 
              "Ми віддаємо перевагу індивідуальному підходу. Зателефонуйте нам, опишіть свій задум, і ми підготуємо для вас індивідуальну пропозицію без зобов'язань. Кожен проєкт є унікальним і заслуговує на індивідуальну оцінку."
            )}
          </p>
          
          <div className="p-8 border border-border border-l-4 border-l-primary bg-card/50">
            <h3 className="font-bold mb-6 flex items-center gap-3 uppercase tracking-wider text-sm">
              <Shield className="w-5 h-5 text-primary" />
              {t("Proč si vybrat nás", "Чому варто обрати нас")}
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground font-light list-none">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block"></span> {t("Rychlá a jasná komunikace", "Швидка та чітка комунікація")}</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block"></span> {t("Dodržování smluvených cen", "Дотримання домовлених цін")}</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block"></span> {t("Čistota na staveništi", "Чистота на будівельному майданчику")}</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block"></span> {t("Záruka na provedené dílo", "Гарантія на виконані роботи")}</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
