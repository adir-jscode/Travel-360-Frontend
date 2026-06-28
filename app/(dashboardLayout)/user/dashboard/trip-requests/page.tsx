"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { IJoinRequest, JoinRequestStatus } from "@/types/joinRequest.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  MessageSquare,
  Search,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Tab = "accepted" | "rejected";
type SortKey = "newest" | "oldest" | "destination";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

function formatDateRange(start: string, end: string): string {
  const s = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(start));
  const e = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(end));
  return `${s} – ${e}`;
}

/* ─────────────────── Stat Card ──────────────────── */
function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur-sm p-5 flex items-center gap-4 ${accent}`}
    >
      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-current/10">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight leading-none">
          {value}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-current opacity-5" />
    </motion.div>
  );
}

/* ─────────────────── Request Card ──────────────────── */
function TripRequestCard({ request }: { request: IJoinRequest }) {
  const [expanded, setExpanded] = useState(false);
  const isAccepted = request.status === JoinRequestStatus.ACCEPTED;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28 }}
      className="group rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden hover:border-primary/20 hover:shadow-md transition-all duration-300"
    >
      {/* Status stripe */}
      <div
        className={`h-0.5 w-full ${
          isAccepted
            ? "bg-linear-to-r from-emerald-400 to-teal-400"
            : "bg-linear-to-r from-rose-400 to-rose-600"
        }`}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted ring-2 ring-border/40 group-hover:ring-primary/15 transition-all">
              {request.requester.picture ? (
                <Image
                  src={request.requester.picture}
                  alt={request.requester.name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-primary bg-primary/10">
                  {request.requester.name.charAt(0)}
                </div>
              )}
            </div>
            {request.requester.rating && (
              <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-0.5 bg-card border border-border/60 rounded-full px-1.5 py-0.5 shadow-sm">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold">
                  {request.requester.rating}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-semibold text-foreground leading-tight">
                  {request.requester.name}
                </h3>
                {request.requester.currentLocation && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {request.requester.currentLocation}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    isAccepted
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}
                >
                  {isAccepted ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {isAccepted ? "Accepted" : "Declined"}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {timeAgo(request.updatedAt)}
                </span>
              </div>
            </div>

            {/* Trip info */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-primary" />
                <span className="font-medium text-foreground">
                  {request.travelPlan.destination.city
                    ? `${request.travelPlan.destination.city}, `
                    : ""}
                  {request.travelPlan.destination.country}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" />
                {formatDateRange(
                  request.travelPlan.startDate,
                  request.travelPlan.endDate,
                )}
              </span>
              <span className="font-medium">
                {request.travelPlan.days} days
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-primary" />
                {request.travelPlan.travelType}
              </span>
            </div>

            {/* Interests */}
            {request.requester.travelInterest &&
              request.requester.travelInterest.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {request.requester.travelInterest
                    .slice(0, 4)
                    .map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 rounded-full text-[11px] bg-primary/8 text-primary border border-primary/15 font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                </div>
              )}
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message from {request.requester.name.split(" ")[0]}</span>
              <span className="ml-auto text-primary">
                {expanded ? "Hide" : "Show"}
              </span>
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3 rounded-xl bg-muted/40 border border-border/40 text-sm text-foreground/75 italic leading-relaxed">
                    {request.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────── Empty State ──────────────────── */
function EmptyState({ tab }: { tab: Tab }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center gap-4"
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center ${
          tab === "accepted" ? "bg-emerald-500/10" : "bg-rose-500/10"
        }`}
      >
        {tab === "accepted" ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-500/50" />
        ) : (
          <XCircle className="w-10 h-10 text-rose-400/50" />
        )}
      </div>
      <div>
        <p className="font-semibold text-foreground text-lg">
          {tab === "accepted" ? "No accepted trips yet" : "No declined trips"}
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {tab === "accepted"
            ? "Trips you approve will show up here. Start reviewing pending requests."
            : "Any requests you decline will be listed here for reference."}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Main Page ──────────────────── */
export default function TripRequestsPage() {
  const { accepted, rejected, pending } = useNotifications();
  const [tab, setTab] = useState<Tab>("accepted");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const requests = tab === "accepted" ? accepted : rejected;

  const filtered = useMemo(() => {
    let list = [...requests];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.requester.name.toLowerCase().includes(q) ||
          r.travelPlan.destination.country.toLowerCase().includes(q) ||
          (r.travelPlan.destination.city?.toLowerCase().includes(q) ?? false),
      );
    }
    if (sort === "newest")
      list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (sort === "oldest")
      list.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    if (sort === "destination")
      list.sort((a, b) =>
        a.travelPlan.destination.country.localeCompare(
          b.travelPlan.destination.country,
        ),
      );
    return list;
  }, [requests, search, sort]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trip Requests</h1>
        <p className="text-muted-foreground mt-1">
          Track every traveler you have welcomed or declined across all your
          plans.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Clock className="w-6 h-6 text-amber-500" />}
          value={pending.length}
          label="Pending review"
          accent="border-amber-500/20 text-amber-500"
        />
        <StatCard
          icon={<Check className="w-6 h-6 text-emerald-600" />}
          value={accepted.length}
          label="Travellers accepted"
          accent="border-emerald-500/20 text-emerald-600"
        />
        <StatCard
          icon={<X className="w-6 h-6 text-rose-500" />}
          value={rejected.length}
          label="Requests declined"
          accent="border-rose-500/20 text-rose-500"
        />
      </div>

      {/* Tabs + Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Tab switcher */}
        <div className="flex p-1 rounded-xl bg-muted/60 border border-border/40">
          {(["accepted", "rejected"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "accepted" ? (
                <CheckCircle2
                  className={`w-4 h-4 ${tab === "accepted" ? "text-emerald-500" : ""}`}
                />
              ) : (
                <XCircle
                  className={`w-4 h-4 ${tab === "rejected" ? "text-rose-500" : ""}`}
                />
              )}
              <span className="capitalize">{t}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  t === "accepted"
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-rose-500/15 text-rose-500"
                }`}
              >
                {t === "accepted" ? accepted.length : rejected.length}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or destination…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border/60 bg-background/60 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2.5 text-sm rounded-xl border border-border/60 bg-background/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="destination">Destination A–Z</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState key="empty" tab={tab} />
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <AnimatePresence>
                {filtered.map((req) => (
                  <TripRequestCard key={req._id} request={req} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
