export type TravelType = "SOLO" | "FAMILY" | "FRIENDS";

export interface Traveler {
  id: string;
  name: string;
  picture: string;
  location: string;
  bio: string;
  interests: string[];
  visitedCountries: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
}

export interface TravelPlan {
  id: string;
  userId: string;
  userName: string;
  userPicture: string;
  destination: { country: string; city?: string };
  startDate: string;
  endDate: string;
  days: number;
  budgetMin: number;
  budgetMax: number;
  travelType: TravelType;
  description: string;
  itinerary: { day: number; title: string; activities: string[] }[];
  visibility: "PUBLIC" | "PRIVATE";
  interests: string[];
}

export interface Destination {
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  price: string;
  travelers: number;
}

export const destinations: Destination[] = [
  {
    title: "Bali, Indonesia",
    location: "Southeast Asia",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    price: "$1,200",
    travelers: 342,
  },
  {
    title: "Reykjavik, Iceland",
    location: "Northern Europe",
    imageUrl:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    price: "$2,400",
    travelers: 187,
  },
  {
    title: "Cusco, Peru",
    location: "South America",
    imageUrl:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    price: "$1,800",
    travelers: 156,
  },
  {
    title: "Kyoto, Japan",
    location: "East Asia",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    price: "$2,100",
    travelers: 421,
  },
  {
    title: "Marrakech, Morocco",
    location: "North Africa",
    imageUrl:
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    price: "$1,500",
    travelers: 203,
  },
  {
    title: "Queenstown, NZ",
    location: "Oceania",
    imageUrl:
      "https://images.unsplash.com/photo-1507699622177-48857e215655?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    price: "$2,800",
    travelers: 98,
  },
];

export const travelers: Traveler[] = [
  {
    id: "t1",
    name: "Amelia Chen",
    picture: "https://i.pravatar.cc/300?img=47",
    location: "Singapore",
    bio: "Photographer chasing golden hours across 32 countries.",
    interests: ["Photography", "Hiking", "Food Tours"],
    visitedCountries: ["JP", "PE", "IS", "MA", "NZ"],
    rating: 4.9,
    reviewCount: 47,
    isVerified: true,
    isPremium: true,
  },
  {
    id: "t2",
    name: "Lucas Romero",
    picture: "https://i.pravatar.cc/300?img=12",
    location: "Buenos Aires, Argentina",
    bio: "Surfer, climber, and slow-travel evangelist.",
    interests: ["Surfing", "Climbing", "Camping"],
    visitedCountries: ["BR", "CL", "PE", "MX"],
    rating: 4.8,
    reviewCount: 31,
    isVerified: true,
    isPremium: false,
  },
  {
    id: "t3",
    name: "Priya Raman",
    picture: "https://i.pravatar.cc/300?img=48",
    location: "Bengaluru, India",
    bio: "Yoga teacher exploring ashrams and mountain trails.",
    interests: ["Yoga", "Hiking", "Culture"],
    visitedCountries: ["NP", "BT", "TH", "ID"],
    rating: 4.9,
    reviewCount: 64,
    isVerified: true,
    isPremium: true,
  },
  {
    id: "t4",
    name: "Mateo Silva",
    picture: "https://i.pravatar.cc/300?img=15",
    location: "Lisbon, Portugal",
    bio: "Coffee snob and city wanderer with a film camera.",
    interests: ["Photography", "Coffee", "Architecture"],
    visitedCountries: ["FR", "ES", "IT", "MA"],
    rating: 4.7,
    reviewCount: 22,
    isVerified: false,
    isPremium: false,
  },
  {
    id: "t5",
    name: "Sora Tanaka",
    picture: "https://i.pravatar.cc/300?img=49",
    location: "Tokyo, Japan",
    bio: "Bicycle tourer, ramen hunter, mountain dreamer.",
    interests: ["Cycling", "Food", "Mountains"],
    visitedCountries: ["JP", "KR", "VN", "NZ"],
    rating: 5.0,
    reviewCount: 38,
    isVerified: true,
    isPremium: true,
  },
  {
    id: "t6",
    name: "Noah Becker",
    picture: "https://i.pravatar.cc/300?img=33",
    location: "Berlin, Germany",
    bio: "Music festivals, vinyl shops, and weekend escapes.",
    interests: ["Music", "Nightlife", "Trains"],
    visitedCountries: ["CZ", "AT", "NL", "DK"],
    rating: 4.6,
    reviewCount: 18,
    isVerified: false,
    isPremium: false,
  },
];

