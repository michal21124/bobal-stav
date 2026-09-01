import { Router, type IRouter } from "express";
import { db, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetSiteContentResponse,
  UpdateSiteContentBody,
  UpdateSiteContentResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";

export const DEFAULT_SITE_CONTENT = {
  companyName: "Bobal Stav s.r.o.",
  phone: "+420 731 988 868",
  registrationNumber: "21488711",
  foundedDate: "22. 04. 2024",
  address: "Křižíkova 180/28, 186 00 Praha–Karlín",
  status: "Aktivní / Aktivní",
  services: [
    "Rekonstrukce bytů a domů / Реконструкція квартир і будинків",
    "Zednické práce / Мурувальні роботи",
    "Sádrokartony, omítky a štukování / Гіпсокартон, штукатурка та шпаклювання",
    "Malování, obklady a dlažby / Фарбування, облицювання та плитка",
    "Zámková dlažba a betonářské práce / Бруківка та бетонні роботи",
    "Fasády, zateplení a dokončovací práce / Фасади, утеплення та оздоблювальні роботи",
  ],
  aboutCs:
    "Bobal Stav s.r.o. nabízí kompletní stavební a rekonstrukční práce v Praze a okolí. Provádíme rekonstrukce bytů, domů a koupelen, zednické práce, sádrokartony, omítky, štukování, malování, obklady a dlažby. Zajišťujeme také pokládku zámkové dlažby, betonářské práce, fasády a zateplení, bourací a přípravné práce, pokládku podlah a další dokončovací práce.",
  aboutUk:
    "Bobal Stav s.r.o. виконує комплексні будівельні та ремонтні роботи в Празі та околицях. Ми робимо реконструкцію квартир, будинків і ванних кімнат, мурування, гіпсокартон, штукатурку, шпаклювання, фарбування, облицювання та плитку. Також виконуємо укладання бруківки, бетонні роботи, фасади й утеплення, демонтажні та підготовчі роботи, укладання підлог та інші оздоблювальні роботи.",
};

const router: IRouter = Router();

async function ensureContent() {
  const [existing] = await db.select().from(siteContentTable).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(siteContentTable).values(DEFAULT_SITE_CONTENT).returning();
  return created;
}

function toPublicContent(content: typeof siteContentTable.$inferSelect) {
  return {
    companyName: content.companyName,
    phone: content.phone,
    registrationNumber: content.registrationNumber,
    foundedDate: content.foundedDate,
    address: content.address,
    status: content.status,
    services: content.services,
    aboutCs: content.aboutCs,
    aboutUk: content.aboutUk,
  };
}

router.get("/content", async (req, res): Promise<void> => {
  req.log.info("Fetching site content");
  const content = await ensureContent();
  res.json(GetSiteContentResponse.parse(toPublicContent(content)));
});

router.patch("/content", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSiteContentBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid site content body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const current = await ensureContent();
  const [updated] = await db
    .update(siteContentTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(siteContentTable.id, current.id))
    .returning();

  res.json(UpdateSiteContentResponse.parse(toPublicContent(updated)));
});

export default router;