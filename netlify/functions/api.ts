import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import { getStore } from "@netlify/blobs";
import { getDatabase } from "@netlify/database";
import type { Config } from "@netlify/functions";

export const config: Config = { path: "/api/*" };

const COOKIE_NAME = "bobal_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
// Netlify Functions request payloads are limited to 6 MB. Keep raw image bytes
// at 5 MiB to remain below that platform limit.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function imageStore() {
  // Blobs receives its project context during Function invocation.
  return getStore("bobal-stav-images");
}

const DEFAULT_CONTENT = {
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

const DEFAULT_GALLERY = [
  [
    "Kompletní rekonstrukce interiéru",
    "Комплексна реконструкція інтер’єру",
    "Rekonstrukce / Реконструкція",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    "Praha 8",
    true,
  ],
  [
    "Precizní zednické práce",
    "Точні мурувальні роботи",
    "Zednictví / Мурування",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=85",
    "Praha a okolí",
    true,
  ],
  [
    "Moderní koupelna na míru",
    "Сучасна ванна кімната на замовлення",
    "Koupelny / Ванні кімнати",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=85",
    "Praha 6",
    false,
  ],
  [
    "Fasáda a zateplení domu",
    "Фасад та утеплення будинку",
    "Fasády / Фасади",
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
    "Středočeský kraj",
    false,
  ],
  [
    "Pokládka dlažby",
    "Укладання плитки",
    "Podlahy / Підлоги",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85",
    "Praha 2",
    false,
  ],
  [
    "Příprava stavby a betonáž",
    "Підготовка будівництва та бетонування",
    "Beton / Бетон",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85",
    "Praha 10",
    false,
  ],
] as const;

function json(value: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}
function safeEqual(first: string, second: string) {
  return timingSafeEqual(
    createHash("sha256").update(first).digest(),
    createHash("sha256").update(second).digest(),
  );
}
function clientIpHash(request: Request) {
  const clientIp =
    request.headers.get("x-nf-client-connection-ip") || "unknown";
  return createHash("sha256").update(clientIp).digest("hex");
}
function imageBytesMatchType(contentType: string, bytes: Uint8Array) {
  if (contentType === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
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
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}
function cookie(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
function sessionSecret() {
  if (!process.env.SESSION_SECRET)
    throw new Error("SESSION_SECRET is not configured");
  return process.env.SESSION_SECRET;
}
function validSession(request: Request) {
  const token = cookie(request, COOKIE_NAME);
  if (!token) return false;
  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) return false;
  const [expiresAtRaw, signature] = tokenParts;
  const expiresAt = Number(expiresAtRaw);
  if (
    !expiresAtRaw ||
    !signature ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= Date.now()
  )
    return false;
  const expected = createHmac("sha256", sessionSecret())
    .update(expiresAtRaw)
    .digest("hex");
  return safeEqual(signature, expected);
}
function admin(request: Request) {
  try {
    return validSession(request);
  } catch {
    return false;
  }
}
function publicImageUrl(imageUrl: string) {
  return imageUrl.startsWith("/objects/")
    ? `/api/storage${imageUrl}`
    : imageUrl;
}
function galleryItem(row: Record<string, unknown>) {
  return {
    id: row.id,
    titleCs: row.title_cs,
    titleUk: row.title_uk,
    category: row.category,
    imageUrl: publicImageUrl(String(row.image_url)),
    location: row.location,
    featured: row.featured,
  };
}
function contentItem(row: Record<string, unknown>) {
  return {
    companyName: row.company_name,
    phone: row.phone,
    registrationNumber: row.registration_number,
    foundedDate: row.founded_date,
    address: row.address,
    status: row.status,
    services: row.services,
    aboutCs: row.about_cs,
    aboutUk: row.about_uk,
  };
}
async function body(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
function validStrings(data: Record<string, unknown>, fields: string[]) {
  return fields.every(
    (field) => typeof data[field] === "string" && data[field].trim().length > 0,
  );
}
async function ensureContent() {
  const sql = getDatabase().sql;
  let [existing] = await sql`SELECT * FROM site_content ORDER BY id LIMIT 1`;
  if (!existing) {
    [existing] = await sql`
      INSERT INTO site_content (
        company_name, phone, registration_number, founded_date, address,
        status, services, about_cs, about_uk
      )
      VALUES (
        ${DEFAULT_CONTENT.companyName}, ${DEFAULT_CONTENT.phone},
        ${DEFAULT_CONTENT.registrationNumber}, ${DEFAULT_CONTENT.foundedDate},
        ${DEFAULT_CONTENT.address}, ${DEFAULT_CONTENT.status},
        ${JSON.stringify(DEFAULT_CONTENT.services)}::jsonb,
        ${DEFAULT_CONTENT.aboutCs}, ${DEFAULT_CONTENT.aboutUk}
      )
      RETURNING *
    `;
  }
  return existing as Record<string, unknown>;
}
async function ensureGallery() {
  const sql = getDatabase().sql;
  let rows = await sql`SELECT * FROM gallery_items ORDER BY id`;
  if (!rows.length) {
    for (const item of DEFAULT_GALLERY) {
      await sql`
        INSERT INTO gallery_items (
          title_cs, title_uk, category, image_url, location, featured
        )
        VALUES (${item[0]}, ${item[1]}, ${item[2]}, ${item[3]}, ${item[4]}, ${item[5]})
      `;
    }
    rows = await sql`SELECT * FROM gallery_items ORDER BY id`;
  }
  return rows as Record<string, unknown>[];
}

export default async (request: Request): Promise<Response> => {
  const rawPath = new URL(request.url).pathname;
  const path =
    rawPath.replace(/^\/\.netlify\/functions\/api|^\/api/, "") || "/";
  try {
    if (request.method === "GET" && path === "/healthz")
      return json({ status: "ok" });
    if (request.method === "GET" && path === "/content")
      return json(contentItem(await ensureContent()));
    if (request.method === "PATCH" && path === "/content") {
      if (!admin(request)) return json({ error: "Unauthorized" }, 401);
      const data = await body(request);
      if (!data) return json({ error: "Invalid site content body" }, 400);
      const current = await ensureContent();
      const merged = { ...contentItem(current), ...data };
      if (
        !validStrings(merged, [
          "companyName",
          "phone",
          "registrationNumber",
          "foundedDate",
          "address",
          "status",
          "aboutCs",
          "aboutUk",
        ]) ||
        !Array.isArray(merged.services) ||
        !merged.services.every((value) => typeof value === "string")
      )
        return json({ error: "Invalid site content body" }, 400);
      const sql = getDatabase().sql;
      const [updated] =
        await sql`UPDATE site_content SET company_name=${merged.companyName}, phone=${merged.phone}, registration_number=${merged.registrationNumber}, founded_date=${merged.foundedDate}, address=${merged.address}, status=${merged.status}, services=${JSON.stringify(merged.services)}::jsonb, about_cs=${merged.aboutCs}, about_uk=${merged.aboutUk}, updated_at=NOW() WHERE id=${current.id} RETURNING *`;
      return json(contentItem(updated as Record<string, unknown>));
    }
    if (request.method === "GET" && path === "/gallery")
      return json((await ensureGallery()).map(galleryItem));
    const galleryMatch = path.match(/^\/gallery\/(\d+)$/);
    if (
      (request.method === "POST" && path === "/gallery") ||
      (galleryMatch && request.method === "PATCH")
    ) {
      if (!admin(request)) return json({ error: "Unauthorized" }, 401);
      const data = await body(request);
      if (
        !data ||
        (data.featured !== undefined && typeof data.featured !== "boolean")
      )
        return json({ error: "Invalid gallery item body" }, 400);
      const sql = getDatabase().sql;
      if (request.method === "POST") {
        if (
          !validStrings(data, [
            "titleCs",
            "titleUk",
            "category",
            "imageUrl",
            "location",
          ])
        )
          return json({ error: "Invalid gallery item body" }, 400);
        const [created] =
          await sql`INSERT INTO gallery_items (title_cs, title_uk, category, image_url, location, featured) VALUES (${data.titleCs}, ${data.titleUk}, ${data.category}, ${data.imageUrl}, ${data.location}, ${data.featured ?? false}) RETURNING *`;
        return json(galleryItem(created as Record<string, unknown>), 201);
      }
      const [existing] =
        await sql`SELECT * FROM gallery_items WHERE id=${Number(galleryMatch![1])}`;
      if (!existing) return json({ error: "Gallery item not found" }, 404);
      const existingItem = existing as Record<string, unknown>;
      const merged = {
        titleCs: existingItem.title_cs,
        titleUk: existingItem.title_uk,
        category: existingItem.category,
        imageUrl: existingItem.image_url,
        location: existingItem.location,
        featured: existingItem.featured,
        ...data,
      };
      if (
        !validStrings(merged, [
          "titleCs",
          "titleUk",
          "category",
          "imageUrl",
          "location",
        ])
      )
        return json({ error: "Invalid gallery item body" }, 400);
      const featured = merged.featured ?? false;
      const [updated] =
        await sql`UPDATE gallery_items SET title_cs=${merged.titleCs}, title_uk=${merged.titleUk}, category=${merged.category}, image_url=${merged.imageUrl}, location=${merged.location}, featured=${featured}, updated_at=NOW() WHERE id=${Number(galleryMatch![1])} RETURNING *`;
      return updated
        ? json(galleryItem(updated as Record<string, unknown>))
        : json({ error: "Gallery item not found" }, 404);
    }
    if (galleryMatch && request.method === "DELETE") {
      if (!admin(request)) return json({ error: "Unauthorized" }, 401);
      const [deleted] = await getDatabase()
        .sql`DELETE FROM gallery_items WHERE id=${Number(galleryMatch[1])} RETURNING id`;
      return deleted
        ? new Response(null, { status: 204 })
        : json({ error: "Gallery item not found" }, 404);
    }
    if (request.method === "GET" && path === "/admin/session")
      return json({ authenticated: admin(request) });
    if (request.method === "POST" && path === "/admin/login") {
      if (!process.env.ADMIN_PASSWORD)
        return json({ error: "Admin access is not configured" }, 503);
      const sql = getDatabase().sql;
      const ipHash = clientIpHash(request);
      const [attempt] = await sql`
        SELECT attempt_count, reset_at
        FROM admin_login_attempts
        WHERE client_ip_hash = ${ipHash}
      `;
      if (
        attempt &&
        new Date(String(attempt.reset_at)).getTime() > Date.now() &&
        Number(attempt.attempt_count) >= MAX_LOGIN_ATTEMPTS
      )
        return json(
          { error: "Too many login attempts. Try again later." },
          429,
        );
      const data = await body(request);
      if (
        !data ||
        typeof data.password !== "string" ||
        !safeEqual(data.password, process.env.ADMIN_PASSWORD)
      ) {
        const [updatedAttempt] = await sql`
          INSERT INTO admin_login_attempts (
            client_ip_hash, attempt_count, reset_at
          )
          VALUES (${ipHash}, 1, NOW() + INTERVAL '15 minutes')
          ON CONFLICT (client_ip_hash) DO UPDATE
          SET
            attempt_count = CASE
              WHEN admin_login_attempts.reset_at <= NOW() THEN 1
              ELSE admin_login_attempts.attempt_count + 1
            END,
            reset_at = CASE
              WHEN admin_login_attempts.reset_at <= NOW()
                THEN NOW() + INTERVAL '15 minutes'
              ELSE admin_login_attempts.reset_at
            END
          RETURNING attempt_count
        `;
        if (Number(updatedAttempt?.attempt_count) > MAX_LOGIN_ATTEMPTS) {
          return json(
            { error: "Too many login attempts. Try again later." },
            429,
          );
        }
        return json({ error: "Invalid password" }, 401);
      }
      await sql`DELETE FROM admin_login_attempts WHERE client_ip_hash = ${ipHash}`;
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      const token = `${expiresAt}.${createHmac("sha256", sessionSecret()).update(String(expiresAt)).digest("hex")}`;
      return json({ authenticated: true }, 200, {
        "Set-Cookie": `${COOKIE_NAME}=${token}; Max-Age=${SESSION_DURATION_MS / 1000}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      });
    }
    if (request.method === "POST" && path === "/admin/logout")
      return json({ authenticated: false }, 200, {
        "Set-Cookie": `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
      });
    if (request.method === "GET" && path === "/admin/summary") {
      if (!admin(request)) return json({ error: "Unauthorized" }, 401);
      const [content, gallery] = await Promise.all([
        ensureContent(),
        ensureGallery(),
      ]);
      return json({
        galleryCount: gallery.length,
        featuredCount: gallery.filter((item) => item.featured === true).length,
        serviceCount: Array.isArray(content.services)
          ? content.services.length
          : 0,
        lastUpdated: new Date(String(content.updated_at)).toISOString(),
      });
    }
    if (request.method === "POST" && path === "/storage/uploads") {
      if (!admin(request)) return json({ error: "Unauthorized" }, 401);
      const length = Number(request.headers.get("content-length") || 0);
      if (length > 6 * 1024 * 1024)
        return json({ error: "Image must be between 1 byte and 5 MB" }, 400);
      const contentType = request.headers.get("content-type")?.toLowerCase();
      if (!contentType || !ALLOWED_IMAGE_TYPES.has(contentType))
        return json(
          { error: "Only JPG, PNG and WebP images are supported" },
          400,
        );
      const fileBytes = await request.arrayBuffer();
      if (fileBytes.byteLength <= 0 || fileBytes.byteLength > MAX_IMAGE_BYTES)
        return json({ error: "Image must be between 1 byte and 5 MB" }, 400);
      if (!imageBytesMatchType(contentType, new Uint8Array(fileBytes))) {
        return json(
          { error: "Image content does not match its declared type" },
          400,
        );
      }
      const extension =
        contentType === "image/jpeg"
          ? "jpg"
          : contentType.slice("image/".length);
      const key = `gallery/${randomUUID()}.${extension}`;
      await imageStore().set(key, fileBytes, {
        metadata: { contentType },
      });
      return json({ objectPath: `/objects/${key}` }, 201);
    }
    if (request.method === "GET" && path.startsWith("/storage/objects/")) {
      let key: string;
      try {
        key = decodeURIComponent(path.slice("/storage/objects/".length));
      } catch {
        return json({ error: "Object not found" }, 404);
      }
      if (!/^gallery\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) {
        return json({ error: "Object not found" }, 404);
      }
      const object = await imageStore().getWithMetadata(key, {
        type: "arrayBuffer",
      });
      if (!object) return json({ error: "Object not found" }, 404);
      return new Response(object.data, {
        headers: {
          "Content-Type":
            typeof object.metadata.contentType === "string"
              ? object.metadata.contentType
              : "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
    return json({ error: "Not found" }, 404);
  } catch {
    return json({ error: "Internal server error" }, 500);
  }
};
