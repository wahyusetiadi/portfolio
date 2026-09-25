import crypto from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';

let cachedToken: { value: string; expiresAt: number } | null = null;

export function hasGoogleDriveSettings(): boolean {
  return Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_ID ||
    process.env.GOOGLE_DRIVE_CLIENT_SECRET ||
    process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  );
}

export function isGoogleDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_ID &&
    process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
    process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  );
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;
  if (!isGoogleDriveConfigured()) throw new Error('Google Drive belum dikonfigurasi');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });
  const token = await response.json() as { access_token?: string; expires_in?: number };
  if (!response.ok || !token.access_token) throw new Error('Gagal memperoleh akses Google Drive');
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + Math.max(30, (token.expires_in || 3600) - 60) * 1000,
  };
  return cachedToken.value;
}

async function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const request = async () => fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${await getAccessToken()}` },
    cache: 'no-store',
  });
  let response = await request();
  if (response.status === 401) {
    cachedToken = null;
    response = await request();
  }
  return response;
}

export async function uploadProjectImageToDrive(file: File): Promise<string> {
  const boundary = `portfolio-${crypto.randomUUID()}`;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-') || 'project-image';
  const metadata = { name: `${Date.now()}-${safeName}` };
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`),
    Buffer.from(await file.arrayBuffer()),
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const response = await authorizedFetch(`${DRIVE_UPLOAD_API}?uploadType=multipart&fields=id`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  const result = await response.json() as { id?: string };
  if (!response.ok || !result.id) throw new Error('Upload ke Google Drive gagal');
  return `/api/project-image/${encodeURIComponent(result.id)}`;
}

export async function getProjectImageFromDrive(id: string): Promise<Response> {
  return authorizedFetch(`${DRIVE_API}/${encodeURIComponent(id)}?alt=media`);
}
