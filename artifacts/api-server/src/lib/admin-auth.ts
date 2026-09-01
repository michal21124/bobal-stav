import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import type { Request, RequestHandler, Response } from "express";

const COOKIE_NAME = "bobal_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(first: string, second: string) {
  return timingSafeEqual(hash(first), hash(second));
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }
  return secret;
}

function createSessionToken() {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

function isValidSessionToken(token: unknown) {
  if (typeof token !== "string") return false;

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAtRaw || !signature || !Number.isFinite(expiresAt)) return false;
  if (expiresAt <= Date.now()) return false;

  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(expiresAtRaw)
    .digest("hex");

  return safeEqual(signature, expectedSignature);
}

function clientKey(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  try {
    if (isValidSessionToken(req.cookies?.[COOKIE_NAME])) {
      next();
      return;
    }
  } catch (error) {
    req.log.error({ err: error }, "Admin session validation failed");
  }

  res.status(401).json({ error: "Unauthorized" });
};

export function getAdminSession(req: Request, res: Response) {
  try {
    res.json({ authenticated: isValidSessionToken(req.cookies?.[COOKIE_NAME]) });
  } catch (error) {
    req.log.error({ err: error }, "Admin session check failed");
    res.status(503).json({ authenticated: false });
  }
}

export function loginAdmin(req: Request, res: Response) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    req.log.error("ADMIN_PASSWORD is not configured");
    res.status(503).json({ error: "Admin access is not configured" });
    return;
  }

  const key = clientKey(req);
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (attempt && attempt.resetAt > now && attempt.count >= MAX_LOGIN_ATTEMPTS) {
    res.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }

  if (typeof req.body?.password !== "string" || !safeEqual(req.body.password, password)) {
    const activeAttempt = attempt && attempt.resetAt > now
      ? attempt
      : { count: 0, resetAt: now + LOGIN_WINDOW_MS };
    activeAttempt.count += 1;
    loginAttempts.set(key, activeAttempt);
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  loginAttempts.delete(key);
  res.cookie(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION_MS,
    path: "/",
  });
  res.json({ authenticated: true });
}

export function logoutAdmin(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ authenticated: false });
}