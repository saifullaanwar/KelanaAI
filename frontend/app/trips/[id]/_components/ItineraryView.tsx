"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  Sparkles,
} from "lucide-react";

import { parseItinerary } from "./itineraryParser";

import type {
  Activity,
  GeneralTips,
  ItineraryDay,
  TimeSlot,
  TripSummary,
} from "./itineraryParser";

/* ================================================================
   Activity Item
================================================================ */

function ActivityItem({
  activity,
}: {
  activity: Activity;
}) {
  return (
    <div className="relative pl-6">
      {/* Bullet */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.45)]"
      />

      <div>
        {/* Time + Title */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {activity.time && (
            <span className="text-sm font-bold text-cyan-400">
              {activity.time}
            </span>
          )}

          <p className="text-sm font-semibold leading-5 text-white">
            {activity.title}
          </p>
        </div>

        {/* Description */}
        {activity.description && (
          <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-400">
            {activity.description}
          </p>
        )}

        {/* Location + Cost */}
        {(activity.location || activity.cost) && (
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
            {activity.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin
                  size={12}
                  className="shrink-0 text-cyan-400"
                />
                {activity.location}
              </span>
            )}

            {activity.cost && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <DollarSign
                  size={12}
                  className="shrink-0 text-cyan-400"
                />
                {activity.cost}
              </span>
            )}
          </div>
        )}

        {/* Activity-specific extras */}
        {activity.extras.length > 0 && (
          <ul className="mt-2 space-y-1">
            {activity.extras.map((extra, index) => (
              <li
                key={index}
                className="text-xs leading-5 text-slate-500"
              >
                {extra}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   Time Slot
================================================================ */

function SlotSection({
  slot,
}: {
  slot: TimeSlot;
}) {
  const labelColors: Record<TimeSlot["label"], string> = {
    Morning: "text-amber-400",
    Afternoon: "text-sky-400",
    Evening: "text-violet-400",
  };

  const labelIcons: Record<TimeSlot["label"], string> = {
    Morning: "☀️",
    Afternoon: "☁️",
    Evening: "☾",
  };

  return (
    <section className="space-y-3">
      {/* Slot heading */}
      <div
        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${labelColors[slot.label]}`}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80"
          aria-hidden="true"
        >
          {labelIcons[slot.label]}
        </span>

        <span>{slot.label}</span>
      </div>

      {/* Activities */}
      {slot.activities.length > 0 ? (
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-4">
          <div className="flex flex-col gap-5">
            {slot.activities.map((activity, index) => (
              <ActivityItem
                key={`${activity.time}-${activity.title}-${index}`}
                activity={activity}
              />
            ))}
          </div>
        </div>
      ) : slot.rawFallback ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-sm text-slate-400">
          <div className="markdown-content">
            <ReactMarkdown>
              {slot.rawFallback}
            </ReactMarkdown>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* ================================================================
   Day Card / Accordion
================================================================ */

function DayCard({
  day,
  defaultOpen = false,
}: {
  day: ItineraryDay;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/50">
      {/* ==========================================================
          Clickable Header
      ========================================================== */}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-slate-800 to-slate-800/60 px-5 py-4 text-left transition hover:bg-slate-800/80"
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Day Number */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
            {day.dayNumber}
          </span>

          {/* Day title */}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-400">
              Day {day.dayNumber}
            </p>

            <h3 className="mt-0.5 truncate text-sm font-semibold text-white">
              {day.title}
            </h3>
          </div>
        </div>

        {/* Chevron */}
        <span className="shrink-0 text-slate-500">
          {open ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </span>
      </button>

      {/* ==========================================================
          Collapsible Body
      ========================================================== */}

      {open && (
        <div className="border-t border-slate-700/60">
          {/* Day Summary */}

          {(day.summary.estimatedDailyBudget ||
            day.summary.transportation ||
            day.summary.recommendedAttractions) && (
            <div className="border-b border-slate-700/50 bg-slate-900/30 px-5 py-4">
              <div className="grid gap-2 sm:grid-cols-3">
                {/* Daily Budget */}
                {day.summary.estimatedDailyBudget && (
                  <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Daily Budget
                    </p>

                    <p className="mt-1 text-xs font-medium text-cyan-300">
                      {day.summary.estimatedDailyBudget}
                    </p>
                  </div>
                )}

                {/* Transportation */}
                {day.summary.transportation && (
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Transportation
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      {day.summary.transportation}
                    </p>
                  </div>
                )}

                {/* Recommended Attractions */}
                {day.summary.recommendedAttractions && (
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Recommended
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      {day.summary.recommendedAttractions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              Day Activities
          ======================================================== */}

          <div className="space-y-7 px-5 py-5">
            {day.slots.length > 0 ? (
              day.slots.map((slot) => (
                <SlotSection
                  key={slot.label}
                  slot={slot}
                />
              ))
            ) : day.rawFallback ? (
              <div className="markdown-content text-sm leading-6 text-slate-400">
                <ReactMarkdown>
                  {day.rawFallback}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No itinerary details available for this day.
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

/* ================================================================
   General Tips
================================================================ */

function GeneralTipsCard({
  tips,
}: {
  tips: GeneralTips;
}) {
  const hasStructuredTips =
    Boolean(tips.transportation) ||
    Boolean(tips.accommodation) ||
    Boolean(tips.localEtiquette) ||
    Boolean(tips.currency);

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] px-5 py-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          <Sparkles size={16} />
        </span>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
            Travel Guide
          </p>

          <h3 className="mt-0.5 text-base font-bold text-white">
            General Tips
          </h3>
        </div>
      </div>

      {/* Structured tips */}
      {hasStructuredTips && (
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Transportation */}
          {tips.transportation && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Transportation
              </p>

              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                {tips.transportation}
              </p>
            </div>
          )}

          {/* Accommodation */}
          {tips.accommodation && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Accommodation
              </p>

              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                {tips.accommodation}
              </p>
            </div>
          )}

          {/* Local Etiquette */}
          {tips.localEtiquette && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Local Etiquette
              </p>

              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                {tips.localEtiquette}
              </p>
            </div>
          )}

          {/* Currency */}
          {tips.currency && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Currency
              </p>

              <p className="mt-1.5 text-sm leading-6 text-slate-300">
                {tips.currency}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Extra tips */}
      {tips.extras.length > 0 && (
        <ul
          className={`space-y-2 ${
            hasStructuredTips
              ? "mt-4 border-t border-slate-700/40 pt-4"
              : ""
          }`}
        >
          {tips.extras.map((tip, index) => (
            <li
              key={index}
              className="flex gap-2 text-sm leading-6 text-slate-400"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/70" />

              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ================================================================
   Trip Summary
================================================================ */

function TripSummaryCard({
  summary,
}: {
  summary: TripSummary;
}) {
  if (
    summary.budgetLines.length === 0 &&
    !summary.closingNote
  ) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-800/40 px-5 py-5">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Overview
        </p>

        <h3 className="mt-1 text-lg font-bold text-white">
          Trip Summary
        </h3>
      </div>

      {/* Budget / summary lines */}
      {summary.budgetLines.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {summary.budgetLines.map((line, index) => {
            const colonIndex = line.indexOf(":");

            if (colonIndex !== -1) {
              const label = line
                .slice(0, colonIndex)
                .trim();

              const value = line
                .slice(colonIndex + 1)
                .trim();

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-3"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {label}
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-5 text-white">
                    {value}
                  </p>
                </div>
              );
            }

            return (
              <p
                key={index}
                className="text-sm leading-6 text-slate-300"
              >
                {line}
              </p>
            );
          })}
        </div>
      )}

      {/* Closing note */}
      {summary.closingNote && (
        <div className="mt-4 border-t border-slate-700/40 pt-4">
          <p className="text-sm leading-6 text-slate-400">
            {summary.closingNote}
          </p>
        </div>
      )}
    </section>
  );
}

/* ================================================================
   Main Itinerary View
================================================================ */

export default function ItineraryView({
  aiRecommendation,
}: {
  aiRecommendation: string | null | undefined;
}) {
  const {
    days,
    generalTips,
    tripSummary,
  } = parseItinerary(aiRecommendation);

  /* ================================================================
     Empty / Parsing Fallback
  ================================================================ */

  if (
    days.length === 0 &&
    !generalTips &&
    !tripSummary
  ) {
    if (!aiRecommendation) {
      return (
        <section className="mt-6 rounded-2xl border border-dashed border-slate-700 p-6 text-center">
          <p className="text-sm text-slate-500">
            No AI itinerary has been generated for this trip yet.
          </p>
        </section>
      );
    }

    return (
      <section className="mt-6">
        <div className="mb-4 flex items-center gap-2 text-cyan-400">
          <Sparkles size={16} />

          <h2 className="text-lg font-bold text-white">
            Your Itinerary
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
          <div className="markdown-content text-sm leading-6 text-slate-300">
            <ReactMarkdown>
              {aiRecommendation}
            </ReactMarkdown>
          </div>
        </div>
      </section>
    );
  }

  /* ================================================================
     Parsed Itinerary
  ================================================================ */

  return (
    <section className="mt-6 space-y-5">
      {/* ==========================================================
          Section Header
      ========================================================== */}

      <div>
        <div className="mb-1.5 flex items-center gap-2 text-cyan-400">
          <Sparkles size={16} />

          <span className="text-xs font-semibold uppercase tracking-widest">
            AI Itinerary
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white">
          Your Travel Plan
        </h2>

        {days.length > 0 && (
          <p className="mt-1 text-sm text-slate-500">
            {days.length}{" "}
            {days.length === 1 ? "day" : "days"} planned for your journey.
          </p>
        )}
      </div>

      {/* ==========================================================
          Day Accordions
      ========================================================== */}

      {days.length > 0 && (
        <div className="space-y-3">
          {days.map((day, index) => (
            <DayCard
              key={day.dayNumber}
              day={day}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}

      {/* ==========================================================
          General Tips
      ========================================================== */}

      {generalTips && (
        <GeneralTipsCard tips={generalTips} />
      )}

      {/* ==========================================================
          Trip Summary
      ========================================================== */}

      {tripSummary && (
        <TripSummaryCard summary={tripSummary} />
      )}
    </section>
  );
}