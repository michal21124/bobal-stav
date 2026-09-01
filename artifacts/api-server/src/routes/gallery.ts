import { Router, type IRouter } from "express";
import { db, galleryItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateGalleryItemBody,
  CreateGalleryItemResponse,
  DeleteGalleryItemParams,
  ListGalleryItemsResponse,
  UpdateGalleryItemBody,
  UpdateGalleryItemParams,
  UpdateGalleryItemResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

const DEFAULT_GALLERY = [
  {
    titleCs: "Kompletní rekonstrukce interiéru",
    titleUk: "Комплексна реконструкція інтер’єру",
    category: "Rekonstrukce / Реконструкція",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    location: "Praha 8",
    featured: true,
  },
  {
    titleCs: "Precizní zednické práce",
    titleUk: "Точні мурувальні роботи",
    category: "Zednictví / Мурування",
    imageUrl:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=85",
    location: "Praha a okolí",
    featured: true,
  },
  {
    titleCs: "Moderní koupelna na míru",
    titleUk: "Сучасна ванна кімната на замовлення",
    category: "Koupelny / Ванні кімнати",
    imageUrl:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=85",
    location: "Praha 6",
    featured: false,
  },
  {
    titleCs: "Fasáda a zateplení domu",
    titleUk: "Фасад та утеплення будинку",
    category: "Fasády / Фасади",
    imageUrl:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
    location: "Středočeský kraj",
    featured: false,
  },
  {
    titleCs: "Pokládka dlažby",
    titleUk: "Укладання плитки",
    category: "Podlahy / Підлоги",
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85",
    location: "Praha 2",
    featured: false,
  },
  {
    titleCs: "Příprava stavby a betonáž",
    titleUk: "Підготовка будівництва та бетонування",
    category: "Beton / Бетон",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85",
    location: "Praha 10",
    featured: false,
  },
];

async function ensureGallery() {
  const existing = await db.select().from(galleryItemsTable);
  if (existing.length > 0) return existing;
  return db.insert(galleryItemsTable).values(DEFAULT_GALLERY).returning();
}

function toPublicItem(
  item: typeof galleryItemsTable.$inferSelect,
  req: { protocol: string; get(name: string): string | undefined },
) {
  const apiBase = (process.env.PUBLIC_API_URL ||
    `${req.protocol}://${req.get("host") || "localhost"}`).replace(/\/+$/, "");
  const imageUrl = item.imageUrl.startsWith("/objects/")
    ? `${apiBase}/api/storage${item.imageUrl}`
    : item.imageUrl;

  return {
    id: item.id,
    titleCs: item.titleCs,
    titleUk: item.titleUk,
    category: item.category,
    imageUrl,
    location: item.location,
    featured: item.featured,
  };
}

router.get("/gallery", async (req, res): Promise<void> => {
  const items = await ensureGallery();
  res.json(ListGalleryItemsResponse.parse(items.map((item) => toPublicItem(item, req))));
});

router.post("/gallery", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid gallery item body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [created] = await db
    .insert(galleryItemsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(CreateGalleryItemResponse.parse(toPublicItem(created, req)));
});

router.patch("/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(galleryItemsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(galleryItemsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }
  res.json(UpdateGalleryItemResponse.parse(toPublicItem(updated, req)));
});

router.delete("/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(galleryItemsTable)
    .where(eq(galleryItemsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }
  res.sendStatus(204);
});

export { DEFAULT_GALLERY };
export default router;