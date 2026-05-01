import { NextResponse } from "next/server";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/auth";
import { getPortfolioStorageMode, readPortfolioData, writePortfolioData } from "@/lib/portfolioStore";

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
    const data = await readPortfolioData();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read data";
    return NextResponse.json({ error: message, storage: getPortfolioStorageMode() }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await writePortfolioData(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save data";
    return NextResponse.json({ error: message, storage: getPortfolioStorageMode() }, { status: 500 });
  }
}
