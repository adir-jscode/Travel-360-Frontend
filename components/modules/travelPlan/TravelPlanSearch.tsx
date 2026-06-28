"use client";

import { useDebounce } from "@/hooks/UseDebounce";
import { ITravelPlan, TravelType } from "@/types/travelPlan.types";
import {
  Calendar,
  Globe,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TravelPlanCard } from "./TravelPlanCard";

interface Filters {
  country: string;
  city: string;
  startDate: string;
  endDate: string;
}

const TRAVEL_TYPE_LABELS: Record<TravelType, string> = {
  [TravelType.SOLO]: "Solo",
  [TravelType.FAMILY]: "Family",
  [TravelType.FRIENDS]: "Friends",
};

const POPULAR_DESTINATIONS = [
  "Japan",
  "Italy",
  "France",
  "Thailand",
  "Australia",
  "Morocco",
];

interface TravelPlanSearchProps {
  initialPlans: ITravelPlan[];
  isLoggedIn?: boolean;
  hasSubscription?: boolean;
  currentUserId?: string;
}

export function TravelPlanSearch({
  initialPlans,
  isLoggedIn = false,
  hasSubscription = false,
  currentUserId,
}: TravelPlanSearchProps) {
  const [filters, setFilters] = useState<Filters>({
    country: "",
    city: "",
    startDate: "",
    endDate: "",
  });
  const [plans, setPlans] = useState<ITravelPlan[]>(initialPlans);
  const [loading, setLoading] = useState(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState<TravelType | "ALL">(
    "ALL",
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isFirstRender = useRef(true);

  const debouncedCountry = useDebounce(filters.country, 500);
  const debouncedCity = useDebounce(filters.city, 500);
  const debouncedStartDate = useDebounce(filters.startDate, 300);
  const debouncedEndDate = useDebounce(filters.endDate, 300);

  const hasActiveFilters =
    filters.country ||
    filters.city ||
    filters.startDate ||
    filters.endDate ||
    activeTypeFilter !== "ALL";

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedCountry) params.set("country", debouncedCountry);
      if (debouncedCity) params.set("city", debouncedCity);
      if (debouncedStartDate) params.set("startDate", debouncedStartDate);
      if (debouncedEndDate) params.set("endDate", debouncedEndDate);

      const qs = params.toString();
      const res = await fetch(`/api/travel-plans${qs ? `?${qs}` : ""}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPlans(data?.data ?? []);
    } catch {
      // keep showing stale data on error
    } finally {
      setLoading(false);
    }
  }, [debouncedCountry, debouncedCity, debouncedStartDate, debouncedEndDate]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchPlans();
  }, [fetchPlans]);

  const clearFilters = () => {
    setFilters({ country: "", city: "", startDate: "", endDate: "" });
    setActiveTypeFilter("ALL");
  };

  const filteredPlans =
    activeTypeFilter === "ALL"
      ? plans
      : plans.filter((p) => p.travelType === activeTypeFilter);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-3xl shadow-elegant overflow-hidden">
          {/* Primary search row */}
          <div className="flex flex-col md:flex-row gap-0 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {/* Country */}
            <div className="flex-1 flex items-center gap-3 px-6 py-4 group">
              <Globe className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Japan, France…"
                  value={filters.country}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, country: e.target.value }))
                  }
                  className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground/50 outline-none"
                />
              </div>
              {filters.country && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, country: "" }))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City */}
            <div className="flex-1 flex items-center gap-3 px-6 py-4">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo, Paris…"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, city: e.target.value }))
                  }
                  className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground/50 outline-none"
                />
              </div>
              {filters.city && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, city: "" }))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date range toggle */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex items-center gap-3 px-6 py-4 hover:bg-accent/50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Dates
                </p>
                <p className="text-sm font-medium text-muted-foreground/70">
                  {filters.startDate || filters.endDate
                    ? `${filters.startDate || "Any"} → ${filters.endDate || "Any"}`
                    : "Any dates"}
                </p>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>

            {/* Search button */}
            <div className="flex items-center px-4 py-3">
              <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-glow">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>

          {/* Date range expander */}
          {filtersOpen && (
            <div className="border-t border-border/50 px-6 py-4 flex flex-col sm:flex-row gap-4 bg-muted/30">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Departure from
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Departure until
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  min={filters.startDate}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="w-full bg-background/60 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick-pick destinations */}
      {!hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">
            Popular:
          </span>
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest}
              onClick={() => setFilters((f) => ({ ...f, country: dest }))}
              className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-card hover:border-primary/50 hover:text-primary transition-colors font-medium"
            >
              {dest}
            </button>
          ))}
        </div>
      )}

      {/* Travel type + clear filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl">
          {(["ALL", ...Object.values(TravelType)] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTypeFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTypeFilter === type
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "ALL" ? "All types" : TRAVEL_TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filteredPlans.length}
            </span>{" "}
            {filteredPlans.length === 1 ? "plan" : "plans"} found
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => (
            <TravelPlanCard
              key={plan._id}
              plan={plan}
              href={`/travel-plans/${plan._id}`}
              isLoggedIn={isLoggedIn}
              hasSubscription={hasSubscription}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden animate-pulse">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded-lg w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
        <div className="h-px bg-border/50" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
        <MapPin className="w-9 h-9 text-muted-foreground/40" />
      </div>
      <h3 className="text-xl font-bold mb-2">No plans match your search</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Try adjusting your filters — different dates, a nearby city, or a
        broader destination might turn up something great.
      </p>
      <button
        onClick={onClear}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <X className="w-4 h-4" />
        Clear all filters
      </button>
    </div>
  );
}
