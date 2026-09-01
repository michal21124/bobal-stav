import { createInsertSchema } from "drizzle-zod";
import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  phone: text("phone").notNull(),
  registrationNumber: text("registration_number").notNull(),
  foundedDate: text("founded_date").notNull(),
  address: text("address").notNull(),
  status: text("status").notNull(),
  services: jsonb("services").$type<string[]>().notNull(),
  aboutCs: text("about_cs").notNull(),
  aboutUk: text("about_uk").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContentTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContentTable.$inferSelect;