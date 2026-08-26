import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Tag,
  Wallet,
} from "lucide-react";

import { getTrip } from "@/services/tripService";
import ItineraryView from "./_components/ItineraryView";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

/* ── Error states ─────────────────────────────────────────── */

function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to Trips
        </Link>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

/* ── Stat card ────────────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default async function TripDetailPage({
  params,
}: TripDetailPageProps) {
  const { id } = await params;
  const tripId = Number(id);

  if (Number.isNaN(tripId)) {
    return (
      <ErrorLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
          Invalid trip ID.
        </div>
      </ErrorLayout>
    );
  }

  let trip;
  try {
    trip = await getTrip(tripId);
  } catch {
    return (
      <ErrorLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-bold text-red-400">Trip Not Found</h1>
          <p className="mt-2 text-sm text-red-500/80">
            We couldn&apos;t find a trip with ID {tripId}.
          </p>
        </div>
      </ErrorLayout>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Back link */}
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to Trips
        </Link>

        {/* ── Header ── */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-400">
              <MapPin size={15} />
              Trip Details
            </div>
            <h1 className="text-4xl font-bold capitalize tracking-tight text-white">
              {trip.destination}
            </h1>
            <p className="mt-1.5 text-slate-400">
              {trip.days}-day {trip.travel_style ?? ""} journey
            </p>
          </div>

          {/* Category badge */}
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-sm font-semibold text-cyan-300">
            <Tag size={13} />
            {trip.category}
          </span>
        </div>

        {/* ── Summary stats ── */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<MapPin size={13} className="text-cyan-400" />}
            label="Destination"
            value={trip.destination}
          />
          <StatCard
            icon={<Wallet size={13} className="text-cyan-400" />}
            label="Total Budget"
            value={`$${trip.budget.toLocaleString()}`}
          />
          <StatCard
            icon={<CalendarDays size={13} className="text-cyan-400" />}
            label="Duration"
            value={`${trip.days} days`}
          />
          <StatCard
            icon={<Wallet size={13} className="text-cyan-400" />}
            label="Daily Budget"
            value={`$${Number(trip.daily_budget).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`}
          />
        </section>

        {/* ── Transport recommendation ── */}
        {trip.recommendation_transport && (
          <section className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-800/40 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Recommended Transport
            </p>
            <p className="mt-1.5 text-sm text-slate-300">
              {trip.recommendation_transport}
            </p>
          </section>
        )}

        {/* ── Card-based itinerary ── */}
        <ItineraryView aiRecommendation={trip.ai_recommendation} />

        {/* ── Bottom nav ── */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/30"
          >
            <ArrowLeft size={15} />
            Back to Trip History
          </Link>
        </div>

      </div>
    </main>
  );
}
