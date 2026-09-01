import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { CheckCircle2, Ruler, PaintRoller, Axe, Home as HomeIcon, Droplet, Layers } from "lucide-react";

const fallbackServiceImages = [
  "/service-renovation.png",
  "/service-masonry.png",
  "/service-drywall.png",
  "/service-painting.png",
  "/service-tiling.png",
  "/service-paving.png",
  "/service-facade.png",
  "/service-demolition.png",
];

function getServiceMeta(service: string, index: number) {
  const normalized = service.toLowerCase();

  if (normalized.includes("rekonstruk") || normalized.includes("реконструк")) {
    return {
      image: "/service-renovation.png",
      descCs: "Kompletní rekonstrukce bytů, domů a jednotlivých místností od přípravy po finální dokončení.",
      descUk: "Комплексна реконструкція квартир, будинків та окремих приміщень — від підготовки до завершення.",
    };
  }

  if (normalized.includes("zednick") || normalized.includes("мур")) {
    return {
      image: "/service-masonry.png",
      descCs: "Přesné zdění, betonáže a opravy konstrukcí s důrazem na pevnost a čisté provedení.",
      descUk: "Точне мурування, бетонування та ремонт конструкцій з акцентом на міцність і акуратність.",
    };
  }

  if (
    normalized.includes("sádrokarton") ||
    normalized.includes("гіпсокартон") ||
    normalized.includes("omít") ||
    normalized.includes("штукатур")
  ) {
    return {
      image: "/service-drywall.png",
      descCs: "Sádrokartonové konstrukce, nové omítky a štukování pro rovné a připravené povrchy.",
      descUk: "Гіпсокартонні конструкції, нова штукатурка та шпаклювання для рівних готових поверхонь.",
    };
  }

  if (
    normalized.includes("malov") ||
    normalized.includes("фарб") ||
    normalized.includes("obklad") ||
    normalized.includes("плит") ||
    normalized.includes("dlaž")
  ) {
    return {
      image: normalized.includes("obklad") || normalized.includes("dlaž") || normalized.includes("плит")
        ? "/service-tiling.png"
        : "/service-painting.png",
      descCs: "Malování, obklady a dlažby, které dodají interiéru čistý vzhled a dlouhou životnost.",
      descUk: "Фарбування, облицювання та плитка, які створюють охайний інтер’єр і служать роками.",
    };
  }

  if (
    normalized.includes("zámkov") ||
    normalized.includes("бруків") ||
    normalized.includes("beton") ||
    normalized.includes("бетон")
  ) {
    return {
      image: "/service-paving.png",
      descCs: "Pokládka zámkové dlažby a betonářské práce pro chodníky, terasy, vjezdy i pevné plochy.",
      descUk: "Укладання бруківки та бетонні роботи для доріжок, терас, заїздів і міцних поверхонь.",
    };
  }

  if (normalized.includes("fasád") || normalized.includes("fasad") || normalized.includes("утепл")) {
    return {
      image: "/service-facade.png",
      descCs: "Kompletní fasádní úpravy a zateplení pro lepší vzhled, komfort a energetickou úspornost.",
      descUk: "Комплексне оздоблення фасадів та утеплення для кращого вигляду, комфорту й енергоефективності.",
    };
  }

  if (normalized.includes("bourac") || normalized.includes("demont") || normalized.includes("демонтаж")) {
    return {
      image: "/service-demolition.png",
      descCs: "Bezpečné bourací a přípravné práce včetně třídění a odvozu stavebního odpadu.",
      descUk: "Безпечні демонтажні та підготовчі роботи, включно із сортуванням і вивезенням будівельного сміття.",
    };
  }

  if (normalized.includes("podlah") || normalized.includes("підлог")) {
    return {
      image: "/service-tiling.png",
      descCs: "Pečlivá příprava podkladu a pokládka podlah pro pohodlný a odolný výsledek.",
      descUk: "Ретельна підготовка основи та укладання підлог для комфортного й довговічного результату.",
    };
  }

  return {
    image: fallbackServiceImages[index % fallbackServiceImages.length],
    descCs: "Profesionální realizace s důrazem na kvalitu, detail a dlouhou životnost.",
    descUk: "Професійна реалізація з акцентом на якість, деталі та довговічність.",
  };
}

