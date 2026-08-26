import Link from "next/link";
import { ArrowLeft, Compass, Plus } from "lucide-react";

import { getTrips } from "@/services/tripService";
import TripCard from "@/components/TripCard";
import TripHistoryClient from "@/components/TripHistoryClient";

export default async function TripsPage() {
  const trips = await getTrips();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to KelanaAI
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white">
                <Compass size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Trip History
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Your saved travel plans
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            <Plus size={18} />
            Plan New Trip
          </Link>
        </div>

        {/* Trip list */}
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Compass
              size={40}
              className="mx-auto mb-4 text-slate-400"
            />

            <h2 className="text-xl font-bold text-slate-900">
              No trips yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Generate your first AI travel itinerary to see it here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Plan Your First Trip
              <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip: any) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}