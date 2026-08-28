"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  User,
  Plane,
  Loader2,
} from "lucide-react";

import {
  getCurrentUser,
  CurrentUser,
} from "../../services/authService";

import { getTrips } from "../../services/tripService";

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [tripCount, setTripCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("access_token");

      // Belum login
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Ambil data user + trip milik user yang sedang login
        const [currentUser, trips] = await Promise.all([
          getCurrentUser(),
          getTrips(),
        ]);

        setUser(currentUser);
        setTripCount(trips.length);
      } catch (error) {
        console.error("Failed to load profile:", error);

        // Token tidak valid / expired
        localStorage.removeItem("access_token");

        window.dispatchEvent(new Event("auth-changed"));

        window.location.href = "/login";
        return;
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2
              size={20}
              className="animate-spin text-cyan-400"
            />

            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // USER TIDAK ADA
  // ================================

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            Unable to load profile.
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // PROFILE
  // ================================

  return (
    <main className="relative min-h-screen bg-[#050816] text-white">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="hero-grid absolute inset-0 opacity-30" />
      </div>

      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to KelanaAI
        </Link>

        {/* Header */}
        <div className="mt-8">
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <User size={27} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                My Profile
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Your KelanaAI account
              </p>
            </div>

          </div>
        </div>

        {/* Profile Card */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70">

          {/* ================= NAME ================= */}
          <div className="flex items-center gap-4 border-b border-slate-800/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
              <User size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Name
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {user.name}
              </p>
            </div>

          </div>

          {/* ================= EMAIL ================= */}
          <div className="flex items-center gap-4 border-b border-slate-800/70 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
              <Mail size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Email
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {user.email}
              </p>
            </div>

          </div>

          {/* ================= TOTAL TRIPS ================= */}
          <div className="flex items-center gap-4 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
              <Plane size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Trips Generated
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {tripCount}
              </p>
            </div>

          </div>

        </section>

        {/* View Trips */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/30"
          >
            <Plane size={16} />
            View My Trips
          </Link>
        </div>

      </div>
    </main>
  );
}