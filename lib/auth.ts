import crypto from "node:crypto";

const COOKIE_NAME = "admin_session";

type SessionPayload = {
  v: 1;
  iat: number; // seconds
  exp: number; // seconds
};

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecodeToBuffer(s: string): Buffer {
  const padded = s.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((s.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

function sign(payloadB64Url: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(payloadB64Url).digest();
  return base64UrlEncode(sig);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export function createAdminSessionToken(opts?: { ttlSeconds?: number; now?: number }): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");

  const now = opts?.now ?? Math.floor(Date.now() / 1000);
  const ttlSeconds = opts?.ttlSeconds ?? 60 * 60 * 24 * 7; // 7 days
  const payload: SessionPayload = { v: 1, iat: now, exp: now + ttlSeconds };

  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const sigB64 = sign(payloadB64, secret);
  return `${payloadB64}.${sigB64}`;
}

export function verifyAdminSessionToken(token: string): { valid: boolean; payload?: SessionPayload } {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return { valid: false };

  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return { valid: false };

  const expected = sign(payloadB64, secret);
  if (!safeEqual(expected, sigB64)) return { valid: false };

  try {
    const payload = JSON.parse(base64UrlDecodeToBuffer(payloadB64).toString("utf8")) as SessionPayload;
    if (payload?.v !== 1) return { valid: false };
    if (typeof payload.exp !== "number") return { valid: false };
    const now = Math.floor(Date.now() / 1000);
    if (now >= payload.exp) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

