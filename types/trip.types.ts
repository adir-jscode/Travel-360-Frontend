import { IDestination, IItinerary, TravelType } from "@/types/travelPlan.types";

/**
 * A lightweight populated-user shape, matching the fields selected by
 * `.populate('host', 'name picture bio rating')` and
 * `.populate('members.user', 'name picture bio rating')` on the backend.
 */
export interface ITripPerson {
  _id: string;
  name: string;
  picture?: string;
  bio?: string;
  rating?: number;
}

export enum TripMemberRole {
  HOST = "HOST",
  MEMBER = "MEMBER",
}

export interface ITripMember {
  user: ITripPerson;
  role?: TripMemberRole | string;
  joinedAt?: string;
}

/**
 * Mirrors the backend `TripStatus` enum used by `PATCH /trip/:id/status`.
 * `upcoming` / `ongoing` are normally derived from the travel plan's dates,
 * but the trip document can be explicitly moved to `completed` or
 * `cancelled` by the host.
 */
export enum TripStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * A single trip photo, matching the shape pushed onto `trip.photos` by
 * `TripServices.uploadTripPhotos` on the backend.
 */
export interface ITripPhoto {
  _id?: string;
  url: string;
  publicId: string;
  uploadedBy: string | ITripPerson;
  caption?: string;
  uploadedAt: string;
}

/**
 * The travel plan fields populated on a trip, per
 * `.populate('travelPlan', 'destination startDate endDate travelType days budgetMin budgetMax itinerary')`.
 */
export interface ITripTravelPlan {
  _id: string;
  destination: IDestination;
  startDate: string;
  endDate: string;
  travelType: TravelType;
  days: number;
  budgetMin?: number;
  budgetMax?: number;
  itinerary?: IItinerary[];
}

export interface ITrip {
  _id: string;
  travelPlan: ITripTravelPlan;
  host: ITripPerson;
  members: ITripMember[];
  /** Explicit lifecycle status persisted on the trip document. */
  status?: TripStatus;
  photos?: ITripPhoto[];
  createdAt: string;
  updatedAt?: string;
}

export interface IMyTripsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ITrip[];
}
