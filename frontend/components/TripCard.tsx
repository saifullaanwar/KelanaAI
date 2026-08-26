import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Plane,
  Wallet,
} from "lucide-react";

import type { Trip } from "@/types/trip";

type TripCardProps = {
  trip: Trip;
};

/* ============================================================
   Destination Icon
   ============================================================ */

function getDestinationIcon(destination: string): string {
  const normalized = destination.trim().toLowerCase();

  const destinationIcons: Record<string, string> = {
    /* Indonesia */
    jakarta: "🇮🇩",
    bali: "🏝️",
    lombok: "🏝️",
    garut: "⛰️",
    bandung: "🌆",
    yogyakarta: "🏛️",
    jogja: "🏛️",
    surabaya: "🌆",
    malang: "⛰️",
    bogor: "🌿",
    medan: "🌆",
    makassar: "🌊",
    semarang: "🏛️",
    padang: "🏔️",
    "labuan bajo": "🏝️",
    "raja ampat": "🐠",
    "kota tua": "🏛️",

    /* Japan */
    japan: "🇯🇵",
    tokyo: "🗼",
    kyoto: "⛩️",
    osaka: "🏯",
    "mount fuji": "🗻",
    fuji: "🗻",
    hokkaido: "❄️",
    nagoya: "🏯",

    /* Singapore */
    singapore: "🇸🇬",

    /* Malaysia */
    malaysia: "🇲🇾",
    kuala: "🇲🇾",
    "kuala lumpur": "🇲🇾",
    penang: "🏝️",
    langkawi: "🏝️",

    /* Thailand */
    thailand: "🇹🇭",
    bangkok: "🇹🇭",
    phuket: "🏝️",
    chiangmai: "⛰️",
    "chiang mai": "⛰️",

    /* South Korea */
    korea: "🇰🇷",
    "south korea": "🇰🇷",
    seoul: "🇰🇷",
    busan: "🌊",

    /* China */
    china: "🇨🇳",
    beijing: "🇨🇳",
    shanghai: "🏙️",

    /* Europe */
    france: "🇫🇷",
    paris: "🗼",
    italy: "🇮🇹",
    rome: "🏛️",
    venice: "🚤",
    england: "🇬🇧",
    london: "🇬🇧",
    "united kingdom": "🇬🇧",
    germany: "🇩🇪",
    berlin: "🇩🇪",
    switzerland: "🇨🇭",
    austria: "🇦🇹",
    spain: "🇪🇸",
    barcelona: "🇪🇸",

    /* Other popular destinations */
    australia: "🇦🇺",
    sydney: "🇦🇺",
    "new zealand": "🇳🇿",
    usa: "🇺🇸",
    "united states": "🇺🇸",
    america: "🇺🇸",
    canada: "🇨🇦",
    brazil: "🇧🇷",
    turkey: "🇹🇷",
    istanbul: "🇹🇷",
    egypt: "🇪🇬",
    dubai: "🇦🇪",
    uae: "🇦🇪",
  };

  return destinationIcons[normalized] ?? "🌍";
}

/* ============================================================
   Trip Card
   ============================================================ */

export default function TripCard({
  trip,
}: TripCardProps) {
  const destinationIcon = getDestinationIcon(trip.destination);

  return (
    <article className="group rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-cyan-500/5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* =====================================================
            Trip Information
        ===================================================== */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Destination Icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl"
            aria-label={`${trip.destination} destination`}
            title={trip.destination}
          >
            {destinationIcon}
          </div>

          {/* Destination */}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold capitalize text-white">
              {trip.destination}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
              {/* Days */}
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {trip.days} days
              </span>

              {/* Budget */}
              <span className="inline-flex items-center gap-1.5">
                <Wallet size={14} />
                USD {trip.budget.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            Right Side
        ===================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
          {/* Category */}
          <span className="rounded-full border border-slate-600/60 bg-slate-700/50 px-3 py-1.5 text-xs font-semibold capitalize text-slate-300">
            {trip.category}
          </span>

          {/* Travel Style */}
          {trip.travel_style && (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold capitalize text-cyan-300">
              {trip.travel_style}
            </span>
          )}

          {/* Details */}
          <Link
            href={`/trips/${trip.id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:shadow-cyan-500/30"
          >
            View Details

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}