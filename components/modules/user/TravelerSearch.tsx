"use client";

import { useDebounce } from "@/hooks/UseDebounce";
import { IUser } from "@/types/user.types";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TravelerCard } from "./TravelerCard";

const ALL_INTERESTS = [
  "Photography",
  "Hiking",
  "Food Tours",
  "Surfing",
  "Climbing",
  "Camping",
  "Yoga",
  "Culture",
  "Coffee",
  "Architecture",
  "Cycling",
  "Mountains",
  "Music",
  "Nightlife",
  "Wellness",
  "Diving",
  "Skiing",
];

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TravelerSearchProps {
  initialUsers: IUser[];
  initialMeta: Meta;
}

export function TravelerSearch({
  initialUsers,
  initialMeta,
}: TravelerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isFirstRender = useRef(true);

  const debouncedSearch = useDebounce(searchTerm, 450);

  const hasActiveFilters =
    searchTerm || selectedInterest || verifiedOnly || sortBy !== "createdAt";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("searchTerm", debouncedSearch);
      if (selectedInterest) params.set("travelInterest", selectedInterest);
      if (verifiedOnly) params.set("isVerified", "true");
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortBy === "rating" ? "desc" : "desc");
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/users?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data?.data?.data ?? []);
      setMeta(
        data?.data?.meta ?? {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1,
        },
      );
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedInterest, verifiedOnly, sortBy, page]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchUsers();
  }, [fetchUsers]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedInterest, verifiedOnly, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedInterest("");
    setVerifiedOnly(false);
    setSortBy("createdAt");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* ── Search bar ──────────────────────────────────────── */}
      <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-3xl shadow-elegant overflow-hidden">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-border/50">
          {/* Search input */}
          <div className="flex-1 flex items-center gap-3 px-6 py-4">
            <Search className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Search travelers
              </label>
              <input
                type="text"
                placeholder="Name, email, country…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground/50 outline-none"
                autoComplete="off"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interest filter */}
          <div className="flex items-center gap-3 px-6 py-4 min-w-50">
            <Globe className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                Travel interest
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none text-foreground cursor-pointer"
              >
                <option value="">Any interest</option>
                {ALL_INTERESTS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              showFilters || verifiedOnly || sortBy !== "createdAt"
                ? "text-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="whitespace-nowrap">Filters</span>
            {(verifiedOnly || sortBy !== "createdAt") && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {/* Search CTA */}
          <div className="flex items-center px-4 py-3">
            <button
              onClick={fetchUsers}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl px-6 py-3 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-glow"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
        </div>

        {/* Expandable advanced filters */}
        {showFilters && (
          <div className="border-t border-border/50 px-6 py-4 flex flex-wrap gap-6 bg-muted/30 items-center">
            {/* Verified toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
                  verifiedOnly ? "bg-primary" : "bg-border"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    verifiedOnly ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
              <span className="text-sm font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                Verified only
              </span>
            </label>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sort:
              </span>
              <div className="flex gap-1 p-1 bg-background/60 rounded-xl border border-border/50">
                {[
                  { value: "createdAt", label: "Newest" },
                  { value: "rating", label: "Top rated" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      sortBy === opt.value
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Results header ───────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{meta.total}</span>{" "}
              traveler{meta.total !== 1 ? "s" : ""} found
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* Active filter chips */}
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <FilterChip
              label={`"${searchTerm}"`}
              onRemove={() => setSearchTerm("")}
            />
          )}
          {selectedInterest && (
            <FilterChip
              label={selectedInterest}
              onRemove={() => setSelectedInterest("")}
            />
          )}
          {verifiedOnly && (
            <FilterChip
              label="Verified"
              onRemove={() => setVerifiedOnly(false)}
            />
          )}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {users.map((user) => (
            <TravelerCard key={user._id} user={user} />
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────── */}
      {meta.totalPages > 1 && !loading && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
      {label}
      <button onClick={onRemove} className="hover:text-primary/60">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible =
    totalPages <= 7
      ? pages
      : [
          1,
          ...(page > 3 ? ["…"] : []),
          ...pages.slice(
            Math.max(1, page - 2),
            Math.min(page + 1, totalPages - 1),
          ),
          ...(page < totalPages - 2 ? ["…"] : []),
          totalPages,
        ];

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visible.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-muted-foreground text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(Number(p))}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
              page === p
                ? "bg-primary text-primary-foreground shadow-glow"
                : "border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-border/40 bg-card/60 overflow-hidden animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded-lg w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </div>
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-5 w-14 bg-muted rounded-full" />
        </div>
      </div>
      <div className="px-6 pb-5">
        <div className="h-8 bg-muted rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
        <Users className="w-9 h-9 text-muted-foreground/40" />
      </div>
      <h3 className="text-xl font-bold mb-2">No travelers match your search</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Try a different name, email, or broaden your interest filter — great
        travel companions are out there.
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
