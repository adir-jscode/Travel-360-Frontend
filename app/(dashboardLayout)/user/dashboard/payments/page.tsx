import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMyPayments } from "@/services/payment/payment.service";
import { PAYMENT_STATUS } from "@/types/payment.types";

import { CreditCard, Receipt } from "lucide-react";
import Link from "next/link";

const statusVariant: Record<
  PAYMENT_STATUS,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [PAYMENT_STATUS.PAID]: "default",
  [PAYMENT_STATUS.UNPAID]: "secondary",
  [PAYMENT_STATUS.CANCELLED]: "outline",
  [PAYMENT_STATUS.FAILED]: "destructive",
  [PAYMENT_STATUS.REFUNDED]: "outline",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

export default async function PaymentHistoryPage() {
  const payments = await getMyPayments();

  const totalPaid = payments
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Details</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View your subscription payments and billing history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{payments.length}</p>
              <p className="text-sm text-muted-foreground">
                Total transactions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-muted-foreground">Total amount paid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-xl">Billing History</CardTitle>
          <CardDescription>
            All payments made for your Travel360 subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <Receipt className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                You don&apos;t have any payments yet.
              </p>
              <Link
                href="/pricing"
                className="text-sm text-primary hover:underline underline-offset-4 font-semibold"
              >
                View subscription plans
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="font-medium px-2 py-3">Plan</th>
                    <th className="font-medium px-2 py-3">Transaction ID</th>
                    <th className="font-medium px-2 py-3">Amount</th>
                    <th className="font-medium px-2 py-3">Status</th>
                    <th className="font-medium px-2 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-2 py-3 font-medium">
                        {payment.subscription?.subscriptionPlan?.title ||
                          payment.subscription?.plan ||
                          "—"}
                      </td>
                      <td className="px-2 py-3 text-muted-foreground font-mono text-xs">
                        {payment.transactionId}
                      </td>
                      <td className="px-2 py-3 font-semibold">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-2 py-3">
                        <Badge variant={statusVariant[payment.status]}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-2 py-3 text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
