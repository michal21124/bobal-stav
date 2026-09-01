import { Router, type IRouter } from "express";
import { db, galleryItemsTable, siteContentTable } from "@workspace/db";
import { GetAdminSummaryResponse } from "@workspace/api-zod";
import { DEFAULT_GALLERY } from "./gallery";
import { DEFAULT_SITE_CONTENT } from "./site-content";
import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  requireAdmin,
} from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/admin/session", getAdminSession);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", logoutAdmin);

router.get("/admin/summary", requireAdmin, async (_req, res): Promise<void> => {
  let [content] = await db.select().from(siteContentTable).limit(1);
  if (!content) {
    [content] = await db.insert(siteContentTable).values(DEFAULT_SITE_CONTENT).returning();
  }

  let gallery = await db.select().from(galleryItemsTable);
  if (gallery.length === 0) {
    gallery = await db.insert(galleryItemsTable).values(DEFAULT_GALLERY).returning();
  }

  res.json(
    GetAdminSummaryResponse.parse({
      galleryCount: gallery.length,
      featuredCount: gallery.filter((item) => item.featured).length,
      serviceCount: content.services.length,
      lastUpdated: content.updatedAt.toISOString(),
    }),
  );
});

export default router;