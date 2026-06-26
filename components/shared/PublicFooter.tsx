import { Compass, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
export default function PublicFooter() {
  return (
    <div>
      <footer className="mt-24 border-t border-border bg-secondary/40">
        <div className="mx-auhref grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-sunset text-white">
                <Compass className="h-5 w-5" />
              </span>
              <span className="text-lg font-black">
                Travel<span className="text-primary">360</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Find compatible travel buddies for your next adventure. Solo
              journeys, shared shrefries.
            </p>
            <div className="mt-4 flex gap-2">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            {
              title: "Explore",
              links: [
                ["Destinations", "/explore"],
                ["Travel Plans", "/travel-plans"],
                ["Pricing", "/pricing"],
              ],
            },
            {
              title: "Company",
              links: [
                ["About", "/"],
                ["Careers", "/"],
                ["Press", "/"],
              ],
            },
            {
              title: "Support",
              links: [
                ["Help Center", "/"],
                ["Safety", "/"],
                ["Contact", "/"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
