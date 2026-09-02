export type ServiceDefinition = {
  slug: string;
  titleCs: string;
  titleUk: string;
  image: string;
  matches: string[];
  descCs: string;
  descUk: string;
  longCs: string;
  longUk: string;
  benefitsCs: string[];
  benefitsUk: string[];
  stepsCs: string[];
  stepsUk: string[];
};

const fallbackImages = [
  "/service-renovation.png",
  "/service-masonry.png",
  "/service-drywall.png",
  "/service-painting.png",
  "/service-paving.png",
  "/service-facade.png",
];

export const serviceDefinitions: ServiceDefinition[] = [
  {
    slug: "rekonstrukce",
    titleCs: "Rekonstrukce bytů a domů",
    titleUk: "Реконструкція квартир і будинків",
    image: "/service-renovation.png",
    matches: ["rekonstruk", "реконструк"],
    descCs: "Kompletní i částečné rekonstrukce bytů, domů a jednotlivých místností.",
    descUk: "Повна та часткова реконструкція квартир, будинків і окремих приміщень.",
    longCs: "Postaráme se o rekonstrukci od prvního zaměření a návrhu řešení až po poslední detail. Koordinujeme jednotlivé profese, hlídáme návaznosti prací a průběžně komunikujeme stav zakázky, aby výsledek odpovídal vašemu prostoru i rozpočtu.",
    longUk: "Ми беремо на себе реконструкцію від першого обмірювання та проєкту рішення до останньої деталі. Координуємо різні етапи, контролюємо послідовність робіт і постійно повідомляємо про стан замовлення, щоб результат відповідав вашому простору та бюджету.",
    benefitsCs: ["Rekonstrukce bytů, domů a koupelen", "Koordinace stavebních a dokončovacích prací", "Příprava podkladů, rozvodů a povrchů", "Čisté předání hotového prostoru"],
    benefitsUk: ["Реконструкція квартир, будинків і ванних кімнат", "Координація будівельних та оздоблювальних робіт", "Підготовка основ, комунікацій і поверхонь", "Акуратна здача готового приміщення"],
    stepsCs: ["Prohlídka prostoru a upřesnění zadání", "Návrh postupu, rozpočtu a termínu", "Realizace prací a průběžná kontrola", "Dokončení, úklid a předání"],
    stepsUk: ["Огляд приміщення та уточнення завдання", "План робіт, кошторис і терміни", "Виконання та постійний контроль", "Завершення, прибирання і здача"],
  },
  {
    slug: "zednicke-prace",
    titleCs: "Zednické práce",
    titleUk: "Мурувальні роботи",
    image: "/service-masonry.png",
    matches: ["zednick", "zednict", "мур", "кладк"],
    descCs: "Přesné zdění, betonáže a opravy konstrukcí s důrazem na pevnost a čisté provedení.",
    descUk: "Точне мурування, бетонування та ремонт конструкцій з акцентом на міцність і акуратність.",
    longCs: "Provádíme zednické práce pro novostavby, rekonstrukce i opravy. Umíme připravit nové příčky, dozdívky, ostění, opravy zdiva i betonářské práce tak, aby na ně mohly bez problémů navázat další řemesla.",
    longUk: "Виконуємо мурувальні роботи для новобудов, реконструкцій і ремонтів. Робимо нові перегородки, добудови, укоси, ремонт кладки та бетонні роботи, щоб наступні етапи оздоблення проходили без проблем.",
    benefitsCs: ["Příčky, dozdívky a zazdívky", "Opravy prasklin a poškozeného zdiva", "Betonáže a příprava konstrukcí", "Rovné a přesné podklady pro další práce"],
    benefitsUk: ["Перегородки, добудови та закладення отворів", "Ремонт тріщин і пошкодженої кладки", "Бетонування та підготовка конструкцій", "Рівні й точні основи для наступних робіт"],
    stepsCs: ["Zaměření a kontrola stávající konstrukce", "Volba vhodného materiálu a technologie", "Zdění, opravy nebo betonáž", "Kontrola rovnosti a úklid pracoviště"],
    stepsUk: ["Обмірювання та перевірка наявної конструкції", "Вибір відповідного матеріалу й технології", "Мурування, ремонт або бетонування", "Перевірка рівності та прибирання"],
  },
  {
    slug: "sadrokarton-omitky",
    titleCs: "Sádrokartony, omítky a štukování",
    titleUk: "Гіпсокартон, штукатурка та шпаклювання",
    image: "/service-drywall.png",
    matches: ["sádrokarton", "sadrokarton", "omít", "omit", "štuk", "штукатур", "гіпсокартон", "шпакл"],
    descCs: "Sádrokartonové konstrukce, nové omítky a štukování pro rovné a připravené povrchy.",
    descUk: "Гіпсокартонні конструкції, нова штукатурка та шпаклювання для рівних готових поверхонь.",
    longCs: "Vytvoříme rovné stěny, stropy i praktické sádrokartonové konstrukce. Dbáme na správnou přípravu podkladu, přesné napojení detailů a finální povrch, který je připravený pro malování, tapety nebo další dekorativní úpravy.",
    longUk: "Створюємо рівні стіни, стелі та практичні гіпсокартонні конструкції. Дбаємо про правильну підготовку основи, точні стики й фінальну поверхню, готову до фарбування, шпалер або іншого декору.",
    benefitsCs: ["Příčky, předstěny a podhledy", "Strojní i ruční omítky", "Štukování, perlinky a vyrovnání", "Povrchy připravené pro finální úpravu"],
    benefitsUk: ["Перегородки, облицювання та підвісні стелі", "Машинна та ручна штукатурка", "Шпаклювання, армування та вирівнювання", "Поверхні, готові до фінішного оздоблення"],
    stepsCs: ["Kontrola vlhkosti a stavu podkladu", "Příprava konstrukce nebo kontaktní vrstvy", "Nanesení, vyrovnání a vyzrání materiálu", "Broušení a finální kontrola povrchu"],
    stepsUk: ["Перевірка вологості та стану основи", "Підготовка каркаса або контактного шару", "Нанесення, вирівнювання та висихання матеріалу", "Шліфування й фінальна перевірка поверхні"],
  },
  {
    slug: "malovani-obklady-dlazby",
    titleCs: "Malování, obklady a dlažby",
    titleUk: "Фарбування, облицювання та плитка",
    image: "/service-tiling.png",
    matches: ["malov", "obklad", "dlaž", "dlaz", "фарб", "плит", "облиц"],
    descCs: "Precizní malování, obklady a dlažby pro čistý vzhled a dlouhou životnost interiéru.",
    descUk: "Точне фарбування, облицювання та плитка для охайного вигляду й довговічності інтер’єру.",
    longCs: "Dokončovací práce rozhodují o výsledném dojmu z celého prostoru. Připravíme podklad, poradíme s vhodným postupem a pečlivě provedeme malování i pokládku obkladů a dlažeb v koupelnách, kuchyních, chodbách i na terasách.",
    longUk: "Саме фінішні роботи визначають враження від усього простору. Ми підготуємо основу, порадимо відповідну технологію та акуратно виконаємо фарбування й укладання плитки у ванних кімнатах, кухнях, коридорах і на терасах.",
    benefitsCs: ["Příprava a penetrace podkladů", "Malování stěn, stropů a detailů", "Obklady koupelen a kuchyní", "Dlažby v interiéru i exteriéru"],
    benefitsUk: ["Підготовка та ґрунтування поверхонь", "Фарбування стін, стель і деталей", "Облицювання ванних кімнат і кухонь", "Плитка в інтер’єрі та екстер’єрі"],
    stepsCs: ["Výběr materiálu a kontrola podkladu", "Zakrytí a ochrana okolních ploch", "Pokládka nebo malování v přesných návaznostech", "Spárování, retuše a úklid"],
    stepsUk: ["Вибір матеріалів і перевірка основи", "Захист сусідніх поверхонь", "Укладання або фарбування з точними стиками", "Затирка, корекції та прибирання"],
  },
  {
    slug: "zamkova-dlazba-beton",
    titleCs: "Zámková dlažba a betonářské práce",
    titleUk: "Бруківка та бетонні роботи",
    image: "/service-paving.png",
    matches: ["zámkov", "zamkov", "dlažb", "dlazb", "beton", "бруків", "бетон"],
    descCs: "Pokládka zámkové dlažby a betonářské práce pro chodníky, terasy, vjezdy i pevné plochy.",
    descUk: "Укладання бруківки та бетонні роботи для доріжок, терас, заїздів і міцних поверхонь.",
    longCs: "Připravíme venkovní plochy tak, aby dobře odváděly vodu, držely tvar a vydržely každodenní zatížení. Zajistíme podkladní vrstvy, obrubníky, betonové prvky i přesné položení dlažby podle využití prostoru.",
    longUk: "Підготуємо зовнішні поверхні так, щоб вони добре відводили воду, зберігали форму та витримували щоденні навантаження. Виконаємо основу, бордюри, бетонні елементи та точне укладання бруківки відповідно до призначення.",
    benefitsCs: ["Chodníky, terasy a příjezdové cesty", "Příprava podkladních vrstev a spádů", "Obrubníky, betonové plochy a schody", "Odolné provedení pro dlouhodobé používání"],
    benefitsUk: ["Доріжки, тераси та під’їзди", "Підготовка основи й ухилів", "Бордюри, бетонні майданчики та сходи", "Міцне виконання для довготривалого використання"],
    stepsCs: ["Zaměření plochy a návrh spádů", "Výkop, hutnění a příprava podkladu", "Osazení obrubníků a betonáž", "Pokládka, zavibrování a zapískování dlažby"],
    stepsUk: ["Обмірювання площі та планування ухилів", "Виїмка ґрунту, ущільнення й підготовка основи", "Встановлення бордюрів і бетонування", "Укладання, ущільнення та засипання швів"],
  },
  {
    slug: "fasady-zatepleni-dokoncovaci-prace",
    titleCs: "Fasády, zateplení a dokončovací práce",
    titleUk: "Фасади, утеплення та оздоблювальні роботи",
    image: "/service-facade.png",
    matches: ["fasád", "fasad", "zatepl", "доконч", "утепл", "фасад"],
    descCs: "Kompletní fasádní úpravy a zateplení pro lepší vzhled, komfort a energetickou úspornost.",
    descUk: "Комплексне оздоблення фасадів та утеплення для кращого вигляду, комфорту й енергоефективності.",
    longCs: "Fasáda chrání dům před počasím a zároveň výrazně ovlivňuje jeho vzhled i provozní náklady. Pomůžeme s přípravou podkladu, zateplovacím systémem, armovací vrstvou i finální strukturou tak, aby byla fasáda funkční a vizuálně sjednocená.",
    longUk: "Фасад захищає будинок від погодних умов і водночас впливає на його вигляд та витрати на опалення. Допоможемо з підготовкою основи, системою утеплення, армуванням і фінішною структурою, щоб фасад був функціональним і цілісним.",
    benefitsCs: ["Zateplení obvodových stěn", "Opravy a sjednocení fasád", "Armovací vrstvy a finální omítky", "Čisté napojení detailů a parapetů"],
    benefitsUk: ["Утеплення зовнішніх стін", "Ремонт і вирівнювання фасадів", "Армувальні шари та фінішна штукатурка", "Акуратне виконання стиків і підвіконь"],
    stepsCs: ["Prohlídka fasády a posouzení podkladu", "Návrh skladby a příprava detailů", "Montáž izolace a armovací vrstvy", "Finální omítka, nátěr a kontrola"],
    stepsUk: ["Огляд фасаду та оцінка основи", "Планування системи й підготовка деталей", "Монтаж утеплювача та армувального шару", "Фінішна штукатурка, фарбування й контроль"],
  },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getServiceDefinition(service: string, index = 0): ServiceDefinition {
  const normalized = service.toLocaleLowerCase();
  const match = serviceDefinitions.find((definition) =>
    definition.matches.some((term) => normalized.includes(term)),
  );

  if (match) return match;

  const titleCs = service.split(/\s*\/\s*/)[0].trim() || `Služba ${index + 1}`;
  const titleUk = service.split(/\s*\/\s*/)[1]?.trim() || titleCs;
  const image = fallbackImages[index % fallbackImages.length];
  return {
    slug: slugify(titleCs) || `sluzba-${index + 1}`,
    titleCs,
    titleUk,
    image,
    matches: [],
    descCs: "Profesionální realizace s důrazem na kvalitu, detail a dlouhou životnost.",
    descUk: "Професійна реалізація з акцентом на якість, деталі та довговічність.",
    longCs: "Každou zakázku připravujeme podle konkrétního prostoru, zadání a očekávání klienta. Před zahájením práce si společně upřesníme rozsah, materiály i harmonogram a během realizace udržujeme přehlednou komunikaci.",
    longUk: "Кожне замовлення ми готуємо відповідно до конкретного простору, завдання та очікувань клієнта. До початку робіт узгоджуємо обсяг, матеріали й графік, а під час реалізації підтримуємо зрозумілу комунікацію.",
    benefitsCs: ["Individuální posouzení prostoru", "Přehledný rozsah a harmonogram", "Pečlivé provedení detailů", "Předání čistého výsledku"],
    benefitsUk: ["Індивідуальна оцінка простору", "Зрозумілий обсяг і графік", "Уважне виконання деталей", "Акуратна здача результату"],
    stepsCs: ["Úvodní konzultace", "Příprava nabídky a postupu", "Realizace", "Kontrola a předání"],
    stepsUk: ["Початкова консультація", "Підготовка пропозиції та плану", "Реалізація", "Контроль і здача"],
  };
}

export function findServiceDefinition(slug: string) {
  return serviceDefinitions.find((definition) => definition.slug === slug);
}

export function getServiceHref(service: string, index = 0) {
  return `/sluzby/${getServiceDefinition(service, index).slug}`;
}