"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  Search,
} from "lucide-react";

import TripCard from "./TripCard";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  daily_budget: number;
  category: string;
  travel_style?: string;
  ai_recommendation?: string | null;
};

type TripHistoryClientProps = {
  trips: Trip[];
};

const ITEMS_PER_PAGE = 10;

export default function TripHistoryClient({
  trips,
}: TripHistoryClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Search
   */
  const filteredTrips = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return trips;
    }

    return trips.filter((trip) => {
      return (
        trip.destination.toLowerCase().includes(keyword) ||
        trip.category.toLowerCase().includes(keyword) ||
        trip.travel_style?.toLowerCase().includes(keyword)
      );
    });
  }, [trips, search]);

  /*
   * Sort
   */
  const sortedTrips = useMemo(() => {
    const result = [...filteredTrips];

    switch (sort) {
      case "oldest":
        return result.sort((a, b) => a.id - b.id);

      case "budget-high":
        return result.sort((a, b) => b.budget - a.budget);

      case "budget-low":
        return result.sort((a, b) => a.budget - b.budget);

      case "latest":
      default:
        return result.sort((a, b) => b.id - a.id);
    }
  }, [filteredTrips, sort]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTrips.length / ITEMS_PER_PAGE)
  );

  /*
   * Make sure current page is always valid
   * after searching, sorting, or data changes.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return sortedTrips.slice(startIndex, endIndex);
  }, [sortedTrips, currentPage]);

  /*
   * Search handler
   */
  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  /*
   * Sort handler
   */
  function handleSort(value: string) {
    setSort(value);
    setCurrentPage(1);
  }

  /*
   * Pagination range
   */
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startItem =
    sortedTrips.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    sortedTrips.length
  );

  return (
    <div>
      {/* =====================================================
          SEARCH & SORT
      ===================================================== */}
      <section className="mb-6 rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Search trips..."
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500/60 focus:bg-slate-900/80 focus:ring-2 focus:ring-cyan-500/10"
            />
          </div>

          {/* Sort */}
          <div className="relative sm:w-52">
            <ArrowUpDown
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={sort}
              onChange={(event) =>
                handleSort(event.target.value)
              }
              className="w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 py-3 pl-11 pr-4 text-sm font-medium text-slate-300 outline-none transition focus:border-cyan-500/60 focus:bg-slate-900/80 focus:ring-2 focus:ring-cyan-500/10 [&>option]:bg-slate-900"
            >
              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="budget-high">
                Highest Budget
              </option>

              <option value="budget-low">
                Lowest Budget
              </option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            {sortedTrips.length}{" "}
            {sortedTrips.length === 1
              ? "saved itinerary"
              : "saved itineraries"}
          </span>

          {sortedTrips.length > 0 && (
            <span>
              Showing {startItem}-{endItem}
            </span>
          )}
        </div>
      </section>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}
      {sortedTrips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700/60 bg-slate-800/30 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <Search
              size={24}
              className="text-slate-500"
            />
          </div>

          <h2 className="mt-4 text-xl font-bold text-white">
            No trips found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Try another destination, category, or travel
            style.
          </p>
        </div>
      ) : (
        <>
          {/* =================================================
              TRIP LIST
          ================================================= */}
          <div className="grid gap-3">
            {paginatedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              {/* Page information */}
              <div className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">
                    Previous
                  </span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                          : "border border-slate-700/60 bg-slate-800/50 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">
                    Next
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}