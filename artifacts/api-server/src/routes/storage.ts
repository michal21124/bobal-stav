import { Readable } from "node:stream";
import {
  RequestImageUploadUrlBody,
  RequestImageUploadUrlResponse,
} from "@workspace/api-zod";
import { Router, type IRouter, type Request, type Response } from "express";
import { requireAdmin } from "../lib/admin-auth";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

router.post(
  "/storage/uploads/request-url",
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = RequestImageUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Missing or invalid upload fields" });
      return;
    }

    const { size, contentType } = parsed.data;
    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      res.status(400).json({ error: "Only JPG, PNG and WebP images are supported" });
      return;
    }
    if (size <= 0 || size > MAX_IMAGE_BYTES) {
      res.status(400).json({ error: "Image must be between 1 byte and 10 MB" });
      return;
    }

    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      res.json(
        RequestImageUploadUrlResponse.parse({
          uploadURL,
          objectPath,
          metadata: parsed.data,
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, "Error generating upload URL");
      res.status(503).json({ error: "Photo storage is unavailable" });
    }
  },
);

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectFile = await objectStorageService.getObjectEntityFile(
      `/objects/${wildcardPath}`,
    );
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    if (response.body) {
      Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving stored photo");
    res.status(500).json({ error: "Failed to serve stored photo" });
  }
});

export default router;