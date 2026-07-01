import { SectionHeader } from "@/components/shared/SectionHeader";
import { travelers } from "@/lib/mock-data";
import { Shield, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TopTravelers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Meet the community"
        title="Top-rated travelers"
        subtitle="Verified explorers your matches will love."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {travelers.slice(0, 6).map((t) => (
          <Link
            key={t.id}
            href={`/profile/${t.id}`}
            className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="flex items-start gap-4">
              <Image
                src={t.picture}
                alt={t.name}
                width={200}
                height={200}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-bold">{t.name}</h3>
                  {t.isVerified && <Shield className="h-4 w-4 text-primary" />}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {t.location}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {t.rating}{" "}
                  <span className="text-muted-foreground">
                    ({t.reviewCount})
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
              {t.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t.interests.slice(0, 3).map((i) => (
                <span
                  key={i}
                  className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium"
                >
                  {i}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
