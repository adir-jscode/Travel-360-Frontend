import { TravelerSearch } from "@/components/modules/user/TravelerSearch";
import { Badge } from "@/components/ui/badge";
import { getAllUsers } from "@/services/user/user.service";
import { IUser } from "@/types/user.types";
import { Globe, Sparkles, Users } from "lucide-react";
import Image from "next/image";

export default async function ExplorePage() {
  const result = await getAllUsers(
    "limit=12&page=1&sortBy=createdAt&sortOrder=desc",
  );
  const users: IUser[] = result?.data?.data ?? [];
  const meta = result?.data?.meta ?? {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
            alt="Travelers around the world"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/45 to-background" />
          <div className="absolute inset-0 bg-linear-to-r from-ocean/25 via-transparent to-jungle/20 mix-blend-color" />
        </div>

        {/* Ambient blurs */}
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-64 rounded-full bg-ocean/10 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-40">
          <div className="flex justify-center mb-6">
            <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Travel Community
            </Badge>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Find your
              <br />
              <span className="text-gradient-sunset">travel tribe</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Search by name, destination, or shared interests. Connect with
              verified travelers who match your adventure style.
            </p>

            {/* Stats strip */}
            <div className="mt-10 flex items-center justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>
                  <strong className="text-white font-semibold">
                    {meta.total}+
                  </strong>{" "}
                  travelers
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-ocean/80" />
                <span>From every corner of the world</span>
              </div>
              <div className="w-px h-4 bg-white/20 hidden md:block" />
              <div className="items-center gap-2 hidden md:flex">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Filter by interests & destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search + Grid ────────────────────────────────────── */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <TravelerSearch initialUsers={users} initialMeta={meta} />
      </section>
    </main>
  );
}
