import { Link } from "wouter";
import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Ruler, PaintRoller, Axe, Home as HomeIcon, Droplet, Layers } from "lucide-react";
import { getServiceDefinition, serviceDefinitions } from "@/data/services";

const servicesIcons = [
  <HomeIcon className="w-8 h-8" />,
  <Axe className="w-8 h-8" />,
  <Ruler className="w-8 h-8" />,
  <Layers className="w-8 h-8" />,
  <PaintRoller className="w-8 h-8" />,
  <Droplet className="w-8 h-8" />,
];

export default function Services() {
  const { t, language } = useLanguage();
  const { data: content, isLoading } = useGetSiteContent();

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background"><div className="w-12 h-12 border border-primary border-t-transparent animate-spin" /></div>;
  }

  const defaultServices = serviceDefinitions.map((service) => `${service.titleCs} / ${service.titleUk}`);
  const servicesList = content?.services && content.services.length > 0 ? content.services : defaultServices;

  return (
    <div className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 lg:px-12 bg-background">
      <div className="max-w-4xl mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <span className="w-8 h-[1px] bg-primary" />
            {t("Naše specializace", "Наша спеціалізація")}
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight uppercase leading-[0.9]">
            {t("Služby", "Послуги")}<span className="text-primary">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light border-l border-primary pl-6">
            {t(
              "Provádíme široké spektrum stavebních prací s absolutním důrazem na kvalitu, detail a dodržení domluvených termínů. Vyberte si konkrétní službu a prohlédněte si náš postup práce.",
              "Ми виконуємо широкий спектр будівельних робіт з абсолютним акцентом на якість, деталі та дотримання домовлених термінів. Оберіть конкретну послугу та перегляньте наш підхід до роботи.",
            )}
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col border-t border-border">
        {servicesList.map((service, index) => {
          const meta = getServiceDefinition(service, index);
          return (
            <motion.div
              key={`${meta.slug}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group border-b border-border hover:bg-card transition-colors duration-500"
            >
              <Link href={`/sluzby/${meta.slug}`} className="flex flex-col md:flex-row gap-8 items-start md:items-center p-6 sm:p-8 lg:p-12 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="absolute right-8 bottom-0 translate-y-1/3 text-[140px] font-display font-bold text-border group-hover:text-primary/5 transition-colors duration-700 select-none pointer-events-none z-0">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="text-5xl font-display font-light text-muted-foreground group-hover:text-primary transition-colors duration-500 md:w-24 shrink-0 z-10">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 z-10">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 uppercase tracking-tight text-foreground">
                    {localizeText(service, language)}
                  </h2>
                  <p className="max-w-2xl text-muted-foreground text-base sm:text-lg font-light leading-relaxed mb-5">
                    {language === "cs" ? meta.descCs : meta.descUk}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground text-sm font-light">
                    <span className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" />{t("Profesionální provedení", "Професійне виконання")}</span>
                    <span className="flex items-center gap-3 text-foreground group-hover:text-primary transition-colors uppercase tracking-[0.16em] text-[10px] font-bold">{t("Zobrazit detail", "Переглянути деталі")}<ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-md border border-border bg-background sm:h-56 md:h-44 md:w-64 lg:h-48 lg:w-72 z-10">
                  <img src={meta.image} alt={localizeText(service, language)} className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 text-primary opacity-90">{servicesIcons[index % servicesIcons.length]}</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-32 relative bg-card border border-border p-12 md:p-24 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight uppercase">{t("Nevidíte co potřebujete", "Не бачите що потрібно")}<span className="text-primary">?</span></h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          {t("Ke každému projektu přistupujeme individuálně. Zavolejte nám a najdeme řešení přesně pro vaše potřeby.", "Ми підходимо до кожного проєкту індивідуально. Зателефонуйте нам, і ми знайдемо рішення саме для ваших потреб.")}
        </p>
        <a href={`tel:${content?.phone}`} className="btn-premium btn-primary">{content?.phone}</a>
      </div>
    </div>
  );
}