export default function Services() {
  const { t, language } = useLanguage();
  const { data: content, isLoading } = useGetSiteContent();

  const servicesIcons = [
    <HomeIcon className="w-8 h-8" />,
    <Axe className="w-8 h-8" />,
    <Ruler className="w-8 h-8" />,
    <Layers className="w-8 h-8" />,
    <PaintRoller className="w-8 h-8" />,
    <Droplet className="w-8 h-8" />
  ];

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background">
      <div className="w-12 h-12 border border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  // Fallback services based on the provided brief if API returns empty
  const defaultServices = language === 'cs' 
    ? [
        "Kompletní rekonstrukce bytů a domů",
        "Zednické práce a hrubé stavby",
        "Montáž sádrokartonu",
        "Omítky, štukování a malování",
        "Obklady a dlažby",
        "Pokládka zámkové dlažby",
        "Betonářské práce",
        "Fasády a zateplení objektů",
        "Bourací a přípravné práce",
        "Pokládka podlah"
      ]
    : [
        "Комплексна реконструкція квартир та будинків",
        "Мулярні роботи та чорнове будівництво",
        "Монтаж гіпсокартону",
        "Штукатурка, шпаклівка та фарбування",
        "Облицювання та плитка",
        "Укладання тротуарної плитки",
        "Бетонні роботи",
        "Фасади та утеплення будівель",
        "Демонтажні та підготовчі роботи",
        "Укладання підлоги"
      ];

  const servicesList = content?.services && content.services.length > 0 
    ? content.services 
    : defaultServices;

  return (
    <div className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 lg:px-12 bg-background">
      <div className="max-w-4xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <span className="w-8 h-[1px] bg-primary"></span>
            {t("Naše specializace", "Наша спеціалізація")}
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight uppercase leading-[0.9]">
            {t("Služby", "Послуги")}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light border-l border-primary pl-6">
            {t("Provádíme široké spektrum stavebních prací s absolutním důrazem na kvalitu, detail a dodržení domluvených termínů.", "Ми виконуємо широкий спектр будівельних робіт з абсолютним акцентом на якість, деталі та дотримання домовлених термінів.")}
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col border-t border-border">
        {servicesList.map((service, index) => (
          (() => {
            const meta = getServiceMeta(service, index);

            return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group border-b border-border hover:bg-card transition-colors duration-500"
          >
             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center p-6 sm:p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute right-8 bottom-0 translate-y-1/3 text-[140px] font-display font-bold text-border group-hover:text-primary/5 transition-colors duration-700 select-none pointer-events-none z-0">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="text-5xl font-display font-light text-muted-foreground group-hover:text-primary transition-colors duration-500 md:w-24 shrink-0 z-10">
                  0{index + 1}
                </div>
                 <div className="flex-1 z-10">
                     <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3 uppercase tracking-tight text-foreground">{localizeText(service, language)}</h3>
                   <p className="max-w-2xl text-muted-foreground text-base sm:text-lg font-light leading-relaxed mb-5">
                     {language === "cs" ? meta.descCs : meta.descUk}
                   </p>
                   <p className="text-muted-foreground text-sm font-light flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {t("Profesionální provedení.", "Професійне виконання.")}
                  </p>
                </div>
                 <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-md border border-border bg-background sm:h-56 md:h-44 md:w-64 lg:h-48 lg:w-72 z-10">
                   <img
                     src={meta.image}
                     alt={localizeText(service, language)}
                     className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                   <div className="absolute bottom-4 right-4 text-primary opacity-90">
                     {servicesIcons[index % servicesIcons.length]}
                   </div>
                </div>
             </div>
          </motion.div>
            );
          })()
        ))}
      </div>

      <div className="mt-32 relative bg-card border border-border p-12 md:p-24 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight uppercase">
          {t("Nevidíte co potřebujete", "Не бачите що потрібно")}<span className="text-primary">?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          {t("Ke každému projektu přistupujeme individuálně. Zavolejte nám a najdeme řešení přesně pro vaše potřeby.", "Ми підходимо до кожного проєкту індивідуально. Зателефонуйте нам, і ми знайдемо рішення саме для ваших потреб.")}
        </p>
        <a href={`tel:${content?.phone}`} className="btn-premium btn-primary">
          {content?.phone}
        </a>
      </div>
    </div>
  );
}
