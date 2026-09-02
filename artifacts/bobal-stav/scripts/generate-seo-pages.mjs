import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const artifactRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(artifactRoot, "dist", "public");
const rootHtmlPath = path.join(outputRoot, "index.html");
const scriptTag = "<" + "script";
const structuredData = `    ${scriptTag} type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
            "@id": "https://bobalstav.cz/#business",
            "name": "Bobal Stav s.r.o.",
            "url": "https://bobalstav.cz/",
            "logo": "https://bobalstav.cz/bobal-stav-logo.png",
            "image": "https://bobalstav.cz/service-renovation.png",
            "telephone": "+420731988868",
            "foundingDate": "2024-04-22",
            "identifier": "21488711",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Křižíkova 180/28",
              "postalCode": "186 00",
              "addressLocality": "Praha–Karlín",
              "addressCountry": "CZ"
            },
            "areaServed": [
              { "@type": "City", "name": "Praha" },
              { "@type": "AdministrativeArea", "name": "Středočeský kraj" }
            ],
            "knowsLanguage": ["cs", "uk"]
          },
          {
            "@type": "WebSite",
            "@id": "https://bobalstav.cz/#website",
            "url": "https://bobalstav.cz/",
            "name": "Bobal Stav",
            "publisher": { "@id": "https://bobalstav.cz/#business" },
            "inLanguage": ["cs-CZ", "uk-UA"]
          }
        ]
      }
    ${"<" + "/script>"}`;

const pages = [
  {
    route: "/sluzby",
    title: "Stavební práce a rekonstrukce Praha | Bobal Stav",
    description: "Kompletní rekonstrukce, zednické práce, sádrokartony, omítky, malování, dlažby, betonáže, fasády a zateplení v Praze.",
  },
  {
    route: "/sluzby/rekonstrukce",
    title: "Rekonstrukce bytů a domů Praha | Bobal Stav",
    description: "Kompletní rekonstrukce bytů, domů a místností v Praze. Bobal Stav zajistí koordinaci prací od přípravy po finální dokončení.",
  },
  {
    route: "/sluzby/zednicke-prace",
    title: "Zednické práce Praha | Bobal Stav",
    description: "Přesné zdění, opravy konstrukcí, příčky a betonářské práce pro rekonstrukce i novostavby v Praze a okolí.",
  },
  {
    route: "/sluzby/sadrokarton-omitky",
    title: "Sádrokartony a omítky Praha | Bobal Stav",
    description: "Sádrokartonové konstrukce, omítky, štukování a příprava rovných povrchů pro dokončovací práce v Praze.",
  },
  {
    route: "/sluzby/malovani-obklady-dlazby",
    title: "Malování, obklady a dlažby Praha | Bobal Stav",
    description: "Precizní malování, obklady a dlažby v koupelnách, kuchyních, interiérech i exteriérech v Praze a okolí.",
  },
  {
    route: "/sluzby/zamkova-dlazba-beton",
    title: "Zámková dlažba a betonářské práce Praha | Bobal Stav",
    description: "Chodníky, terasy, vjezdy a betonové plochy s kvalitní přípravou podkladu a dlouhou životností.",
  },
  {
    route: "/sluzby/fasady-zatepleni-dokoncovaci-prace",
    title: "Fasády a zateplení Praha | Bobal Stav",
    description: "Fasádní úpravy, zateplení a dokončovací práce pro lepší vzhled, komfort a energetickou úspornost domu.",
  },
  {
    route: "/projekty",
    title: "Realizované stavební projekty Praha | Bobal Stav",
    description: "Prohlédněte si realizované rekonstrukce, koupelny, fasády, dlažby a další stavební projekty Bobal Stav v Praze a okolí.",
  },
  {
    route: "/o-nas",
    title: "O stavební firmě Bobal Stav | Praha",
    description: "Poznejte Bobal Stav s.r.o., spolehlivou stavební firmu pro rekonstrukce a dokončovací práce v Praze a Středočeském kraji.",
  },
  {
    route: "/kontakt",
    title: "Kontakt na stavební firmu Praha | Bobal Stav",
    description: "Kontaktujte Bobal Stav a domluvte si nezávaznou konzultaci stavebních nebo rekonstrukčních prací v Praze a okolí.",
  },
];

function replaceMeta(html, attribute, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(
    `<meta\\s+${attribute}="${escapedKey}"\\s+content="[^"]*"\\s*\\/?>`,
  );
  return html.replace(expression, `<meta ${attribute}="${key}" content="${value}" />`);
}

function buildPageHtml(source, page) {
  const canonicalRoute = page.route === "/" ? "/" : `${page.route}/`;
  const canonical = `https://bobalstav.cz${canonicalRoute}`;
  let html = source.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);

  html = replaceMeta(html, "name", "description", page.description);
  html = replaceMeta(html, "property", "og:title", page.title);
  html = replaceMeta(html, "property", "og:description", page.description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "name", "twitter:title", page.title);
  html = replaceMeta(html, "name", "twitter:description", page.description);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  return html;
}

const builtHtml = await readFile(rootHtmlPath, "utf8");
const rootHtml = builtHtml.replace("<!-- BOBAL_STAV_JSON_LD -->", structuredData);
await writeFile(rootHtmlPath, rootHtml, "utf8");

await Promise.all(
  pages.map(async (page) => {
    const routeDirectory = path.join(outputRoot, page.route.slice(1));
    await mkdir(routeDirectory, { recursive: true });
    await writeFile(
      path.join(routeDirectory, "index.html"),
      buildPageHtml(rootHtml, page),
      "utf8",
    );
  }),
);

console.log(`Generated ${pages.length} route-specific SEO pages.`);