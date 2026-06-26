export enum TravelType {
  SOLO = "SOLO",
  FAMILY = "FAMILY",
  FRIENDS = "FRIENDS",
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface IDestination {
  country: string;
  city?: string;
}

export interface IItinerary {
  day: number;
  title: string;
  activities: string[];
}

export interface ITravelPlan {
  _id: string;
  user: string | { _id: string; name: string; picture?: string; email: string };
  destination: IDestination;
  days: number;
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  travelType: TravelType;
  itinerary?: IItinerary[];
  visibility: Visibility;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTravelPlan {
  destination: IDestination;
  days: number;
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  travelType: TravelType;
  itinerary?: IItinerary[];
  visibility?: Visibility;
}

export interface ICreateAiTravelPlan {
  destination: IDestination;
  days: number;
  startDate: string;
  endDate: string;
  travelType: TravelType;
  visibility?: Visibility;
}
