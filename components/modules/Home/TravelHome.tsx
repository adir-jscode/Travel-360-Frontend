import PublicFooter from "@/components/shared/PublicFooter";
import { ArrowRight, Compass, Mountain, Plane, Users } from "lucide-react";
import { DestinationCard } from "./DestinationCard";
import { Hero } from "./Hero";
import { HowItWorksStep } from "./HowItWorksStep";
import { TripCard } from "./TripCard";
export function TravelHome() {
  const destinations = [
    {
      title: "Bali, Indonesia",
      location: "Southeast Asia",
      imageUrl:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      price: "$1,200",
    },
    {
      title: "Reykjavik, Iceland",
      location: "Northern Europe",
      imageUrl:
        "https://images.unsplash.com/photo-1476610182048-b716b8518aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      price: "$2,400",
    },
    {
      title: "Cusco, Peru",
      location: "South America",
      imageUrl:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      price: "$1,800",
    },
    {
      title: "Kyoto, Japan",
      location: "East Asia",
      imageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      price: "$2,100",
    },
    {
      title: "Marrakech, Morocco",
      location: "North Africa",
      imageUrl:
        "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      price: "$1,500",
    },
    {
      title: "Queenstown, NZ",
      location: "Oceania",
      imageUrl:
        "https://images.unsplash.com/photo-1507699622177-48857e215655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      price: "$2,800",
    },
  ];
  const trips = [
    {
      title: "Himalayan Trekking Expedition",
      date: "Oct 15 - Oct 28",
      groupSize: "8-12",
      imageUrl:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      spotsLeft: 3,
    },
    {
      title: "Surf Camp in Portugal",
      date: "Sep 01 - Sep 07",
      groupSize: "10-15",
      imageUrl:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      spotsLeft: 5,
    },
    {
      title: "Safari Adventure in Kenya",
      date: "Nov 10 - Nov 20",
      groupSize: "6-8",
      imageUrl:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      spotsLeft: 2,
    },
    {
      title: "Northern Lights Hunt",
      date: "Dec 05 - Dec 12",
      groupSize: "8-10",
      imageUrl:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      spotsLeft: 4,
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Hero />

      {/* Featured Destinations Section */}
      <section className="py-20 px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-4xl font-black text-gray-900 md:text-5xl">
                Popular{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-pink-500">
                  Destinations
                </span>
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Discover the most sought-after spots for adventure.
              </p>
            </div>
            <button className="group flex items-center gap-2 rounded-full border-2 border-gray-900 px-6 py-3 font-bold transition-all hover:bg-gray-900 hover:text-white">
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, index) => (
              <DestinationCard key={index} {...dest} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-24 px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Start your journey in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <HowItWorksStep
              stepNumber={1}
              icon={Users}
              title="Create Profile"
              description="Build your traveler profile, share your interests, and set your travel preferences."
            />
            <HowItWorksStep
              stepNumber={2}
              icon={Compass}
              title="Find Matches"
              description="Connect with like-minded travelers or join existing group trips to your dream destinations."
            />
            <HowItWorksStep
              stepNumber={3}
              icon={Plane}
              title="Start Adventure"
              description="Pack your bags, meet your new travel buddies, and explore the world together."
            />
          </div>
        </div>
      </section>

      {/* Upcoming Trips Section */}
      <section className="bg-gray-50 py-20 px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Mountain className="h-6 w-6" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 md:text-5xl">
              Upcoming{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600">
                Trips
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trips.map((trip, index) => (
              <TripCard key={index} {...trip} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 text-5xl font-black md:text-7xl">
            Ready to Explore?
          </h2>
          <p className="mb-10 text-xl font-medium text-blue-100 md:text-2xl">
            Join thousands of travelers who have found their perfect travel
            buddies.
          </p>
          <button className="transform rounded-full bg-white px-10 py-5 text-xl font-bold text-purple-600 shadow-2xl transition-all hover:scale-105 hover:shadow-white/20">
            Join the Adventure
          </button>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
