import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent, useListGalleryItems, useListTestimonials } from "@workspace/api-client-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Hammer, Ruler, ShieldCheck, SquareSquare, PaintRoller, Axe, Quote, Star, Phone } from "lucide-react";
import { getServiceHref } from "@/data/services";

const HERO_IMAGES = [
  { src: "/hero-facade.jpeg", altCs: "Fasáda domu během rekonstrukce", altUk: "Фасад будинку під час реконструкції" },
  { src: "/hero-bathroom.jpeg", altCs: "Obklady v moderní koupelně", altUk: "Облицювання сучасної ванної кімнати" },
  { src: "/hero-interior.jpeg", altCs: "Dokončený interiér domu", altUk: "Завершений інтер’єр будинку" },
];

const SERVICE_IMAGES = [
  "/service-masonry.png",
  "/service-renovation.jpeg",
  "/service-facade.jpeg",
  "/service-tiling.png",
  "/service-painting.png",
  "/service-demolition.png",
];

function getServiceImage(service: string, index: number) {
  const normalized = service.toLowerCase();

  if (normalized.includes("rekonstruk") || normalized.includes("реконструк")) {
    return SERVICE_IMAGES[1];
  }

  if (normalized.includes("zednick") || normalized.includes("мур")) {
    return SERVICE_IMAGES[0];
  }

  if (
    normalized.includes("sádrokarton") ||
    normalized.includes("гіпсокартон") ||
    normalized.includes("omít") ||
    normalized.includes("штукатур")
  ) {
    return "/service-drywall.png";
  }

  if (
    normalized.includes("zámkov") ||
    normalized.includes("бруків") ||
    normalized.includes("beton") ||
    normalized.includes("бетон")
  ) {
    return "/service-paving.png";
  }

  if (
    normalized.includes("malov") ||
    normalized.includes("фарб") ||
    normalized.includes("obklad") ||
    normalized.includes("плит")
  ) {
    return SERVICE_IMAGES[3];
  }

  if (normalized.includes("fasád") || normalized.includes("утепл")) {
    return SERVICE_IMAGES[2];
  }

  return SERVICE_IMAGES[index % SERVICE_IMAGES.length];
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(value);
      return;
    }
    if (isInView) {
      let startTimestamp: number;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(value);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, prefersReducedMotion]);

  return (
    <div ref={ref} className="p-4 py-6 sm:p-8 md:p-10 text-center group hover:bg-background/80 transition-colors duration-500">
      <div className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-foreground group-hover:text-[#D4AF37] transition-colors duration-500 mb-2 flex items-center justify-center">
        <span>{count}</span>
        <span className="text-primary group-hover:text-primary transition-colors ml-[1px]">{suffix}</span>
      </div>
      <div className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider sm:tracking-widest md:tracking-[0.2em] leading-tight break-words whitespace-normal px-1">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const { data: content, isLoading: isContentLoading } = useGetSiteContent();
  const { data: projects, isLoading: isProjectsLoading } = useListGalleryItems();
  const { data: testimonials, isLoading: isTestimonialsLoading } = useListTestimonials();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  if (isContentLoading || isProjectsLoading || isTestimonialsLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background">
      <div className="w-12 h-12 border border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 4) || [];
  const visibleTestimonials = testimonials?.slice(0, 6) || [];

  const allIcons = [
    <SquareSquare className="w-6 h-6" />, 
    <Hammer className="w-6 h-6" />, 
    <ShieldCheck className="w-6 h-6" />, 
    <Ruler className="w-6 h-6" />, 
    <PaintRoller className="w-6 h-6" />, 
    <Axe className="w-6 h-6" />
  ];

  const defaultServicesList = [
    { image: SERVICE_IMAGES[0], icon: allIcons[0], titleCs: "Zednické práce", titleUk: "Мулярні роботи", descCs: "Komplexní zednické práce, zdění, betonáže a úpravy povrchů.", descUk: "Комплексні мулярні роботи, кладка, бетонування та обробка поверхонь." },
    { image: SERVICE_IMAGES[1], icon: allIcons[1], titleCs: "Rekonstrukce", titleUk: "Реконструкція", descCs: "Kompletní i částečné rekonstrukce bytových a nebytových prostor.", descUk: "Повна та часткова реконструкція житлових та нежитлових приміщень." },
    { image: SERVICE_IMAGES[2], icon: allIcons[2], titleCs: "Fasády a zateplení", titleUk: "Фасади та утеплення", descCs: "Realizace zateplovacích systémů a povrchových úprav fasád.", descUk: "Реалізація систем утеплення та обробка фасадів." },
    { image: SERVICE_IMAGES[3], icon: allIcons[3], titleCs: "Obklady a dlažby", titleUk: "Облицювання та плитка", descCs: "Precizní pokládka obkladů a dlažeb v interiérech i exteriérech.", descUk: "Точне укладання плитки в інтер'єрах та екстер'єрах." },
    { image: SERVICE_IMAGES[4], icon: allIcons[4], titleCs: "Malířské práce", titleUk: "Малярні роботи", descCs: "Profesionální malování, štukování a finální povrchové úpravy.", descUk: "Професійне фарбування, штукатурення та фінальна обробка поверхонь." },
    { image: SERVICE_IMAGES[5], icon: allIcons[5], titleCs: "Bourací práce", titleUk: "Демонтажні роботи", descCs: "Bezpečné a rychlé odstranění původních konstrukcí a odvoz suti.", descUk: "Безпечне та швидке видалення старих конструкцій і вивіз сміття." }
  ];

  let servicesToDisplay = [];
  if (content?.services && content.services.length > 0) {
    servicesToDisplay = content.services.map((s, i) => ({
      image: getServiceImage(s, i),
      icon: allIcons[i % allIcons.length],
      titleCs: localizeText(s, "cs"),
      titleUk: localizeText(s, "uk"),
      descCs: "Profesionální realizace s důrazem na kvalitu a detail.",
      descUk: "Професійна реалізація з акцентом на якість та деталі."
    }));
  } else {
    servicesToDisplay = defaultServicesList;
  }

  return (
    <div className="flex flex-col w-full bg-background">
      {/* Premium Hero Section - Full Bleed */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            {HERO_IMAGES.map((img, idx) => (
            <img 
              key={img.src}
              src={img.src}
              alt={language === "cs" ? img.altCs : img.altUk}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                currentImageIndex === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Directional gradient for text legibility on the left, keeping right bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 md:via-background/50 to-transparent z-10"></div>
          {/* Bottom gradient to blend into next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background z-10"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-20 w-full mt-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
                <span className="w-8 h-[1px] bg-primary"></span>
                {t("Profesionální stavební firma", "Професійна будівельна компанія")}
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-8 text-foreground uppercase drop-shadow-md">
                {t("Stavíme", "Будуємо")} <br/>
                <span className="text-primary drop-shadow-md">{t("Na kvalitě", "На якості")}</span>
                <span className="text-foreground drop-shadow-md">.</span>
              </h1>
              <p className="mb-10 max-w-2xl border-l-2 border-primary/80 pl-5 text-base leading-7 tracking-wide text-foreground/80 drop-shadow-sm md:text-lg md:leading-8">
                {language === 'cs' ? content?.aboutCs : content?.aboutUk}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
                <div className="flex flex-col gap-3 sm:gap-2">
                  <a
                    href={`tel:${content?.phone}`}
                    className="group inline-flex min-h-10 self-start items-center justify-center rounded-md border border-primary/80 bg-background/65 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
                  >
                    <Phone className="mr-2.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                    {t("Zavolat", "Зателефонувати")}
                  </a>
                  <Link href="/kontakt#contact-form" className="group inline-flex min-h-14 items-center justify-center px-7 py-4 sm:px-9 sm:py-5 text-xs sm:text-sm tracking-[0.16em] uppercase font-bold bg-primary text-primary-foreground border-2 border-primary shadow-[0_0_28px_rgba(234,179,8,0.28)] hover:bg-primary/90 hover:border-primary/90 hover:shadow-[0_0_38px_rgba(234,179,8,0.45)] active:scale-[0.98] transition-all duration-300 rounded-md shrink">
                    <span className="truncate">{t("Nezávazná poptávka", "Необов’язковий запит")}</span>
                    <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
                <Link href="/projekty" className="group inline-flex min-h-14 items-center justify-center px-7 py-4 sm:px-9 sm:py-5 text-xs sm:text-sm tracking-[0.16em] uppercase font-bold bg-background/70 border-2 border-foreground/80 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:bg-foreground hover:text-background hover:border-foreground active:scale-[0.98] transition-all duration-300 rounded-md shrink backdrop-blur-md">
                  <span className="truncate">{t("Naše práce", "Наші роботи")}</span>
                  <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slideshow Progress Indicator */}
        <div className="absolute top-4 right-6 md:top-auto md:bottom-12 lg:right-12 z-20 flex items-center gap-4">
          <div className="text-[10px] font-bold tracking-[0.2em] text-foreground">
            {String(currentImageIndex + 1).padStart(2, '0')}
          </div>
          <div className="w-24 md:w-32 h-[2px] bg-border/50 relative overflow-hidden rounded-full">
            <motion.div
              key={currentImageIndex} // forces re-animation on index change
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 7, ease: "linear" }}
              className="absolute top-0 left-0 h-full bg-primary"
            />
          </div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
            {String(HERO_IMAGES.length).padStart(2, '0')}
          </div>
        </div>
      </section>

      {/* Stats Band - Premium Compact Editorial */}
      <section className="border-b border-border bg-card/40 backdrop-blur-sm relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-4 divide-x divide-border">
            <AnimatedStat value={100} suffix="%" label={t("Spokojenost", "Задоволеність")} />
            <AnimatedStat value={5} suffix="+" label={t("Let na trhu", "Років на ринку")} />
            <AnimatedStat value={50} suffix="+" label={t("Realizací", "Реалізацій")} />
            <AnimatedStat value={24} suffix="/7" label={t("Podpora", "Підтримка")} />
          </div>
        </div>
      </section>

      {/* Architectural Services Section - Horizontal Premium Rail */}
      <section id="services" className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight uppercase">
                {t("Služby", "Послуги")}
                <span className="text-primary">.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light">
                {t("Odborné stavební práce s garancí kvality. Od hrubé stavby až po finální detaily.", "Професійні будівельні роботи з гарантією якості. Від чорнового будівництва до фінальних деталей.")}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="w-12 h-[1px] bg-border"></span>
                {t("Tažením posuňte", "Перетягніть для прокрутки")}
                <ArrowRight className="w-4 h-4" />
              </div>
              <Link href="/sluzby" className="text-sm font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors pb-2 border-b border-primary shrink-0">
                {t("Všechny služby", "Всі послуги")}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="relative w-full max-w-[1400px] mx-auto">
          {/* Edge fade affordances */}
          <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 lg:px-12 pb-12 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {servicesToDisplay.map((feature, i) => (
              <Link 
                key={i} 
                href={getServiceHref(feature.titleCs, i)} 
                className="snap-start shrink-0 w-[85vw] sm:w-[400px] lg:w-[420px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              >
                <div className="h-full bg-[#111111] border border-border/60 rounded-xl hover:bg-[#161616] hover:border-[#D4AF37]/40 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2 flex flex-col shadow-lg shadow-black/20">
                  
                  {/* Subtle Gold accent line top */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/0 to-transparent group-hover:via-[#D4AF37]/60 transition-all duration-700"></div>

                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={feature.image}
                      alt={t(feature.titleCs, feature.titleUk)}
                      className="h-full w-full object-cover grayscale-[0.12] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/10 to-transparent"></div>
                    <div className="absolute left-8 top-8 flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-[#111111]/75 text-[#D4AF37] shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:text-primary">
                      {feature.icon}
                    </div>
                    <div className="absolute bottom-5 right-8 text-5xl font-display font-light text-white/50 group-hover:text-[#D4AF37]/80 transition-colors duration-500 select-none tracking-tighter">
                      0{i+1}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-8 md:p-10">
                    <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight text-foreground group-hover:text-[#D4AF37] transition-colors duration-300">
                      {t(feature.titleCs, feature.titleUk)}
                    </h3>
                    
                    <p className="text-muted-foreground text-base font-light mb-10 line-clamp-3">
                      {t(feature.descCs, feature.descUk)}
                    </p>

                    <div className="flex items-center text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                      {t("Detail služby", "Деталі послуги")}
                      <ArrowRight className="ml-3 w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Edge to edge imagery */}
      <section className="py-32 bg-card">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col mb-20">
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight uppercase">
              {t("Projekty", "Проєкти")}
              <span className="text-primary">.</span>
            </h2>
            <div className="w-24 h-1 bg-primary mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-2xl font-light">
              {t("Výsledek naší práce mluví za vše. Prohlédněte si projekty, na které jsme hrdí.", "Результат нашої роботи говорить сам за себе. Перегляньте проєкти, якими ми пишаємося.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
            {featuredProjects.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`group relative overflow-hidden aspect-square md:aspect-[4/3] bg-background border-b border-border ${i % 2 === 0 ? 'md:border-r' : ''} ${(i === 2 || i === 3) ? 'md:border-b-0' : ''}`}
              >
                <img 
                  src={project.imageUrl} 
                  alt={language === 'cs' ? project.titleCs : project.titleUk}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="mb-4 text-2xl font-display font-bold uppercase tracking-tight text-foreground drop-shadow-md md:text-3xl">
                      {language === "cs" ? project.titleCs : project.titleUk}
                    </h3>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-4 block bg-background/90 w-fit px-3 py-1 rounded-md">
                      {localizeText(project.category, language)}
                    </span>
                    <p className="text-muted-foreground text-sm tracking-widest uppercase">
                      {project.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-24 text-center">
            <Link href="/projekty" className="btn-premium btn-outline">
              {t("Všechny projekty", "Всі проєкти")}
            </Link>
          </div>
        </div>
      </section>

      {visibleTestimonials.length > 0 && (
        <section id="testimonials" className="relative overflow-hidden border-t border-border bg-background py-28">
          <div className="pointer-events-none absolute right-[-4rem] top-[-5rem] text-primary/[0.035]">
            <Quote className="h-80 w-80 fill-current" />
          </div>
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="h-px w-10 bg-primary" />
                  {t("Zkušenosti klientů", "Досвід клієнтів")}
                </div>
                <h2 className="mb-6 text-5xl font-display font-bold uppercase tracking-tight md:text-7xl">
                  {t("Reference", "Відгуки")}<span className="text-primary">.</span>
                </h2>
                <p className="max-w-2xl text-xl font-light leading-relaxed text-muted-foreground">
                  {t(
                    "Důvěra se staví výsledky. Přečtěte si zkušenosti klientů s naší prací.",
                    "Довіра будується результатами. Прочитайте відгуки клієнтів про нашу роботу.",
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[#D4AF37]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.article
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.07 }}
                  className="group flex min-h-80 flex-col rounded-xl border border-border/70 bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/35 sm:p-9"
                >
                  <div className="mb-8 flex items-start justify-between gap-5">
                    <Quote className="h-9 w-9 fill-primary/10 text-primary" />
                    <div className="flex gap-1 text-[#D4AF37]" aria-label={`${testimonial.rating} / 5`}>
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${starIndex < testimonial.rating ? "fill-current" : "opacity-25"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="flex-1 text-lg font-light leading-8 text-foreground/90">
                    “{language === "cs" ? testimonial.textCs : testimonial.textUk}”
                  </blockquote>
                  <div className="mt-9 border-t border-border pt-5">
                    <p className="font-display text-lg font-bold uppercase tracking-tight">{testimonial.name}</p>
                    {testimonial.project && (
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                        {localizeText(testimonial.project, language)}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Heavy Architectural CTA */}
      <section className="py-32 relative bg-background border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight uppercase">
              {t("Máte projekt", "Маєте проєкт")}<span className="text-primary">?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 font-light leading-relaxed">
              {t("Spojte se s námi. Připravíme pro vás jasný plán, férový rozpočet a zajistíme perfektní realizaci.", "Зв'яжіться з нами. Ми підготуємо для вас чіткий план, чесний бюджет та забезпечимо ідеальну реалізацію.")}
            </p>
          </div>
          
          <div className="lg:w-1/2 w-full flex flex-col sm:flex-row gap-6 lg:justify-end">
            <a href={`tel:${content?.phone}`} className="btn-premium btn-primary text-center">
              {content?.phone}
            </a>
            <Link href="/kontakt" className="btn-premium btn-outline text-center">
              {t("Napsat zprávu", "Написати повідомлення")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
