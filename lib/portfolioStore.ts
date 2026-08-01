import fs from "node:fs";
import path from "node:path";
import type { PortfolioData } from "@/app/lib/types";

const DEFAULT_DATA_PATH = path.join(process.cwd(), "app/api/data/portfolio.json");
const DEFAULT_UPSTASH_KEY = "portfolio:data";

function getFileDataPath(): string {
  return process.env.PORTFOLIO_DATA_PATH || DEFAULT_DATA_PATH;
}

function hasUpstashEnv(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getUpstashKey(): string {
  return process.env.PORTFOLIO_UPSTASH_KEY || DEFAULT_UPSTASH_KEY;
}

async function upstashCommand(command: unknown[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash env is not configured");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const text = await res.text();
  let j: { result?: unknown; error?: string } | null = null;
  try {
    j = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Upstash returned invalid JSON (${res.status})`);
  }
  if (!res.ok) throw new Error(`Upstash request failed (${res.status})${j?.error ? `: ${j.error}` : ""}`);
  if (j?.error) throw new Error(j.error);
  return j?.result;
}

function parsePortfolioData(raw: string, source: string): PortfolioData {
  try {
    return JSON.parse(raw) as PortfolioData;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Portfolio data in ${source} is not valid JSON: ${message}`);
  }
}

function readFromFile(): PortfolioData {
  const raw = fs.readFileSync(getFileDataPath(), "utf8");
  return parsePortfolioData(raw, getFileDataPath());
}

function writeToFile(data: PortfolioData): void {
  fs.writeFileSync(getFileDataPath(), JSON.stringify(data, null, 2));
}

export function getPortfolioStorageMode(): "upstash" | "file" {
  return hasUpstashEnv() ? "upstash" : "file";
}

export async function readPortfolioData(): Promise<PortfolioData> {
  if (hasUpstashEnv()) {
    const key = getUpstashKey();
    const raw = await upstashCommand(["GET", key]);
    if (typeof raw === "string" && raw) return parsePortfolioData(raw, `Upstash key "${key}"`);
    if (raw != null) throw new Error(`Portfolio data in Upstash key "${key}" is not a JSON string`);
  }
  return readFromFile();
}

export async function writePortfolioData(data: PortfolioData): Promise<void> {
  if (hasUpstashEnv()) {
    const key = getUpstashKey();
    await upstashCommand(["SET", key, JSON.stringify(data)]);
    return;
  }

  try {
    writeToFile(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to write portfolio data to disk (${getFileDataPath()}): ${message}. ` +
        "On serverless hosts (e.g. Vercel), the filesystem is read-only; configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN for persistence.",
    );
  }
}

