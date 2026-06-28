import { IUser, SUBSCRIPTION_PLAN } from "@/types/user.types";
import { CheckCircle2, Globe, MapPin, Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TravelerCardProps {
  user: IUser;
}

const PLAN_STYLES: Record<SUBSCRIPTION_PLAN, { label: string; class: string }> =
  {
    [SUBSCRIPTION_PLAN.EXPLORER]: {
      label: "Explorer",
      class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    [SUBSCRIPTION_PLAN.WANDERER]: {
      label: "Wanderer",
      class: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    },
    [SUBSCRIPTION_PLAN.VOYAGER]: {
      label: "Voyager",
      class: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
  };

export function TravelerCard({ user }: TravelerCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const plan = user.subscription?.plan;
  const planStyle = plan ? PLAN_STYLES[plan] : null;

  const rating =
    typeof user.rating === "number" ? user.rating.toFixed(1) : null;
  const reviewCount = user.reviews?.length ?? 0;

  return (
    <Link
      href={`/profile/${user._id}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl"
    >
      <article className="relative h-full rounded-3xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant hover:border-primary/20">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-linear-to-br from-primary/20 to-ocean/20 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                    {initials}
                  </div>
                )}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-foreground truncate">
                  {user.name}
                </h3>
                {planStyle && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${planStyle.class}`}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    {planStyle.label}
                  </span>
                )}
              </div>

              {user.currentLocation && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {user.currentLocation}
                </p>
              )}

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{rating}</span>
                  {reviewCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Travel interests */}
          {user.travelInterest && user.travelInterest.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {user.travelInterest.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15"
                >
                  {interest}
                </span>
              ))}
              {user.travelInterest.length > 4 && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  +{user.travelInterest.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Visited countries strip */}
          {user.visitedCountries && user.visitedCountries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                <span className="font-semibold text-foreground">
                  {user.visitedCountries.length}
                </span>{" "}
                {user.visitedCountries.length === 1 ? "country" : "countries"}{" "}
                visited ·{" "}
                <span className="text-foreground/70">
                  {user.visitedCountries.slice(0, 3).join(", ")}
                  {user.visitedCountries.length > 3 ? "…" : ""}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* CTA footer */}
        <div className="px-6 pb-5">
          <div className="w-full text-center text-xs font-semibold text-primary/70 group-hover:text-primary transition-all py-2 rounded-xl border border-dashed border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/5  duration-200">
            View Profile →
          </div>
        </div>
      </article>
    </Link>
  );
}
