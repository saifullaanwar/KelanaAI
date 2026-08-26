import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Plus,
} from "lucide-react";

import { getTrips } from "../../services/tripService";
import TripHistoryClient from "../../components/TripHistoryClient";

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <main className="relative min-h-screen bg-[#050816] text-white">
      {/* Background grid — same as home page */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="hero-grid absolute inset-0 opacity-30" />
      </div>

      {/* Subtle radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to KelanaAI
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
                <Compass size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Trip History
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Your saved travel plans
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/30"
          >
            <Plus size={18} />
            Plan New Trip
          </Link>
        </div>

        {/* Trip History */}
        <TripHistoryClient trips={trips} />
      </div>
    </main>
  );
}