import { EditProfileForm } from "@/components/modules/user/EditProfileForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserProfile } from "@/services/user/user.service";
import { Calendar, Mail, MapPin, Phone, Plane, Star } from "lucide-react";
import Image from "next/image";

export default async function UserDashboardPage() {
  const profile = await getUserProfile();
  // await fetch("http://localhost:3000/api/auth/sync-google-tokens", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   cache: "no-store",
  // });

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">
          Unable to load profile. Please try logging in again.
        </p>
      </div>
    );
  }

  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border-none shadow-xl bg-card/80 backdrop-blur-sm relative">
        <div className="h-32 md:h-48 bg-linear-to-r from-primary/80 via-blue-500/80 to-purple-600/80 absolute top-0 left-0 w-full" />

        <CardContent className="pt-24 md:pt-36 relative z-10 px-6 md:px-10 pb-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-muted shadow-lg shrink-0 group">
                {profile.picture ? (
                  <Image
                    src={profile.picture}
                    alt={profile.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center g-linear-to-br from-primary/20 to-blue-500/20 text-4xl font-bold text-primary">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center md:text-left mb-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {profile.name}
                  </h1>
                  <Badge
                    variant="default"
                    className="bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-none shadow-sm shadow-orange-500/20"
                  >
                    {profile.subscription?.plan || "FREE"}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.currentLocation && (
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {profile.currentLocation}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Joined {joinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex justify-center md:justify-end mt-4 md:mt-0 w-full md:w-auto">
              <EditProfileForm user={profile} />
            </div>
          </div>

          {profile.bio && (
            <div className="mt-8 pt-6 border-t border-border/50 max-w-3xl text-center md:text-left">
              <p className="text-foreground/80 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats and Interests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Plane className="w-5 h-5 mr-2 text-primary" />
                Visited Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.visitedCountries &&
              profile.visitedCountries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.visitedCountries.map((country) => (
                    <Badge
                      key={country}
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-500/20"
                    >
                      {country}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No countries added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Star className="w-5 h-5 mr-2 text-amber-500" />
                Travel Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.travelInterest && profile.travelInterest.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.travelInterest.map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="px-3 py-1 text-sm border-primary/30 text-primary"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No travel interests added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Community Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 py-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-4xl font-bold">
                    {profile.rating || "0.0"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>

              <div className="w-full h-px bg-border/50" />

              <div className="text-center">
                <span className="text-3xl font-bold">
                  {profile.reviews?.length || 0}
                </span>
                <p className="text-sm text-muted-foreground">
                  Reviews Received
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
