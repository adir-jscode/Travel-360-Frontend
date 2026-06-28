import { getUserInfo } from "@/services/auth/getUserInfo";

import { getSubscriptionPlans } from "@/services/subscription/subscription.service";
import PricingClient from "./PricingClient";

export const metadata = {
  title: "Pricing — Travel 360",
  description: "Choose your adventure tier and unlock the world.",
};

export default async function PricingPage() {
  const [plans, user] = await Promise.all([
    getSubscriptionPlans(),
    getUserInfo(),
  ]);

  return <PricingClient plans={plans} user={user} />;
}
