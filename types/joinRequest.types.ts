export enum JoinRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IJoinRequest {
  _id: string;
  travelPlan: {
    _id: string;
    destination: {
      city?: string;
      country: string;
    };
    startDate: string;
    endDate: string;
    days: number;
    travelType: string;
  };
  requester: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    currentLocation?: string;
    travelInterest?: string[];
    rating?: number;
  };
  planOwner: string;
  status: JoinRequestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  _id: string;
  joinRequest: IJoinRequest;
  type: "JOIN_REQUEST";
  isRead: boolean;
  createdAt: string;
}
