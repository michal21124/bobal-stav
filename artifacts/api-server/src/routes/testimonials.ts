import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  CreateTestimonialBody,
  CreateTestimonialResponse,
  DeleteTestimonialParams,
  ListAdminTestimonialsResponse,
  ListTestimonialsResponse,
  UpdateTestimonialBody,
  UpdateTestimonialParams,
  UpdateTestimonialResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.featured, true))
    .orderBy(desc(testimonialsTable.createdAt));
  res.json(ListTestimonialsResponse.parse(testimonials));
});

router.get("/admin/testimonials", requireAdmin, async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(desc(testimonialsTable.createdAt));
  res.json(ListAdminTestimonialsResponse.parse(testimonials));
});

router.post("/testimonials", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success || !Number.isInteger(parsed.data?.rating ?? 5)) {
    res.status(400).json({ error: parsed.success ? "Rating must be a whole number." : parsed.error.message });
    return;
  }
  const [created] = await db.insert(testimonialsTable).values({
    ...parsed.data,
    project: parsed.data.project?.trim() || null,
  }).returning();
  res.status(201).json(CreateTestimonialResponse.parse(created));
});

router.patch("/testimonials/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateTestimonialParams.safeParse(req.params);
  const parsed = UpdateTestimonialBody.safeParse(req.body);
  if (!params.success || !parsed.success || (parsed.data.rating !== undefined && !Number.isInteger(parsed.data.rating))) {
    res.status(400).json({ error: "Invalid testimonial data." });
    return;
  }
  const [updated] = await db
    .update(testimonialsTable)
    .set({
      ...parsed.data,
      ...(parsed.data.project !== undefined ? { project: parsed.data.project.trim() || null } : {}),
      updatedAt: new Date(),
    })
    .where(eq(testimonialsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.json(UpdateTestimonialResponse.parse(updated));
});

router.delete("/testimonials/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteTestimonialParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid testimonial id." });
    return;
  }
  const [deleted] = await db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;