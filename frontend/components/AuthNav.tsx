"use client";

import Link from "next/link";
import {
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  CurrentUser,
} from "../services/authService";

export default function AuthNav() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Menyimpan timer toast agar bisa dibersihkan
  const welcomeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    setMounted(true);

    async function loadUser() {
      const token = localStorage.getItem("access_token");

      // Tidak login
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );

        localStorage.removeItem("access_token");
        setUser(null);
      }
    }

    // Cek auth ketika component pertama kali dimuat
    loadUser();

    // Dengarkan perubahan login/logout
    async function handleAuthChanged() {
      const token = localStorage.getItem("access_token");

      // Kalau logout
      if (!token) {
        setUser(null);
        setShowWelcome(false);

        if (welcomeTimerRef.current) {
          clearTimeout(welcomeTimerRef.current);
        }

        return;
      }

      try {
        // Ambil user terbaru berdasarkan JWT
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        // Hapus timer sebelumnya kalau ada
        if (welcomeTimerRef.current) {
          clearTimeout(welcomeTimerRef.current);
        }

        // Tampilkan welcome
        setShowWelcome(true);

        // Hilangkan setelah 3 detik
        welcomeTimerRef.current = setTimeout(() => {
          setShowWelcome(false);
        }, 3000);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );

        localStorage.removeItem("access_token");
        setUser(null);
        setShowWelcome(false);
      }
    }

    window.addEventListener(
      "auth-changed",
      handleAuthChanged
    );

    window.addEventListener(
      "storage",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChanged
      );

      window.removeEventListener(
        "storage",
        handleAuthChanged
      );

      if (welcomeTimerRef.current) {
        clearTimeout(welcomeTimerRef.current);
      }
    };
  }, []);

  function handleLogout() {
    // Hapus JWT
    localStorage.removeItem("access_token");

    // Update navbar langsung
    setUser(null);
    setShowWelcome(false);

    // Bersihkan timer welcome
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
    }

    // Beritahu component lain
    window.dispatchEvent(
      new Event("auth-changed")
    );

    // Redirect ke login
    router.replace("/login");
  }

  // Tunggu client selesai hydration
  if (!mounted) {
    return null;
  }

  /*
   * =========================================================
   * SUDAH LOGIN
   * =========================================================
   */

  if (user) {
    return (
      <>
        {/* =================================================
            WELCOME TOAST
        ================================================= */}

        {showWelcome && (
          <div className="fixed right-5 top-5 z-[100]">
            <div className="rounded-xl border border-cyan-400/20 bg-slate-900/95 px-5 py-3 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  👋
                </span>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Welcome back, {user.name}!
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Ready to plan your next adventure?
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          onClick={handleLogout}
          className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
        >
          <LogOut
            size={15}
            className="text-cyan-400 transition group-hover:scale-110"
          />

          Logout
        </button>

        {/* =================================================
            PROFILE
        ================================================= */}

        <Link
          href="/profile"
          className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
        >
          <User
            size={15}
            className="text-cyan-400 transition group-hover:scale-110"
          />

          Profile
        </Link>
      </>
    );
  }

  /*
   * =========================================================
   * BELUM LOGIN
   * =========================================================
   */

  return (
    <>
      {/* Login */}

      <Link
        href="/login"
        className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
      >
        <LogIn
          size={15}
          className="text-cyan-400 transition group-hover:scale-110"
        />

        Login
      </Link>

      {/* Register */}

      <Link
        href="/register"
        className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
      >
        <UserPlus
          size={15}
          className="text-cyan-400 transition group-hover:scale-110"
        />

        Register
      </Link>
    </>
  );
}