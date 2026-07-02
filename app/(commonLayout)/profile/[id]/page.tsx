import { ReviewCard } from "@/components/modules/review/ReviewCard";
import { getUserReviews } from "@/services/review/review.service";
import { getUserProfilePublic } from "@/services/user/user.service";
import { SUBSCRIPTION_PLAN } from "@/types/user.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Quote,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

/* ── helpers ─────────────────────────────────────────────── */
const PLAN_CONFIG = {
  [SUBSCRIPTION_PLAN.EXPLORER]: {
    label: "Explorer",
    icon: "🧭",
    gradient: "from-emerald-500 to-teal-500",
    glow: "ring-emerald-500/30",
    bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  },
  [SUBSCRIPTION_PLAN.WANDERER]: {
    label: "Wanderer",
    icon: "🌙",
    gradient: "from-violet-500 to-purple-500",
    glow: "ring-violet-500/30",
    bg: "bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-400",
  },
  [SUBSCRIPTION_PLAN.VOYAGER]: {
    label: "Voyager",
    icon: "🚀",
    gradient: "from-amber-400 to-orange-500",
    glow: "ring-amber-500/30",
    bg: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
  },
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <div className="text-muted-foreground mb-1">{icon}</div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────── */
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, { reviews, total: reviewCount }] = await Promise.all([
    getUserProfilePublic(id),
    getUserReviews(id, 1, 20),
  ]);

  if (!profile) return notFound();

  const plan = profile.subscription?.plan;
  const planCfg = plan ? PLAN_CONFIG[plan] : null;

  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const avgRating = typeof profile.rating === "number" ? profile.rating : null;
  const countryCount = profile.visitedCountries?.length ?? 0;
  const interestCount = profile.travelInterest?.length ?? 0;

  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-background">
      {/* ── Cover + Avatar ───────────────────────────────── */}
      <section className="relative">
        {/* ── Cover ── */}
        <div className="h-52 md:h-64 relative overflow-hidden bg-[#0f1729]">
          {/* Subtle map-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
          />
          {/* Location-dot scatter */}
          <div className="absolute inset-0">
            {[
              [12, 35],
              [28, 55],
              [45, 25],
              [62, 70],
              [75, 40],
              [88, 20],
              [33, 80],
              [55, 50],
              [70, 65],
              [90, 75],
              [20, 15],
              [50, 10],
              [80, 85],
              [15, 90],
              [40, 60],
            ].map(([x, y], i) => (
              <span
                key={i}
                className="absolute w-0.75 h-0.75 rounded-full bg-white/40"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
          </div>
          {/* Radial color washes */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 50% 70% at 15% 60%, rgba(99,179,237,0.22) 0%, transparent 100%),
                radial-gradient(ellipse 45% 60% at 82% 30%, rgba(159,122,234,0.25) 0%, transparent 100%),
                radial-gradient(ellipse 40% 55% at 50% 100%, rgba(56,178,172,0.18) 0%, transparent 100%)`,
            }}
          />
          {/* Bottom fade into card */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/50" />

          {/* "Traveler profile" watermark */}
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-white/25 font-medium whitespace-nowrap select-none">
            Traveler profile
          </p>
        </div>

        {/* ── Avatar + Name row ── */}
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col md:flex-row md:items-end gap-5 pb-6 border-b border-border/50">
            {/* Avatar — overlaps cover with isolated ring so no bleed */}
            <div className="relative shrink-0 self-start -mt-14 md:-mt-16">
              {/*
                KEY FIX: bg-card on the padding wrapper exactly matches the
                card surface below, creating a clean border-like separation
                from the dark cover without any colour bleed.
              */}
              <div
                className={`p-0.75 bg-card rounded-[22px] shadow-xl ring-1 ring-border/60 ${planCfg ? planCfg.glow : ""}`}
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[19px] overflow-hidden bg-muted">
                  {profile.picture ? (
                    <Image
                      src={profile.picture}
                      alt={profile.name}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/30 to-ocean/30 text-4xl font-black text-primary">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Verified badge — anchored to avatar ring */}
              {profile.isVerified && (
                <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pt-4 md:pt-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  {/* Name + inline badges */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                      {profile.name}
                    </h1>
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {planCfg && (
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${planCfg.bg}`}
                      >
                        <span>{planCfg.icon}</span>
                        {planCfg.label}
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {profile.currentLocation && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {profile.currentLocation}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {joinDate}
                    </span>
                    {avgRating !== null && (
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-foreground">
                          {avgRating.toFixed(1)}
                        </span>
                        {reviewCount > 0 && (
                          <span>· {reviewCount} reviews</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-3 text-sm md:text-base text-foreground/70 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/50 border border-border/50 rounded-2xl bg-card/60 backdrop-blur-sm overflow-hidden">
          <StatPill
            icon={<Globe className="w-5 h-5" />}
            value={countryCount}
            label="Countries"
          />
          <StatPill
            icon={<Heart className="w-5 h-5" />}
            value={interestCount}
            label="Interests"
          />
          <StatPill
            icon={<Star className="w-5 h-5" />}
            value={avgRating !== null ? avgRating.toFixed(1) : "—"}
            label="Rating"
          />
          <StatPill
            icon={<MessageSquare className="w-5 h-5" />}
            value={reviewCount}
            label="Reviews"
          />
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* ── Left column ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Visited countries */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-5 border-b border-border/50">
                <div className="w-9 h-9 rounded-xl bg-ocean/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-ocean" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">
                    Countries Visited
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {countryCount} destination{countryCount !== 1 ? "s" : ""}{" "}
                    explored
                  </p>
                </div>
              </div>
              <div className="px-7 py-6">
                {profile.visitedCountries && countryCount > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.visitedCountries.map(
                      (country: string, i: number) => (
                        <span
                          key={country}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean/8 text-ocean border border-ocean/20 text-sm font-medium transition-all hover:bg-ocean/15 hover:scale-105 cursor-default"
                          style={{ animationDelay: `${i * 30}ms` }}
                        >
                          <MapPin className="w-3.5 h-3.5 opacity-70" />
                          {country}
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <EmptySlot
                    icon={<Globe className="w-8 h-8" />}
                    text="No countries added yet"
                  />
                )}
              </div>
            </div>

            {/* Travel interests */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-5 border-b border-border/50">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">
                    Travel Interests
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    What gets {profile.name.split(" ")[0]} excited about travel
                  </p>
                </div>
              </div>
              <div className="px-7 py-6">
                {profile.travelInterest && interestCount > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.travelInterest.map(
                      (interest: string, i: number) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-4 py-2 rounded-full bg-primary/8 text-primary border border-primary/20 text-sm font-medium transition-all hover:bg-primary/15 hover:scale-105 cursor-default"
                          style={{ animationDelay: `${i * 30}ms` }}
                        >
                          {interest}
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <EmptySlot
                    icon={<Sparkles className="w-8 h-8" />}
                    text="No interests added yet"
                  />
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-7 py-5 border-b border-border/50">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">
                    Community Reviews
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {reviewCount} review{reviewCount !== 1 ? "s" : ""} from the
                    community
                  </p>
                </div>
              </div>
              <div className="px-7 py-6">
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <EmptySlot
                    icon={<MessageSquare className="w-8 h-8" />}
                    text="No reviews yet — complete a trip together to leave one"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Right column ─────────────────────────────── */}
          <div className="space-y-6">
            {/* Rating card */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
              <div className="px-6 pt-6 pb-5">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">
                    Rating
                  </h2>
                </div>

                {avgRating !== null ? (
                  <div className="text-center py-4">
                    <div
                      className={`text-6xl font-black bg-linear-to-br ${planCfg?.gradient ?? "from-primary to-primary/60"} bg-clip-text text-transparent`}
                    >
                      {avgRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mt-3 mb-2">
                      <StarRating value={avgRating} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on {reviewCount} review
                      {reviewCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-5xl font-black text-muted-foreground/30">
                      —
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      No ratings yet
                    </p>
                  </div>
                )}
              </div>

              {/* Rating breakdown */}
              {profile.ratings && profile.ratings.length > 0 && (
                <div className="border-t border-border/50 px-6 py-5 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count =
                      profile.ratings?.filter((r) => r.value === star).length ??
                      0;
                    const pct =
                      profile.ratings && profile.ratings.length > 0
                        ? (count / profile.ratings.length) * 100
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4 text-right">
                          {star}
                        </span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-6">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subscription badge */}
            {planCfg && (
              <div
                className={`rounded-3xl overflow-hidden bg-linear-to-br ${planCfg.gradient} p-px`}
              >
                <div className="rounded-[calc(1.5rem-1px)] bg-card px-6 py-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{planCfg.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Membership
                      </p>
                      <p className="font-bold text-lg text-foreground">
                        {planCfg.label}
                      </p>
                    </div>
                  </div>
                  {profile.subscription?.isActive && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-jungle/10 text-jungle border border-jungle/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-jungle" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quick facts */}
            <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
              <div className="px-6 py-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-sm uppercase tracking-wider">
                    About
                  </h2>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4 text-sm">
                {profile.phone && (
                  <FactRow label="Phone" value={profile.phone} />
                )}
                <FactRow label="Member since" value={joinDate} />
                <FactRow
                  label="Account status"
                  value={
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-jungle">
                      <span className="w-1.5 h-1.5 rounded-full bg-jungle" />
                      Active
                    </span>
                  }
                />
                {profile.isVerified && (
                  <FactRow
                    label="Verification"
                    value={
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified traveler
                      </span>
                    }
                  />
                )}
              </div>
            </div>

            {/* Top interest callout */}
            {profile.travelInterest && profile.travelInterest.length > 0 && (
              <div className="rounded-3xl border border-border/50 bg-muted/30 px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Top passion
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {profile.travelInterest[0]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Among {interestCount} listed interests
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Micro-components ────────────────────────────────────── */
function EmptySlot({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-muted-foreground/20 mb-3">{icon}</div>
      <p className="text-sm text-muted-foreground italic">{text}</p>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
