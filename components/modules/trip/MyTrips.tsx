"use client";

import { getInitials } from "@/lib/helpers";
import { ITrip, ITripPerson, TripStatus } from "@/types/trip.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Compass,
  Crown,
  DollarSign,
  Globe2,
  ListChecks,
  Luggage,
  MapPin,
  PlaneTakeoff,
  Search,
  Sparkles,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TripReviewSection } from "../review/TripReviewSection";
import { TripPhotoUpload } from "./TripPhotoUpload";
import { TripStatusActions } from "./TripStatusActions";

type StatusFilter = "all" | "upcoming" | "ongoing" | "completed" | "cancelled";
type SortKey = "soonest" | "newest" | "destination";
/** Status derived purely from the travel plan's start/end dates. */
type DateStatus = "upcoming" | "ongoing" | "completed";

/* ─────────────────── Date helpers ──────────────────── */
function formatDateRange(start: string, end: string): string {
  if (!start || !end) return "—";
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

function getDateStatus(startDate: string, endDate: string): DateStatus {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
}

/**
 * Resolves the status shown on a trip card: the host's explicit
 * "cancelled"/"completed" choice always wins, otherwise fall back to the
 * date-derived status.
 */
function resolveDisplayStatus(
  persisted: TripStatus | undefined,
  dateStatus: DateStatus,
): Exclude<StatusFilter, "all"> {
  if (persisted === TripStatus.CANCELLED) return "cancelled";
  if (persisted === TripStatus.COMPLETED) return "completed";
  return dateStatus;
}

function getCountdownLabel(
  status: DateStatus,
  startDate: string,
  endDate: string,
): string {
  const now = Date.now();
  if (status === "upcoming") {
    const days = Math.ceil((new Date(startDate).getTime() - now) / 86_400_000);
    if (days === 0) return "Starts today";
    if (days === 1) return "Starts tomorrow";
    return `In ${days} days`;
  }
  if (status === "ongoing") {
    const daysLeft = Math.ceil(
      (new Date(endDate).getTime() - now) / 86_400_000,
    );
    if (daysLeft <= 0) return "Wraps up today";
    if (daysLeft === 1) return "1 day left";
    return `${daysLeft} days left`;
  }
  const daysAgo = Math.floor((now - new Date(endDate).getTime()) / 86_400_000);
  if (daysAgo <= 0) return "Just wrapped";
  if (daysAgo === 1) return "Ended yesterday";
  return `Ended ${daysAgo} days ago`;
}

const STATUS_STYLES: Record<
  Exclude<StatusFilter, "all">,
  { label: string; dot: string; badge: string; stripe: string }
> = {
  upcoming: {
    label: "Upcoming",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
    stripe: "from-primary to-amber-400",
  },
  ongoing: {
    label: "Ongoing",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    stripe: "from-emerald-400 to-teal-400",
  },
  completed: {
    label: "Completed",
    dot: "bg-muted-foreground",
    badge: "bg-muted text-muted-foreground border-border",
    stripe: "from-slate-300 to-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    stripe: "from-rose-400 to-rose-500",
  },
};

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

/* ─────────────────── Avatar stack ──────────────────── */
function PersonAvatar({
  person,
  size = 36,
  ring,
}: {
  person: ITripPerson;
  size?: number;
  ring?: string;
}) {
  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden bg-muted ring-2 ${
        ring ?? "ring-card"
      }`}
      style={{ width: size, height: size }}
      title={person.name}
    >
      {person.picture ? (
        <Image
          src={person.picture}
          alt={person.name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10"
          style={{ fontSize: size * 0.38 }}
        >
          {getInitials(person.name)}
        </div>
      )}
    </div>
  );
}

function MemberStack({ people }: { people: ITripPerson[] }) {
  const visible = people.slice(0, 4);
  const extra = people.length - visible.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {visible.map((p) => (
          <PersonAvatar key={p._id} person={p} size={32} />
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-xs font-semibold text-muted-foreground">
          +{extra} more
        </span>
      )}
    </div>
  );
}

/* ─────────────────── Trip Card ──────────────────── */
function TripCard({
  trip,
  currentUserId,
}: {
  trip: ITrip;
  currentUserId?: string;
}) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [persistedStatus, setPersistedStatus] = useState<
    TripStatus | undefined
  >(trip.status);
  const plan = trip.travelPlan;
  const dateStatus = getDateStatus(plan.startDate, plan.endDate);
  const displayStatus = resolveDisplayStatus(persistedStatus, dateStatus);
  const styles = STATUS_STYLES[displayStatus];
  const isHost = currentUserId ? trip.host?._id === currentUserId : false;
  const isMember =
    isHost ||
    (currentUserId
      ? trip.members.some((m) => m.user?._id === currentUserId)
      : false);
  const companions = trip.members
    .map((m) => m.user)
    .filter((u): u is ITripPerson => !!u && u._id !== trip.host?._id);
  const destinationLabel = plan.destination?.city
    ? `${plan.destination.city}, ${plan.destination.country}`
    : (plan.destination?.country ?? "this trip");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28 }}
      className="group relative rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Status stripe */}
      <div className={`h-1 w-full bg-linear-to-r ${styles.stripe}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border ${styles.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                {styles.label}
              </span>
              {isHost && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold border bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Crown className="w-3 h-3" />
                  You&apos;re hosting
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg leading-tight flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">
                {plan.destination?.city ? `${plan.destination.city}, ` : ""}
                {plan.destination?.country ?? "Unknown destination"}
              </span>
            </h3>
          </div>
          <span className="shrink-0 text-xs font-semibold text-muted-foreground bg-muted/60 border border-border/40 rounded-full px-2.5 py-1">
            {displayStatus === "cancelled"
              ? "Cancelled"
              : getCountdownLabel(dateStatus, plan.startDate, plan.endDate)}
          </span>
        </div>

        {/* Meta grid */}
        <div className="mt-4 grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {formatDateRange(plan.startDate, plan.endDate)}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Luggage className="w-3.5 h-3.5 text-primary" />
            {plan.days} {plan.days === 1 ? "day" : "days"}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            {plan.travelType}
          </div>
          {(plan.budgetMin || plan.budgetMax) && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              {plan.budgetMin ?? 0}–{plan.budgetMax ?? 0}
            </div>
          )}
        </div>

        {/* Host */}
        {trip.host && (
          <div className="mt-4 flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border/40">
            <PersonAvatar person={trip.host} size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {isHost ? "You" : trip.host.name}
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  · Host
                </span>
              </p>
              {trip.host.bio && (
                <p className="text-xs text-muted-foreground truncate">
                  {trip.host.bio}
                </p>
              )}
            </div>
            {typeof trip.host.rating === "number" && (
              <div className="flex items-center gap-0.5 shrink-0 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {trip.host.rating.toFixed(1)}
              </div>
            )}
          </div>
        )}

        {/* Companions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary" />
            {trip.members.length}{" "}
            {trip.members.length === 1 ? "traveler" : "travelers"}
          </div>
          {companions.length > 0 ? (
            <MemberStack people={companions} />
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Just you and the host
            </span>
          )}
        </div>

        {/* Itinerary preview */}
        {plan.itinerary && plan.itinerary.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowItinerary((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>
                {plan.itinerary.length} day
                {plan.itinerary.length === 1 ? "" : "s"} planned
              </span>
              <span className="ml-auto text-primary">
                {showItinerary ? "Hide" : "Show"}
              </span>
            </button>
            <AnimatePresence>
              {showItinerary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ol className="mt-2 space-y-1.5">
                    {plan.itinerary.slice(0, 4).map((day) => (
                      <li
                        key={day.day}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs"
                      >
                        <span className="shrink-0 font-bold text-primary">
                          D{day.day}
                        </span>
                        <span className="text-foreground/80 line-clamp-1">
                          {day.title}
                        </span>
                      </li>
                    ))}
                    {plan.itinerary.length > 4 && (
                      <li className="text-xs text-muted-foreground pl-1">
                        +{plan.itinerary.length - 4} more day
                        {plan.itinerary.length - 4 === 1 ? "" : "s"}
                      </li>
                    )}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Actions: host controls, photo upload, and CTA all anchor to the bottom */}
        <div className="mt-auto pt-4 border-t border-border/40 space-y-2.5">
          {/* Host controls: complete / cancel */}
          {isHost && (
            <TripStatusActions
              tripId={trip._id}
              isHost={isHost}
              dateStatus={dateStatus}
              persistedStatus={persistedStatus}
              destination={destinationLabel}
              onStatusChange={setPersistedStatus}
            />
          )}

          {/* Photo upload + companion reviews, unlocked once the trip is marked complete */}
          {isMember && persistedStatus === TripStatus.COMPLETED && (
            <>
              <div className="flex items-center gap-2">
                <TripPhotoUpload
                  tripId={trip._id}
                  destination={destinationLabel}
                  existingPhotos={trip.photos}
                />
                {trip.photos && trip.photos.length > 0 && (
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {trip.photos.length} shared
                  </span>
                )}
              </div>

              <TripReviewSection
                tripId={trip._id}
                currentUserId={currentUserId}
                companions={[
                  ...(trip.host && trip.host._id !== currentUserId
                    ? [trip.host]
                    : []),
                  ...companions,
                ]}
              />
            </>
          )}

          <Link
            href={`/travel-plans/${plan._id}`}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200 text-sm font-semibold"
          >
            <PlaneTakeoff className="w-4 h-4" />
            View Trip Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Empty State ──────────────────── */
function EmptyState({ filter }: { filter: StatusFilter }) {
  const config: Record<StatusFilter, { title: string; desc: string }> = {
    all: {
      title: "No trips yet",
      desc: "Once you host a trip or a join request is accepted, it will show up here.",
    },
    upcoming: {
      title: "Nothing upcoming",
      desc: "Plan a new adventure or wait for a join request to be accepted.",
    },
    ongoing: {
      title: "No trips in progress",
      desc: "Trips currently underway will appear here in real time.",
    },
    completed: {
      title: "No completed trips",
      desc: "Trips you've wrapped up will be archived here for your memories.",
    },
    cancelled: {
      title: "No cancelled trips",
      desc: "Trips you or a host cancel will show up here for reference.",
    },
  };
  const { title, desc } = config[filter];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/10">
        {filter === "cancelled" ? (
          <XCircle className="w-10 h-10 text-primary/50" />
        ) : (
          <Compass className="w-10 h-10 text-primary/50" />
        )}
      </div>
      <div>
        <p className="font-semibold text-foreground text-lg">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{desc}</p>
      </div>
      <Link
        href="/travel-plans"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Sparkles className="w-4 h-4" />
        Explore travel plans to join
      </Link>
    </motion.div>
  );
}

/* ─────────────────── Main Component ──────────────────── */
export default function MyTripsComponent({
  initialTrips,
  currentUserId,
}: {
  initialTrips: ITrip[];
  currentUserId?: string;
}) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("soonest");

  const withStatus = useMemo(
    () =>
      initialTrips.map((trip) => ({
        trip,
        status: resolveDisplayStatus(
          trip.status,
          getDateStatus(trip.travelPlan.startDate, trip.travelPlan.endDate),
        ),
      })),
    [initialTrips],
  );

  const counts = useMemo(
    () => ({
      all: withStatus.length,
      upcoming: withStatus.filter((t) => t.status === "upcoming").length,
      ongoing: withStatus.filter((t) => t.status === "ongoing").length,
      completed: withStatus.filter((t) => t.status === "completed").length,
      cancelled: withStatus.filter((t) => t.status === "cancelled").length,
    }),
    [withStatus],
  );

  const hostedCount = useMemo(
    () =>
      currentUserId
        ? initialTrips.filter((t) => t.host?._id === currentUserId).length
        : 0,
    [initialTrips, currentUserId],
  );

  const filtered = useMemo(() => {
    let list = withStatus.filter(
      (t) => filter === "all" || t.status === filter,
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(({ trip }) => {
        const dest = trip.travelPlan.destination;
        return (
          dest?.country?.toLowerCase().includes(q) ||
          dest?.city?.toLowerCase().includes(q) ||
          trip.host?.name?.toLowerCase().includes(q) ||
          trip.members.some((m) => m.user?.name?.toLowerCase().includes(q))
        );
      });
    }

    const sorted = [...list];
    if (sort === "soonest") {
      sorted.sort(
        (a, b) =>
          new Date(a.trip.travelPlan.startDate).getTime() -
          new Date(b.trip.travelPlan.startDate).getTime(),
      );
    } else if (sort === "newest") {
      sorted.sort((a, b) => b.trip.createdAt.localeCompare(a.trip.createdAt));
    } else {
      sorted.sort((a, b) =>
        (a.trip.travelPlan.destination?.country ?? "").localeCompare(
          b.trip.travelPlan.destination?.country ?? "",
        ),
      );
    }
    return sorted;
  }, [withStatus, filter, search, sort]);

  const tabs: { key: StatusFilter; label: string; color: string }[] = [
    { key: "all", label: "All", color: "bg-primary/15 text-primary" },
    { key: "upcoming", label: "Upcoming", color: "bg-primary/15 text-primary" },
    {
      key: "ongoing",
      label: "Ongoing",
      color: "bg-emerald-500/15 text-emerald-600",
    },
    {
      key: "completed",
      label: "Completed",
      color: "bg-muted text-muted-foreground",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      color: "bg-rose-500/15 text-rose-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Luggage className="w-8 h-8 text-primary" />
          My Trips
        </h1>
        <p className="text-muted-foreground mt-1">
          Every trip you&apos;re hosting or joining, all in one place.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Compass className="w-6 h-6 text-primary" />}
          value={counts.all}
          label="Total trips"
          accent="border-primary/20 text-primary"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-primary" />}
          value={counts.upcoming}
          label="Upcoming"
          accent="border-primary/20 text-primary"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          value={counts.ongoing}
          label="In progress"
          accent="border-emerald-500/20 text-emerald-600"
        />
        <StatCard
          icon={<Crown className="w-6 h-6 text-amber-600" />}
          value={hostedCount}
          label="You're hosting"
          accent="border-amber-500/20 text-amber-600"
        />
      </div>

      {/* Tabs + Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap p-1 rounded-xl bg-muted/60 border border-border/40">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === t.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${t.color}`}
              >
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search destination or traveler…"
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
            <option value="soonest">Soonest first</option>
            <option value="newest">Recently added</option>
            <option value="destination">Destination A–Z</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <EmptyState key="empty" filter={filter} />
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {filtered.map(({ trip }) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  currentUserId={currentUserId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
