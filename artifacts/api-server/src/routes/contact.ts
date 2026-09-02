import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";

const router: IRouter = Router();

function isEmail(value: unknown): value is string {
  return typeof value === "string" &&
    value.trim().length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

router.post("/contact", async (req, res): Promise<void> => {
  const data = req.body as Record<string, unknown>;
  if (typeof data.website === "string" && data.website.trim().length > 0) {
    res.status(201).json({ received: true });
    return;
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const service = typeof data.service === "string" ? data.service.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (
    name.length < 2 || name.length > 120 ||
    !isEmail(email) ||
    phone.length > 40 ||
    service.length > 120 ||
    message.length < 10 || message.length > 5000
  ) {
    res.status(400).json({ error: "Please check the required fields." });
    return;
  }

  await db.insert(contactMessagesTable).values({
    name,
    email,
    phone: phone || null,
    service: service || null,
    message,
  });
  res.status(201).json({ received: true });
});

export default router;