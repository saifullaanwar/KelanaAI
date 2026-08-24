"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  Check,
  Compass,
  DollarSign,
  LoaderCircle,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import TravelGlobe from "./components/TravelGlobe";

interface TripResult {
  id: number;
  destination: string;
  days: number;
  budget: number;
  daily_budget: number;
  category: string;
  travel_style: string;
  recommendation_transport: string;
  ai_recommendation: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const [trip, setTrip] = useState<TripResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itineraryRef = useRef<HTMLDivElement>(null);

  /*
   * Reset itinerary scroll position whenever
   * a new trip is generated.
   */
  useEffect(() => {
    if (trip && itineraryRef.current) {
      itineraryRef.current.scrollTop = 0;
    }
  }, [trip]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setTrip(null);

    if (!destination || !budget || !days || !travelStyle) {
      setError(
        "Please complete all trip details before generating your trip."
      );
      return;
    }

    if (Number(budget) <= 0 || Number(days) <= 0) {
      setError(
        "Budget and number of days must be greater than zero."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/trips`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: destination.trim(),
            budget: Number(budget),
            days: Number(days),
            travel_style: travelStyle,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const data: TripResult = await response.json();

      setTrip(data);
    } catch (err) {
      console.error("Generate trip error:", err);

      setError(
        "We couldn't generate your itinerary right now. Please make sure the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetTrip() {
    setTrip(null);
    setError("");

    setDestination("");
    setBudget("");
    setDays("");
    setTravelStyle("");
  }

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#050816] text-white">
      {/* =========================================================
          THREE.JS BACKGROUND
      ========================================================= */}

      <TravelGlobe />

      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="hero-grid absolute inset-0 opacity-40" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header className="relative z-20 h-[64px] shrink-0">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Compass
                size={20}
                className="text-white"
              />
            </div>

            <span className="text-base font-semibold tracking-tight sm:text-lg">
              Kelana
              <span className="text-cyan-400">
                AI
              </span>
            </span>
          </div>

          {/* Status */}

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 backdrop-blur-xl sm:px-4 sm:text-sm">
            <Sparkles
              size={14}
              className="text-cyan-400"
            />

            <span className="hidden sm:inline">
              AI-powered travel planning
            </span>

            <span className="sm:hidden">
              AI travel planner
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}

      <div className="relative z-10 h-[calc(100dvh-64px)] min-h-0">
        <div className="mx-auto grid h-full min-h-0 max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">

          {/* =====================================================
              LEFT HERO
          ===================================================== */}

          <section className="relative hidden min-h-0 items-center lg:flex">
            <div className="relative z-10 max-w-2xl">

              {/* Badge */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-sm text-cyan-300">
                <Sparkles size={15} />

                <span>
                  Your AI travel companion
                </span>
              </div>

              {/* Heading */}

              <h1 className="max-w-xl text-5xl font-bold leading-[0.94] tracking-[-0.04em] sm:text-6xl lg:text-[68px]">
                Your next

                <span className="text-gradient block">
                  adventure
                </span>

                starts here.
              </h1>

              {/* Description */}

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Tell KelanaAI where you want to go,
                your budget, and your travel style.
                We&apos;ll craft a personalized itinerary
                designed around your trip.
              </p>

              {/* Benefits */}

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">

                <div className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="text-cyan-400"
                  />
                  Personalized
                </div>

                <div className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="text-cyan-400"
                  />
                  Budget-aware
                </div>

                <div className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="text-cyan-400"
                  />
                  AI-powered
                </div>

              </div>
            </div>
          </section>

          {/* =====================================================
              RIGHT PANEL
          ===================================================== */}

          <section className="flex min-h-0 items-center justify-center lg:justify-end">
            <div className="glass glow relative flex h-[calc(100dvh-84px)] max-h-[760px] min-h-0 w-full max-w-[500px] flex-col overflow-hidden rounded-[28px] p-4 shadow-2xl shadow-black/40 sm:p-5 lg:p-6">

              {/* Decorative glow */}

              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

              {/* =================================================
                  FORM
              ================================================= */}

              {!trip ? (
                <div className="relative flex min-h-0 flex-1 flex-col">

                  {/* Header */}

                  <div className="shrink-0">

                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-400">
                      <Sparkles size={16} />

                      <span>
                        PLAN YOUR JOURNEY
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight">
                      Where will you go next?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Share a few details and let
                      KelanaAI build a personalized
                      travel plan for you.
                    </p>

                  </div>

                  {/* Form */}

                  <form
                    onSubmit={handleSubmit}
                    className="relative mt-5 flex min-h-0 flex-1 flex-col justify-between"
                  >

                    <div className="space-y-4">

                      {/* Destination */}

                      <div>
                        <label
                          htmlFor="destination"
                          className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400"
                        >
                          <MapPin
                            size={14}
                            className="text-cyan-400"
                          />

                          Destination
                        </label>

                        <input
                          id="destination"
                          type="text"
                          value={destination}
                          onChange={(event) =>
                            setDestination(
                              event.target.value
                            )
                          }
                          placeholder="e.g. Japan"
                          className="input-field"
                          autoComplete="off"
                        />
                      </div>

                      {/* Budget + Days */}

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label
                            htmlFor="budget"
                            className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400"
                          >
                            <DollarSign
                              size={14}
                              className="text-cyan-400"
                            />

                            Budget
                          </label>

                          <input
                            id="budget"
                            type="number"
                            min="1"
                            value={budget}
                            onChange={(event) =>
                              setBudget(
                                event.target.value
                              )
                            }
                            placeholder="2000"
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="days"
                            className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400"
                          >
                            <Compass
                              size={14}
                              className="text-cyan-400"
                            />

                            Days
                          </label>

                          <input
                            id="days"
                            type="number"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(event) =>
                              setDays(
                                event.target.value
                              )
                            }
                            placeholder="5"
                            className="input-field"
                          />
                        </div>

                      </div>

                      {/* Travel Style */}

                      <div>
                        <label
                          htmlFor="travelStyle"
                          className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400"
                        >
                          <Users
                            size={14}
                            className="text-cyan-400"
                          />

                          Travel Style
                        </label>

                        <select
                          id="travelStyle"
                          value={travelStyle}
                          onChange={(event) =>
                            setTravelStyle(
                              event.target.value
                            )
                          }
                          className="input-field appearance-none"
                        >
                          <option value="">
                            Select your travel style
                          </option>

                          <option value="Backpacker">
                            Backpacker
                          </option>

                          <option value="Family">
                            Family
                          </option>

                          <option value="Adventure">
                            Adventure
                          </option>

                          <option value="Cultural">
                            Cultural
                          </option>

                          <option value="Relaxing">
                            Relaxing
                          </option>

                          <option value="Luxury">
                            Luxury
                          </option>
                        </select>
                      </div>

                      {/* Error */}

                      {error && (
                        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
                          {error}
                        </div>
                      )}

                    </div>

                    {/* Action */}

                    <div className="mt-5 shrink-0">

                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                      >

                        {loading ? (
                          <>
                            <LoaderCircle
                              size={18}
                              className="animate-spin"
                            />

                            <span>
                              Creating your itinerary...
                            </span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />

                            <span>
                              Generate My Trip
                            </span>

                            <ArrowRight
                              size={17}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </>
                        )}

                      </button>

                      <p className="mt-3 text-center text-xs text-slate-500">
                        Powered by Amazon Bedrock
                      </p>

                    </div>

                  </form>
                </div>
              ) : (

                /* =================================================
                   RESULT
                ================================================= */

                <div className="relative flex h-full min-h-0 flex-1 flex-col">

                  {/* Result Header */}

                  <div className="shrink-0">

                    <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                      <Sparkles size={16} />

                      <span>
                        YOUR TRIP PLAN
                      </span>
                    </div>

                    <div className="mt-2 flex items-end justify-between gap-3">

                      <div className="min-w-0">

                        <h2 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                          {trip.destination}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          {trip.days}-day{" "}
                          {trip.travel_style} journey
                        </p>

                      </div>

                      <div className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-right">

                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Budget
                        </p>

                        <p className="text-sm font-semibold">
                          $
                          {trip.budget.toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      SCROLLABLE ITINERARY
                  ================================================= */}

                  <div
                    ref={itineraryRef}
                    className="custom-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2"
                  >

                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 sm:p-5">

                      {/* Summary */}

                      <div className="mb-4 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">

                        <div className="p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Budget
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            $
                            {trip.budget.toLocaleString()}
                          </p>
                        </div>

                        <div className="p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Daily
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            $
                            {trip.daily_budget.toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 0,
                              }
                            )}
                          </p>
                        </div>

                        <div className="p-3 text-center">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Category
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {trip.category}
                          </p>
                        </div>

                      </div>

                      {/* Transport */}

                      <div className="mb-5 border-b border-white/10 pb-4">

                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Transport
                        </p>

                        <p className="mt-1 text-sm text-slate-200">
                          {trip.recommendation_transport}
                        </p>

                      </div>

                      {/* AI Itinerary */}

                      <div>

                        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-cyan-400">
                          AI Itinerary
                        </p>

                        <div className="markdown-content">
                          <ReactMarkdown>
                            {trip.ai_recommendation}
                          </ReactMarkdown>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Footer */}

                  <div className="mt-3 shrink-0">

                    <button
                      onClick={resetTrip}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-white"
                    >
                      <Compass size={16} />

                      Plan Another Trip
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-500">
                      Powered by Amazon Bedrock
                    </p>

                  </div>

                </div>
              )}

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}