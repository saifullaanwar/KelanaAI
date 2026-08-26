import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  History,
  Sparkles,
} from "lucide-react";

import "./globals.css";

export const metadata: Metadata = {
  title: "KelanaAI",
  description: "AI-powered travel planning with Amazon Bedrock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816]">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="relative z-50 border-b border-slate-800/60 bg-[#050816]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
                <Compass size={19} strokeWidth={2.2} />
              </div>

              <span className="text-base font-bold tracking-tight text-white">
                KelanaAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
              >
                <Sparkles
                  size={15}
                  className="text-cyan-400 transition group-hover:scale-110"
                />
                Plan Trip
              </Link>

              <Link
                href="/trips"
                className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
              >
                <History
                  size={15}
                  className="text-cyan-400 transition group-hover:scale-110"
                />
                Trip History
              </Link>
            </nav>

            {/* AI Badge */}
            <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-slate-400 sm:px-4 sm:text-sm">
              <Sparkles
                size={14}
                className="shrink-0 text-cyan-400"
              />

              <span className="hidden sm:inline">
                AI-powered travel planning
              </span>

              <span className="sm:hidden">
                AI Travel
              </span>
            </div>
          </div>

          {/* ===================================================
              MOBILE NAVIGATION
          =================================================== */}
          <div className="border-t border-slate-800/40 md:hidden">
            <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-2">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
              >
                <Sparkles
                  size={15}
                  className="text-cyan-400"
                />
                Plan Trip
              </Link>

              <Link
                href="/trips"
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
              >
                <History
                  size={15}
                  className="text-cyan-400"
                />
                Trip History
              </Link>
            </nav>
          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}
        {children}
      </body>
    </html>
  );
}