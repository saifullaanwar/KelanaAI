"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  Check,
  Compass,
  DollarSign,
  GitFork,
  Globe,
  LoaderCircle,
  MapPin,
  Sparkles,
  Users,
  X as XIcon,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DESTINATIONS = [
  "🇯🇵 Japan", "🇮🇹 Italy", "🇵🇪 Peru",
  "🇹🇭 Thailand", "🇳🇿 New Zealand", "🇲🇦 Morocco",
];

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [trip, setTrip] = useState<TripResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const itineraryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trip && itineraryRef.current) itineraryRef.current.scrollTop = 0;
  }, [trip]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setTrip(null);

    if (!destination || !budget || !days || !travelStyle) {
      setError("Please complete all trip details before generating your trip.");
      return;
    }
    if (Number(budget) <= 0 || Number(days) <= 0) {
      setError("Budget and number of days must be greater than zero.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          budget: Number(budget),
          days: Number(days),
          travel_style: travelStyle,
        }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setTrip(await res.json());
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't generate your itinerary. Please make sure the backend is running and try again."
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
    <div className="flex min-h-dvh flex-col bg-[#050816] text-white">

      {/* ── Globe fixed di viewport, footer solid menutupinya saat scroll ── */}
      <TravelGlobe />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="hero-grid absolute inset-0 opacity-30" />
      </div>

      {/* ══════════════════════════════════
          MAIN
      ══════════════════════════════════ */}
      <main className="relative z-10 flex-1">
        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-64px)] max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_480px] lg:gap-10 lg:px-8 lg:py-0">

          {/* ── LEFT: hero text ── */}
          <section className="flex flex-col justify-center">

            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-sm text-cyan-300">
              <Sparkles size={14} />
              <span>Your AI travel companion</span>
            </div>

            <h1 className="text-4xl font-bold leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-[62px] xl:text-[70px]">
              Your next
              <span className="text-gradient block">adventure</span>
              starts here.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
              Tell KelanaAI where you want to go, your budget, and travel style.
              We&apos;ll craft a personalized itinerary designed just for you.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-slate-400">
              {["Personalized", "Budget-aware", "AI-powered", "Instant"].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <Check size={15} className="text-cyan-400" />
                  {b}
                </div>
              ))}
            </div>

            {/* Quick-pick destination chips */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
                Popular destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setDestination(dest.split(" ")[1])}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.08] hover:text-white"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

          </section>

          {/* ── RIGHT: form / result panel ── */}
          <section className="flex justify-center lg:items-center lg:justify-end lg:py-8">
            <div className="glass glow relative flex w-full max-w-[500px] flex-col overflow-hidden rounded-[28px] p-5 shadow-2xl shadow-black/50 sm:p-6 lg:max-h-[calc(100dvh-100px)]">

              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-violet-500/[0.08] blur-3xl" />

              {/* ── FORM ── */}
              {!trip ? (
                <div className="relative flex min-h-0 flex-1 flex-col">
                  <div className="shrink-0">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-400">
                      <Sparkles size={15} />
                      <span>PLAN YOUR JOURNEY</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Where will you go next?
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-slate-400">
                      Share a few details and let KelanaAI build your trip.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">

                    <div>
                      <label htmlFor="destination" className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                        <MapPin size={13} className="text-cyan-400" /> Destination
                      </label>
                      <input
                        id="destination" type="text" value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Japan, Italy, Bali…"
                        className="input-field" autoComplete="off"
                      />
                    </div>

                    {/* Budget + Days — 1 col on mobile, 2 col on sm+ */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="budget" className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                          <DollarSign size={13} className="text-cyan-400" /> Budget (USD)
                        </label>
                        <input
                          id="budget" type="number" min="1" value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="2000" className="input-field"
                        />
                      </div>
                      <div>
                        <label htmlFor="days" className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                          <Compass size={13} className="text-cyan-400" /> Duration (days)
                        </label>
                        <input
                          id="days" type="number" min="1" max="30" value={days}
                          onChange={(e) => setDays(e.target.value)}
                          placeholder="5" className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="travelStyle" className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                        <Users size={13} className="text-cyan-400" /> Travel Style
                      </label>
                      <select
                        id="travelStyle" value={travelStyle}
                        onChange={(e) => setTravelStyle(e.target.value)}
                        className="input-field appearance-none"
                      >
                        <option value="">Select your travel style</option>
                        <option value="Backpacker">🎒 Backpacker</option>
                        <option value="Family">👨‍👩‍👧 Family</option>
                        <option value="Adventure">🧗 Adventure</option>
                        <option value="Cultural">🏛️ Cultural</option>
                        <option value="Relaxing">🌊 Relaxing</option>
                        <option value="Luxury">✨ Luxury</option>
                      </select>
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit" disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition duration-200 hover:scale-[1.01] hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <><LoaderCircle size={17} className="animate-spin" /> Creating your itinerary…</>
                      ) : (
                        <>
                          <Sparkles size={17} />
                          Generate My Trip
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                      Powered by <span className="text-slate-400">Amazon Bedrock</span>
                    </p>

                  </form>
                </div>

              ) : (

                /* ── RESULT ── */
                <div className="relative flex min-h-0 flex-1 flex-col">
                  <div className="shrink-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                      <Sparkles size={15} />
                      <span>YOUR TRIP PLAN</span>
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-2xl font-bold tracking-tight">{trip.destination}</h2>
                        <p className="mt-0.5 text-sm text-slate-400">
                          {trip.days}-day {trip.travel_style} journey
                        </p>
                      </div>
                      <div className="shrink-0 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-right">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">Budget</p>
                        <p className="text-sm font-semibold">${trip.budget.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div
                    ref={itineraryRef}
                    className="custom-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
                  >
                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5">
                      <div className="mb-4 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                        {[
                          { label: "Budget", value: `$${trip.budget.toLocaleString()}` },
                          { label: "Daily", value: `$${trip.daily_budget.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                          { label: "Category", value: trip.category },
                        ].map(({ label, value }) => (
                          <div key={label} className="p-3 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                            <p className="mt-1 text-sm font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mb-5 border-b border-white/10 pb-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">Transport</p>
                        <p className="mt-1 text-sm text-slate-200">{trip.recommendation_transport}</p>
                      </div>

                      <div>
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-cyan-400">
                          AI Itinerary
                        </p>
                        <div className="markdown-content">
                          <ReactMarkdown>{trip.ai_recommendation}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 shrink-0">
                    <button
                      onClick={resetTrip}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.07] hover:text-white"
                    >
                      <Compass size={15} /> Plan Another Trip
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
      </main>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      {/* Gradient fade sebelum footer — biar transisi ke footer halus */}
      <div className="pointer-events-none relative z-20 h-24 bg-gradient-to-b from-transparent to-[#050816]/60" />

      <footer className="relative z-20 bg-[#050816]/30 backdrop-blur-2xl border-t border-white/[0.08]">

        {/* Subtle cyan glow accent di bagian atas footer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow shadow-cyan-500/20">
                  <Compass size={15} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold tracking-tight">
                  Kelana<span className="text-cyan-400">AI</span>
                </span>
              </div>
              <p className="max-w-[240px] text-sm leading-6 text-slate-500">
                AI-powered travel planning.<br />Dream it, describe it, go.
              </p>
              {/* Bedrock badge di bawah brand */}
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Powered by Amazon Bedrock
              </div>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-3 gap-x-10 gap-y-4 text-sm">
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Product</p>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Features</a>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">How it works</a>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Pricing</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Company</p>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">About</a>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Blog</a>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Careers</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Legal</p>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Privacy</a>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Terms</a>
                <a href="#" className="text-slate-400 transition hover:text-cyan-400">Contact</a>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} KelanaAI. All rights reserved.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              <a href="#" aria-label="GitHub"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-500 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-400">
                <GitFork size={14} />
              </a>
              <a href="#" aria-label="X"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-500 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-400">
                <XIcon size={14} />
              </a>
              <a href="#" aria-label="Website"
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-500 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-400">
                <Globe size={14} />
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
