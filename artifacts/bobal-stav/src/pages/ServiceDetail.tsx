import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { useGetSiteContent } from "@workspace/api-client-react";
import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { findServiceDefinition, getServiceDefinition } from "@/data/services";

export default function ServiceDetail() {
  const [, params] = useRoute("/sluzby/:slug");
  const { language, t } = useLanguage();
  const { data: content, isLoading } = useGetSiteContent();
  const slug = params?.slug ?? "";
  const customService = content?.services?.find((service, index) => getServiceDefinition(service, index).slug === slug);
  const service = findServiceDefinition(slug) ?? (customService ? getServiceDefinition(customService) : undefined);

  if (isLoading || !service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        {isLoading ? <div className="w-12 h-12 border border-primary border-t-transparent animate-spin" /> : <Link href="/sluzby" className="btn-premium btn-outline">{t("Zpět na služby", "Назад до послуг")}</Link>}
      </div>
    );
  }

  const title = customService ? localizeText(customService, language) : language === "cs" ? service.titleCs : service.titleUk;
  const description = language === "cs" ? service.descCs : service.descUk;
  const longDescription = language === "cs" ? service.longCs : service.longUk;
  const benefits = language === "cs" ? service.benefitsCs : service.benefitsUk;
  const steps = language === "cs" ? service.stepsCs : service.stepsUk;

  return (
    <div className="bg-background">
      <section className="relative min-h-[620px] flex items-end overflow-hidden">
        <img src={service.image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/10" />
        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-12 pt-44 pb-24">
          <Link href="/sluzby" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-primary transition-colors mb-14">
            <ArrowLeft className="w-4 h-4" />{t("Všechny služby", "Всі послуги")}
          </Link>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-7"><span className="w-10 h-px bg-primary" />{t("Stavební služba", "Будівельна послуга")}</div>
            <h1 className="max-w-4xl text-5xl sm:text-7xl md:text-8xl font-display font-bold uppercase leading-[0.9] tracking-tight">{title}<span className="text-primary">.</span></h1>
            <p className="mt-8 max-w-2xl text-xl md:text-2xl text-foreground/80 font-light leading-relaxed border-l-2 border-primary pl-5">{description}</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-28">
          <div>
            <div className="text-primary text-xs uppercase tracking-[0.2em] font-bold mb-6">{t("Řešení bez kompromisů", "Рішення без компромісів")}</div>
            <p className="text-2xl md:text-4xl leading-tight font-light text-foreground">{longDescription}</p>
          </div>
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-8">{t("Co služba zahrnuje", "Що входить у послугу")}</h2>
            <ul className="space-y-5">
              {benefits.map((benefit) => <li key={benefit} className="flex items-start gap-4 text-muted-foreground leading-relaxed"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />{benefit}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-card border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="max-w-2xl mb-16">
            <div className="text-primary text-xs uppercase tracking-[0.2em] font-bold mb-6">{t("Náš postup", "Наш процес")}</div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">{t("Od prvního kroku po hotový výsledek", "Від першого кроку до готового результату")}<span className="text-primary">.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-border">
            {steps.map((step, index) => (
              <div key={step} className="p-8 md:p-10 border-r border-b border-border min-h-[190px]">
                <div className="text-5xl font-display font-light text-primary/70 mb-8">{String(index + 1).padStart(2, "0")}</div>
                <p className="text-lg text-foreground font-medium leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="bg-primary text-primary-foreground p-10 md:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold mb-6"><Phone className="w-4 h-4" />{t("Promluvme si o vašem projektu", "Обговорімо ваш проєкт")}</div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-[0.95] tracking-tight">{t("Připravíme řešení na míru", "Підготуємо рішення саме для вас")}<span className="text-background">.</span></h2>
          </div>
          <Link href="/kontakt" className="btn-premium bg-background text-foreground hover:bg-background/85 shrink-0 group">{t("Nezávazná konzultace", "Безкоштовна консультація")}<ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
        </div>
      </section>
    </div>
  );
}