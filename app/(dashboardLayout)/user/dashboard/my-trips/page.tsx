import MyTripsComponent from "@/components/modules/trip/MyTrips";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getMyTrips } from "@/services/trip/trip.service";

export default async function MyTripsPage() {
  const [result, currentUser] = await Promise.all([
    getMyTrips().catch(() => ({
      success: false as const,
      statusCode: 500,
      message: "Failed to load trips",
      data: [],
    })),
    getCurrentUser().catch(() => null),
  ]);

  const trips = result.success ? result.data : [];

  return (
    <MyTripsComponent
      initialTrips={trips}
      currentUserId={currentUser?.userId as string | undefined}
    />
  );
}
