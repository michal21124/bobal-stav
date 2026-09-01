import { Readable } from "node:stream";
import {
  RequestImageUploadUrlBody,
  RequestImageUploadUrlResponse,
} from "@workspace/api-zod";
import express, {
  Router,
  type IRouter,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { requireAdmin } from "../lib/admin-auth";
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_DIRECT_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function imageBytesMatchType(contentType: string, bytes: Buffer) {
  if (contentType === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }
  if (contentType === "image/jpeg") {
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }
  return (
    contentType === "image/webp" &&
    bytes.length >= 12 &&
    bytes.subarray(0, 4).equals(Buffer.from("RIFF")) &&
    bytes.subarray(8, 12).equals(Buffer.from("WEBP"))
  );
}

function enforceDirectUploadLength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_DIRECT_UPLOAD_BYTES) {
    res.status(400).json({ error: "Image must be between 1 byte and 5 MB" });
    return;
  }
  next();
}

router.post(
  "/storage/uploads",
  requireAdmin,
  enforceDirectUploadLength,
  express.raw({
    type: ["image/jpeg", "image/png", "image/webp"],
    limit: MAX_DIRECT_UPLOAD_BYTES,
  }),
  async (req: Request, res: Response) => {
    const contentType = req.headers["content-type"]?.toLowerCase();
    if (!contentType || !ALLOWED_IMAGE_TYPES.has(contentType)) {
      res
        .status(400)
        .json({ error: "Only JPG, PNG and WebP images are supported" });
      return;
    }
    if (
      !Buffer.isBuffer(req.body) ||
      req.body.length <= 0 ||
      req.body.length > MAX_DIRECT_UPLOAD_BYTES
    ) {
      res.status(400).json({ error: "Image must be between 1 byte and 5 MB" });
      return;
    }
    if (!imageBytesMatchType(contentType, req.body)) {
      res
        .status(400)
        .json({ error: "Image content does not match its declared type" });
      return;
    }

    try {
      const extension =
        contentType === "image/jpeg"
          ? "jpg"
          : contentType.slice("image/".length);
      const objectPath = await objectStorageService.saveObjectEntity(
        req.body,
        contentType,
        extension,
      );
      res.status(201).json({ objectPath });
    } catch (error) {
      req.log.error({ err: error }, "Error storing uploaded photo");
      res.status(503).json({ error: "Photo storage is unavailable" });
    }
  },
);

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
      res
        .status(400)
        .json({ error: "Only JPG, PNG and WebP images are supported" });
      return;
    }
    if (size <= 0 || size > MAX_IMAGE_BYTES) {
      res.status(400).json({ error: "Image must be between 1 byte and 10 MB" });
      return;
    }

    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath =
        objectStorageService.normalizeObjectEntityPath(uploadURL);
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
