import { Quote } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Traveler stories"
          title="Trips that turned into friendships"
          subtitle="Real journeys, real travel buddies, real memories."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.trip}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
