import { getUserInfo } from "@/services/auth/getUserInfo";

import { getSubscriptionPlans } from "@/services/subscription/subscription.service";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

interface Props {
  params: Promise<{ planId: string }>;
}

export const metadata = {
  title: "Checkout — Travel 360",
};

export default async function CheckoutPage({ params }: Props) {
  const { planId } = await params;

  // Auth guard — must be logged in to see checkout
  const user = await getUserInfo();
  if (!user) {
    redirect(`/login?redirect=/checkout/${planId}`);
  }

  const plans = await getSubscriptionPlans();
  const plan = plans.find((p) => p._id === planId);

  if (!plan) {
    redirect("/pricing");
  }

  return <CheckoutClient plan={plan} user={user} />;
}
