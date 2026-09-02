import { useState } from "react";
import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { useListGalleryItems } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function Projects() {
  const { t, language } = useLanguage();
  const { data: projects, isLoading } = useListGalleryItems();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background">
      <div className="w-12 h-12 border border-primary border-t-transparent animate-spin"></div>
    </div>;
  }

  const allCategories = projects ? Array.from(new Set(projects.map(p => p.category))) : [];
  
  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects?.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 lg:px-12 bg-background">
      <div className="max-w-4xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <span className="w-8 h-[1px] bg-primary"></span>
            {t("Naše práce", "Наша робота")}
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight uppercase leading-[0.9]">
            {t("Projekty", "Проєкти")}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light border-l border-primary pl-6">
            {t("Výsledek naší práce mluví za vše. Prohlédněte si projekty, na které jsme hrdí.", "Результат нашої роботи говорить сам за себе. Перегляньте проєкти, якими ми пишаємося.")}
          </p>
        </motion.div>
      </div>

      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-16 pb-6 border-b border-border">
          <button
            onClick={() => setActiveCategory("all")}
            className={`text-xs tracking-[0.2em] uppercase font-bold transition-colors pb-2 border-b ${
              activeCategory === "all" 
                ? "text-primary border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t("Vše", "Всі")}
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs tracking-[0.2em] uppercase font-bold transition-colors pb-2 border-b ${
                activeCategory === cat 
                  ? "text-primary border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
                    {localizeText(cat, language)}
            </button>
          ))}
        </div>
      )}

      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`group relative overflow-hidden aspect-square bg-background border-b border-border ${index % 2 === 0 ? 'md:border-r' : ''}`}
            >
              <img 
                src={project.imageUrl} 
                alt={language === 'cs' ? project.titleCs : project.titleUk}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-4 block bg-background/90 w-fit px-3 py-1 rounded-md">
                    {localizeText(project.category, language)}
                  </span>
                  <p className="text-muted-foreground text-sm tracking-widest uppercase flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> {project.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-border">
          <p className="text-xl font-light text-muted-foreground">
            {t("V této kategorii zatím nejsou žádné projekty.", "У цій категорії поки немає проєктів.")}
          </p>
        </div>
      )}
    </div>
  );
}