export const travelPlans: TravelPlan[] = [
  {
    id: "p1",
    userId: "t1",
    userName: "Amelia Chen",
    userPicture: travelers[0].picture,
    destination: { country: "Japan", city: "Kyoto" },
    startDate: "2026-10-08",
    endDate: "2026-10-18",
    days: 10,
    budgetMin: 1800,
    budgetMax: 2600,
    travelType: "FRIENDS",
    description:
      "Temple-hopping, autumn foliage, and a deep dive into Kyoto's coffee scene. Looking for 1–2 buddies who love early mornings.",
    interests: ["Photography", "Food", "Culture"],
    visibility: "PUBLIC",
    itinerary: [
      {
        day: 1,
        title: "Arrival & Gion stroll",
        activities: ["Check-in", "Sunset at Yasaka Pagoda", "Izakaya dinner"],
      },
      {
        day: 2,
        title: "Arashiyama",
        activities: ["Bamboo grove", "Tenryu-ji", "Riverside lunch"],
      },
      {
        day: 3,
        title: "Fushimi Inari",
        activities: ["Sunrise hike", "Matcha break", "Pottery class"],
      },
    ],
  },
  {
    id: "p2",
    userId: "t2",
    userName: "Lucas Romero",
    userPicture: travelers[1].picture,
    destination: { country: "Peru", city: "Cusco" },
    startDate: "2026-09-12",
    endDate: "2026-09-22",
    days: 10,
    budgetMin: 1200,
    budgetMax: 1800,
    travelType: "FRIENDS",
    description:
      "Salkantay trek to Machu Picchu, then Sacred Valley. Looking for fit travelers ready for altitude.",
    interests: ["Hiking", "Climbing", "Culture"],
    visibility: "PUBLIC",
    itinerary: [
      {
        day: 1,
        title: "Cusco acclimatize",
        activities: ["Coca tea", "San Pedro market", "Easy walk"],
      },
      {
        day: 2,
        title: "Sacred Valley",
        activities: ["Pisac ruins", "Ollantaytambo"],
      },
    ],
  },
  {
    id: "p3",
    userId: "t3",
    userName: "Priya Raman",
    userPicture: travelers[2].picture,
    destination: { country: "Indonesia", city: "Bali" },
    startDate: "2026-11-02",
    endDate: "2026-11-16",
    days: 14,
    budgetMin: 900,
    budgetMax: 1500,
    travelType: "SOLO",
    description:
      "Yoga retreat in Ubud followed by a week of surfing in Uluwatu.",
    interests: ["Yoga", "Surfing", "Wellness"],
    visibility: "PUBLIC",
    itinerary: [
      {
        day: 1,
        title: "Ubud arrival",
        activities: ["Rice terraces", "Sunset yoga"],
      },
    ],
  },
  {
    id: "p4",
    userId: "t5",
    userName: "Sora Tanaka",
    userPicture: travelers[4].picture,
    destination: { country: "New Zealand", city: "Queenstown" },
    startDate: "2026-12-05",
    endDate: "2026-12-18",
    days: 13,
    budgetMin: 2200,
    budgetMax: 3200,
    travelType: "FRIENDS",
    description:
      "South Island road trip — Milford Sound, Wanaka, and bikepacking the Otago Rail Trail.",
    interests: ["Cycling", "Mountains", "Photography"],
    visibility: "PUBLIC",
    itinerary: [
      {
        day: 1,
        title: "Queenstown",
        activities: ["Skyline gondola", "Fergburger"],
      },
    ],
  },
  {
    id: "p5",
    userId: "t6",
    userName: "Noah Becker",
    userPicture: travelers[5].picture,
    destination: { country: "Morocco", city: "Marrakech" },
    startDate: "2027-01-14",
    endDate: "2027-01-22",
    days: 8,
    budgetMin: 800,
    budgetMax: 1300,
    travelType: "SOLO",
    description:
      "Medina wandering, Atlas day-trips, and a tagine cooking class.",
    interests: ["Food", "Music", "Culture"],
    visibility: "PUBLIC",
    itinerary: [
      {
        day: 1,
        title: "Medina",
        activities: ["Jemaa el-Fnaa", "Riad check-in"],
      },
    ],
  },
];

export const testimonials = [
  {
    name: "Hana K.",
    text: "Met three lifelong friends on a Patagonia trek I never would've done alone.",
    trip: "Patagonia, 2025",
    avatar: "https://i.pravatar.cc/100?img=20",
  },
  {
    name: "Daniel O.",
    text: "The matching is uncanny — same pace, same playlists, same coffee snobbery.",
    trip: "Lisbon, 2025",
    avatar: "https://i.pravatar.cc/100?img=11",
  },
  {
    name: "Mei L.",
    text: "Solo travel without the lonely parts. Travel 360 changed how I see the world.",
    trip: "Vietnam, 2024",
    avatar: "https://i.pravatar.cc/100?img=44",
  },
];

export const allInterests = [
  "Photography",
  "Hiking",
  "Food Tours",
  "Surfing",
  "Climbing",
  "Camping",
  "Yoga",
  "Culture",
  "Coffee",
  "Architecture",
  "Cycling",
  "Mountains",
  "Music",
  "Nightlife",
  "Trains",
  "Wellness",
  "Diving",
  "Skiing",
];
