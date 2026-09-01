import { useLanguage } from "@/contexts/LanguageContext";
import { useGetSiteContent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Award, Clock, Users, Shield } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  const { data: content, isLoading } = useGetSiteContent();

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background">
      <div className="w-12 h-12 border border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  const aboutText = language === 'cs' ? content?.aboutCs : content?.aboutUk;

  return (
    <div className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 lg:px-12 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <span className="w-8 h-[1px] bg-primary"></span>
            {t("O společnosti", "Про компанію")}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-10 leading-[0.9] uppercase tracking-tight">
            {t("Stavíme s důrazem na", "Будуємо з акцентом на")} <br/>
            <span className="text-primary">{t("Detail", "Деталі")}</span>.
          </h1>
          <div className="text-lg md:text-xl font-light text-muted-foreground whitespace-pre-wrap leading-relaxed border-l border-border pl-6">
            {aboutText}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative"
        >
          <div className="bg-card border border-border p-10 md:p-16">
            <h3 className="text-2xl font-display font-bold mb-10 uppercase tracking-tight border-b border-border pb-6">
              {t("Firemní údaje", "Дані компанії")}
            </h3>
            <ul className="space-y-8">
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("Název společnosti", "Назва компанії")}</span>
                <span className="font-display text-2xl font-bold">{content?.companyName}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("Sídlo", "Місцезнаходження")}</span>
                <span className="text-lg text-foreground font-light">{content?.address}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">IČO</span>
                <span className="text-xl text-primary font-bold">{content?.registrationNumber}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("Datum založení", "Дата заснування")}</span>
                <span className="text-lg text-foreground font-light">{content?.foundedDate}</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-border pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
          {[
            { icon: <Award className="w-8 h-8" />, title: t("Kvalita", "Якість"), desc: t("Používáme ověřené materiály", "Використовуємо перевірені матеріали") },
            { icon: <Clock className="w-8 h-8" />, title: t("Spolehlivost", "Надійність"), desc: t("Dodržujeme domluvené termíny", "Дотримуємось домовлених термінів") },
            { icon: <Users className="w-8 h-8" />, title: t("Zkušenosti", "Досвід"), desc: t("Tým odborníků s praxí", "Команда фахівців з досвідом") },
            { icon: <Shield className="w-8 h-8" />, title: t("Záruka", "Гарантія"), desc: t("Ručíme za naši práci", "Відповідаємо за нашу роботу") },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-10 bg-background border-b md:border-b-0 border-border md:border-r last:border-r-0 hover:bg-card transition-colors duration-500"
            >
              <div className="text-primary mb-8 opacity-80">
                {value.icon}
              </div>
              <h4 className="text-2xl font-bold font-display mb-4 uppercase tracking-tight">{value.title}</h4>
              <p className="text-muted-foreground font-light">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
