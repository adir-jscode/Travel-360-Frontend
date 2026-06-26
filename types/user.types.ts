export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum SUBSCRIPTION_PLAN {
  EXPLORER = "EXPLORER",
  WANDERER = "WANDERER",
  VOYAGER = "VOYAGER",
}

export interface IUserSubscription {
  plan?: SUBSCRIPTION_PLAN;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface IReview {
  user: string;
  description: string;
  createdAt: Date;
}

export interface IUserRating {
  user: string;
  value: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  picture?: string;
  bio?: string;
  travelInterest?: string[];
  visitedCountries?: string[];
  currentLocation?: string;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  subscription: IUserSubscription;
  ratings?: IUserRating[];
  rating?: number;
  reviews?: IReview[];
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}
