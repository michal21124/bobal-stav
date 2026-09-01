import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const SITE_URL = "https://bobalstav.cz";
const SOCIAL_IMAGE = `${SITE_URL}/service-renovation.png`;

const pageMeta = {
  "/": {
    cs: {
      title: "Bobal Stav | Rekonstrukce a stavební práce Praha",
      description: "Bobal Stav provádí rekonstrukce bytů a domů, zednické práce, fasády, obklady a dlažby v Praze a okolí. Spolehlivě a kvalitně.",
    },
    uk: {
      title: "Bobal Stav | Ремонт і будівельні роботи у Празі",
      description: "Bobal Stav виконує реконструкцію квартир і будинків, мурування, фасади, облицювання та плитку у Празі й околицях.",
    },
  },
  "/sluzby": {
    cs: {
      title: "Stavební práce a rekonstrukce Praha | Bobal Stav",
      description: "Kompletní rekonstrukce, zednické práce, sádrokartony, omítky, malování, dlažby, betonáže, fasády a zateplení v Praze.",
    },
    uk: {
      title: "Будівельні послуги та ремонт у Празі | Bobal Stav",
      description: "Реконструкція, мурування, гіпсокартон, штукатурка, фарбування, плитка, бетонні роботи, фасади й утеплення у Празі.",
    },
  },
  "/projekty": {
    cs: {
      title: "Realizované stavební projekty Praha | Bobal Stav",
      description: "Prohlédněte si realizované rekonstrukce, koupelny, fasády, dlažby a další stavební projekty Bobal Stav v Praze a okolí.",
    },
    uk: {
      title: "Реалізовані будівельні проєкти у Празі | Bobal Stav",
      description: "Перегляньте реалізовані ремонти, ванні кімнати, фасади, плитку та інші будівельні проєкти Bobal Stav у Празі.",
    },
  },
  "/o-nas": {
    cs: {
      title: "O stavební firmě Bobal Stav | Praha",
      description: "Poznejte Bobal Stav s.r.o., spolehlivou stavební firmu pro rekonstrukce a dokončovací práce v Praze a Středočeském kraji.",
    },
    uk: {
      title: "Про будівельну компанію Bobal Stav | Прага",
      description: "Дізнайтеся про Bobal Stav s.r.o. — надійну будівельну компанію для ремонту та оздоблювальних робіт у Празі й околицях.",
    },
  },
  "/kontakt": {
    cs: {
      title: "Kontakt na stavební firmu Praha | Bobal Stav",
      description: "Kontaktujte Bobal Stav a domluvte si nezávaznou konzultaci stavebních nebo rekonstrukčních prací v Praze a okolí.",
    },
    uk: {
      title: "Контакти будівельної компанії у Празі | Bobal Stav",
      description: "Зв’яжіться з Bobal Stav та домовтеся про безкоштовну консультацію щодо будівельних або ремонтних робіт у Празі.",
    },
  },
} as const;

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo() {
  const [location] = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const isAdmin = location.startsWith("/admin");
    const isPublicRoute = location in pageMeta;
    const route = isPublicRoute ? location as keyof typeof pageMeta : "/";
    const isNoIndex = isAdmin || !isPublicRoute;
    const meta = isAdmin
      ? {
          title: "Administrace | Bobal Stav",
          description: "Zabezpečená administrace webu Bobal Stav.",
        }
      : isPublicRoute
        ? pageMeta[route][language]
        : {
            title: language === "cs" ? "Stránka nenalezena | Bobal Stav" : "Сторінку не знайдено | Bobal Stav",
            description: language === "cs" ? "Požadovaná stránka nebyla nalezena." : "Запитану сторінку не знайдено.",
          };
    const canonicalPath = route === "/" ? "/" : route;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.documentElement.lang = language === "cs" ? "cs-CZ" : "uk-UA";
    document.title = meta.title;

    setMeta('meta[name="description"]', "name", "description", meta.description);
    setMeta('meta[name="robots"]', "name", "robots", isNoIndex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    setMeta('meta[property="og:description"]', "property", "og:description", meta.description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:locale"]', "property", "og:locale", language === "cs" ? "cs_CZ" : "uk_UA");
    setMeta('meta[property="og:image"]', "property", "og:image", SOCIAL_IMAGE);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", SOCIAL_IMAGE);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [language, location]);

  return null;
}