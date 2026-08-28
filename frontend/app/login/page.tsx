"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // =====================================================
      // SIMPAN JWT
      // =====================================================
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // =====================================================
      // BERITAHU AuthNav BAHWA STATUS LOGIN BERUBAH
      // =====================================================
      window.dispatchEvent(
        new Event("auth-changed")
      );

      // =====================================================
      // KEMBALI KE HOME
      // =====================================================
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-cyan-400">
              KelanaAI
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Welcome back
            </p>
          </div>

          {/* =====================================================
              LOGIN FORM
          ===================================================== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="alice@email.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* =====================================================
              REGISTER LINK
          ===================================================== */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              Register
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}