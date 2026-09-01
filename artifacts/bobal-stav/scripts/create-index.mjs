import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const artifactRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(artifactRoot, "index.html");
const tag = "<";

const html = [
  `${tag}!DOCTYPE html>`,
  `${tag}html lang="cs">`,
  `  ${tag}head>`,
  `    ${tag}meta charset="UTF-8" />`,
  `    ${tag}meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />`,
  `    ${tag}title>Bobal Stav | Rekonstrukce a stavební práce Praha${tag}/title>`,
  `    ${tag}meta name="description" content="Bobal Stav provádí rekonstrukce bytů a domů, zednické práce, fasády, obklady a dlažby v Praze a okolí. Spolehlivě a kvalitně." />`,
  `    ${tag}meta name="robots" content="index, follow" />`,
  `    ${tag}meta name="application-name" content="Bobal Stav" />`,
  `    ${tag}meta name="author" content="Bobal Stav s.r.o." />`,
  `    ${tag}meta name="geo.region" content="CZ-10" />`,
  `    ${tag}meta name="geo.placename" content="Praha" />`,
  `    ${tag}meta name="theme-color" content="#101110" />`,
  `    ${tag}meta property="og:title" content="Bobal Stav | Rekonstrukce a stavební práce Praha" />`,
  `    ${tag}meta property="og:description" content="Bobal Stav provádí rekonstrukce bytů a domů, zednické práce, fasády, obklady a dlažby v Praze a okolí. Spolehlivě a kvalitně." />`,
  `    ${tag}meta property="og:type" content="website" />`,
  `    ${tag}meta property="og:site_name" content="Bobal Stav" />`,
  `    ${tag}meta property="og:locale" content="cs_CZ" />`,
  `    ${tag}meta property="og:url" content="https://bobalstav.cz/" />`,
  `    ${tag}meta property="og:image" content="https://bobalstav.cz/service-renovation.png" />`,
  `    ${tag}meta property="og:image:width" content="1024" />`,
  `    ${tag}meta property="og:image:height" content="1024" />`,
  `    ${tag}meta property="og:image:alt" content="Rekonstrukční práce společnosti Bobal Stav" />`,
  `    ${tag}meta name="twitter:card" content="summary_large_image" />`,
  `    ${tag}meta name="twitter:title" content="Bobal Stav | Rekonstrukce a stavební práce Praha" />`,
  `    ${tag}meta name="twitter:description" content="Bobal Stav provádí rekonstrukce bytů a domů, zednické práce, fasády, obklady a dlažby v Praze a okolí." />`,
  `    ${tag}meta name="twitter:image" content="https://bobalstav.cz/service-renovation.png" />`,
  `    ${tag}meta name="twitter:image:alt" content="Rekonstrukční práce společnosti Bobal Stav" />`,
  `    ${tag}link rel="canonical" href="https://bobalstav.cz/" />`,
  `    ${tag}link rel="icon" type="image/svg+xml" href="/favicon.svg" />`,
  `    ${tag}link rel="icon" type="image/png" sizes="96x36" href="/bobal-stav-logo.png" />`,
  `    ${tag}link rel="shortcut icon" type="image/png" href="/bobal-stav-logo.png" />`,
  `    ${tag}link rel="apple-touch-icon" href="/bobal-stav-logo.png" />`,
  `    ${tag}link rel="manifest" href="/site.webmanifest" />`,
  `    ${tag}link rel="image_src" href="/bobal-stav-logo.png" />`,
  `    ${tag}link rel="preconnect" href="https://fonts.googleapis.com">`,
  `    ${tag}link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
  `    ${tag}link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`,
  `    ${tag}!-- BOBAL_STAV_JSON_LD -->`,
  `  ${tag}/head>`,
  `  ${tag}body>`,
  `    ${tag}div id="root">${tag}/div>`,
  `    ${tag}script type="module" src="/src/main.tsx">${tag}/script>`,
  `  ${tag}/body>`,
  `${tag}/html>`,
  "",
].join("\n");

await writeFile(outputPath, html, "utf8");