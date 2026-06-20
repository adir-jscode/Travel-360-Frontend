"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MapPin, Search, Shield, Star, Users } from "lucide-react";

import { allInterests, travelers } from "../../../lib/mock-data";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ExplorePage() {
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("top");

  const filtered = useMemo(() => {
    let results = travelers.filter((traveler) => {
      if (verifiedOnly && !traveler.isVerified) return false;

      if (interest !== "all" && !traveler.interests.includes(interest)) {
        return false;
      }

      if (q) {
        const search = q.toLowerCase();

        return (
          traveler.name.toLowerCase().includes(search) ||
          traveler.location.toLowerCase().includes(search) ||
          traveler.bio.toLowerCase().includes(search)
        );
      }

      return true;
    });

    if (sort === "top") {
      results = [...results].sort((a, b) => b.rating - a.rating);
    }

    if (sort === "reviews") {
      results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return results;
  }, [q, interest, verifiedOnly, sort]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />

        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
          alt="Travelers"
          width={500}
          height={500}
          className="h-105 w-full object-cover"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-white">
              <Badge className="mb-4">
                <Users className="mr-2 h-3 w-3" />
                Travel Community
              </Badge>

              <h1 className="text-4xl font-bold md:text-6xl">
                Explore Travelers
              </h1>

              <p className="mt-4 text-lg text-white/90">
                Find compatible travel companions based on destination,
                interests, ratings and travel style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="container mx-auto -mt-12 px-4 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-5">
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search travelers, cities or interests..."
                  className="pl-9"
                />
              </div>

              {/* Interest */}
              <Select value={interest} onValueChange={setInterest}>
                <SelectTrigger>
                  <SelectValue placeholder="Interest" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Any Interest</SelectItem>

                  {allInterests.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="top">Top Rated</SelectItem>

                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                </SelectContent>
              </Select>

              {/* Verified */}
              <div className="flex items-center gap-3 rounded-lg border px-4">
                <Switch
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />

                <span className="text-sm font-medium whitespace-nowrap">
                  Verified Only
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Travelers</h2>

            <p className="text-muted-foreground">
              {filtered.length} traveler
              {filtered.length !== 1 && "s"} found
            </p>
          </div>

          <Badge variant="secondary">{filtered.length} Results</Badge>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 text-xl font-semibold">No travelers found</h3>

              <p className="mt-2 text-muted-foreground">
                Try adjusting your search filters.
              </p>

              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setQ("");
                  setInterest("all");
                  setVerifiedOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((traveler) => (
              <Link
                key={traveler.id}
                href="/profile/$id"
                // params={{ id: traveler.id }}
              >
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={traveler.picture} />

                        <AvatarFallback>
                          {traveler.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{traveler.name}</h3>

                          {traveler.isVerified && (
                            <Badge variant="secondary" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}

                          {traveler.isPremium && <Badge>Pro</Badge>}
                        </div>

                        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {traveler.location}
                        </div>

                        <div className="mt-2 flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {traveler.rating}

                          <span className="text-muted-foreground">
                            ({traveler.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-2 text-sm text-muted-foreground">
                      {traveler.bio}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {traveler.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="outline" className="mt-6 w-full">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
