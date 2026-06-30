import TripRequestsComponent from "@/components/modules/trip/TripRequest";
import { getIncomingRequests } from "@/services/joinRequest/joinRequest.service";

export default async function TripRequestPage() {
  const data = await getIncomingRequests();
  return <TripRequestsComponent initialRequests={data.data} />;
}
