export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum SUBSCRIPTION_PLAN {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum SUBSCRIPTION_STATUS {
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface ISubscriptionPlanSummary {
  _id: string;
  name: string;
  title: string;
  price: number;
  duration: string;
}

export interface ISubscriptionSummary {
  _id: string;
  plan?: SUBSCRIPTION_PLAN;
  status: SUBSCRIPTION_STATUS;
  paidAt?: string;
  expiresAt?: string;
  subscriptionPlan?: ISubscriptionPlanSummary;
}

export interface IPayment {
  _id: string;
  user: string;
  subscription: ISubscriptionSummary;
  transactionId: string;
  amount: number;
  status: PAYMENT_STATUS;
  invoiceUrl?: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}
