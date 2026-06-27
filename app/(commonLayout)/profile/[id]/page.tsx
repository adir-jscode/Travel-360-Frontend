import { getUserProfile } from "@/services/user/user.service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Plane, Star, Calendar, Quote, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getUserProfile(id);

  if (!profile) {
    return notFound();
  }

  const joinDate = profile.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5 -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
        
        <div className="container mx-auto px-4 relative flex flex-col items-center text-center">
          <div className="relative h-40 w-40 rounded-full border-4 border-background overflow-hidden bg-muted shadow-2xl mb-6 ring-4 ring-primary/20">
            {profile.picture ? (
              <Image 
                src={profile.picture} 
                alt={profile.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-500/20 text-5xl font-bold text-primary">
                {profile.name.charAt(0)}
              </div>
            )}
            
            {profile.isVerified && (
              <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 border-2 border-background">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
            {profile.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground mb-6">
            {profile.currentLocation && (
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5" />
                {profile.currentLocation}
              </span>
            )}
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              Joined {joinDate}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <Badge variant="default" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-none shadow-sm px-4 py-1 text-sm">
              {profile.subscription?.plan || "EXPLORER"}
            </Badge>
            <Badge variant="secondary" className="px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20">
              <Star className="w-3.5 h-3.5 mr-1 inline-block -mt-0.5 fill-primary" />
              {profile.rating ? profile.rating.toFixed(1) : "New"} Rating
            </Badge>
          </div>
          
          {profile.bio && (
            <div className="max-w-2xl mx-auto relative">
              <Quote className="absolute -top-4 -left-6 w-8 h-8 text-primary/20 -z-10 transform -scale-x-100" />
              <p className="text-lg text-foreground/80 leading-relaxed italic">
                {profile.bio}
              </p>
              <Quote className="absolute -bottom-4 -right-6 w-8 h-8 text-primary/20 -z-10" />
            </div>
          )}
        </div>
      </section>

      {/* Profile Details Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Info (Travel Interests & Visited Countries) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl bg-card/80 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Plane className="w-6 h-6 mr-3 text-primary" />
                  Travel Passport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Places Visited
                  </h3>
                  {profile.visitedCountries && profile.visitedCountries.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.visitedCountries.map((country) => (
                        <Badge key={country} variant="secondary" className="px-4 py-1.5 text-sm bg-blue-500/10 text-blue-600 border border-blue-500/20">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">Hasn't added any visited countries yet.</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Interests
                  </h3>
                  {profile.travelInterest && profile.travelInterest.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.travelInterest.map((interest) => (
                        <Badge key={interest} variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">Hasn't added any travel interests yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info (Reviews / Ratings) */}
          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Community Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{profile.rating || "0.0"}</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Recent Reviews</h3>
                  {profile.reviews && profile.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {profile.reviews.slice(0, 3).map((review, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-background border text-sm">
                          <p className="text-foreground/90 italic">"{review.description}"</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No reviews yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
