import MyTripsComponent from "@/components/modules/trip/MyTrips";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getMyTrips } from "@/services/trip/trip.service";

export default async function MyTripsPage() {
  const [result, currentUser] = await Promise.all([
    getMyTrips(),
    getCurrentUser(),
  ]);

  const trips = result.success ? result.data : [];

  return (
    <MyTripsComponent
      initialTrips={trips}
      currentUserId={currentUser?.userId as string | undefined}
    />
  );
}
