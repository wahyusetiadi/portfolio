import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/auth";

const dataPath = path.join(process.cwd(), "app/api/data/portfolio.json");

function getTokenFromCookieHeader(cookieHeader: string): string | null {
  const cookieName = getAdminCookieName();
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${cookieName}=`));
  return match ? match.slice(cookieName.length + 1) : null;
}

function isAuthed(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = getTokenFromCookieHeader(cookieHeader);
  if (!token) return false;
  return verifyAdminSessionToken(token).valid;
}

export async function GET(request: Request) {
  if (!isAuthed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    fs.writeFileSync(dataPath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

