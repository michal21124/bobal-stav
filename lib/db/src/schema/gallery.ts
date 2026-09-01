import { createInsertSchema } from "drizzle-zod";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const galleryItemsTable = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  titleCs: text("title_cs").notNull(),
  titleUk: text("title_uk").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItemsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItemsTable.$inferSelect;