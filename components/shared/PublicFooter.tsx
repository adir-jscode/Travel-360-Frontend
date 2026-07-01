import { Instagram, Plane, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "./BrandMark";

const linkColumns: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Explore",
    links: [
      { label: "Find a travel buddy", href: "/explore" },
      { label: "Browse travel plans", href: "/travel-plans" },
      { label: "Membership pricing", href: "/pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create an account", href: "/register" },
      { label: "Your dashboard", href: "/user/dashboard" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "X (Twitter)", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function PublicFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-secondary/40">
      {/* Signature: a dashed flight path stitched across the top edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px bg-[repeating-linear-gradient(90deg,var(--color-border)_0,var(--color-border)_8px,transparent_8px,transparent_16px)]"
      />
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-background text-primary shadow-soft"
      >
        <Plane className="h-3.5 w-3.5 rotate-45" />
      </span>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Brand column */}
        <div className="md:col-span-2">
          <BrandMark size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Find compatible travel buddies for your next adventure. Solo
            journeys, shared stories.
          </p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {linkColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Travel360. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made for travelers, by travelers
            <span className="text-primary">✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
