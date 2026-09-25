import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/auth";
import { hasGoogleDriveSettings, isGoogleDriveConfigured, uploadProjectImageToDrive, uploadSocialImageToDrive } from "@/lib/googleDrive";

function isAuthed(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split(";").map(v => v.trim()).find(v => v.startsWith(`${getAdminCookieName()}=`))?.split("=").slice(1).join("=");
  return token ? verifyAdminSessionToken(token).valid : false;
}

export async function POST(request: Request) {
  if (!isAuthed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Ukuran gambar maksimal 5 MB" }, { status: 400 });
    const target = form.get('target');
    if ((target === 'project' || target === 'social') && hasGoogleDriveSettings() && !isGoogleDriveConfigured()) {
      return NextResponse.json({ error: 'Konfigurasi Google Drive belum lengkap. Periksa Client ID, Client Secret, dan Refresh Token.' }, { status: 503 });
    }
    if ((target === 'project' || target === 'social') && isGoogleDriveConfigured()) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
        return NextResponse.json({ error: 'Gunakan JPG, PNG, WebP, atau AVIF untuk gambar proyek' }, { status: 400 });
      }
      return NextResponse.json({ url: await (target === 'project' ? uploadProjectImageToDrive(file) : uploadSocialImageToDrive(file)) });
    }
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload gagal" }, { status: 500 });
  }
}
