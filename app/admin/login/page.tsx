"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error || "Login gagal");
        setLoading(false);
        return;
      }
      router.replace("/admin");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg)" }}>
      <div className="card" style={{ width: "min(440px, 100%)", padding: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.3px" }}>Admin Login</h1>
          <Link href="/" style={{ color: "var(--text-2)", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>
            ← Home
          </Link>
        </div>

        <p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 13 }}>
          Masukkan password admin untuk mengedit portfolio.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <div style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.08)", color: "var(--danger)", fontSize: 13 }}>
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

