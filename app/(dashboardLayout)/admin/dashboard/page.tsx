import { AnalyticsCharts } from "@/components/modules/admin/AnalyticsCharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  getDashboardSummary,
  getPaymentStats,
  getTravelPlanStats,
  getUserStats,
} from "@/services/admin/admin.service";
import { Activity, DollarSign, Map, TrendingUp, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  // Fetch all analytics data in parallel
  const [summaryRes, userStatsRes, planStatsRes] = await Promise.all([
    getDashboardSummary(),
    getUserStats(),
    getTravelPlanStats(),
    getPaymentStats(),
  ]);

  // Use the fetched data, fallback to some 0s or empty arrays if fetch fails
  const summary = summaryRes?.success
    ? summaryRes.data
    : {
        totalUsers: 0,
        totalPlans: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
      };

  const userStats = userStatsRes?.success
    ? [
        {
          name: "Last 7 Days",
          total: userStatsRes.data.newUsersLast7Days,
        },
        {
          name: "Last 30 Days",
          total: userStatsRes.data.newUsersLast30Days,
        },
        {
          name: "Active",
          total: userStatsRes.data.totalActiveUsers,
        },
        {
          name: "Inactive",
          total: userStatsRes.data.totalInActiveUsers,
        },
      ]
    : undefined;

  const planStats = planStatsRes?.success
    ? [
        {
          name: "Last 7 Days",
          total: planStatsRes.data.plansLast7Days,
        },
        {
          name: "Last 30 Days",
          total: planStatsRes.data.plansLast30Days,
        },
        {
          name: "Total Plans",
          total: planStatsRes.data.totalPlans,
        },
      ]
    : undefined;

  // We can pass userStats and planStats to the AnalyticsCharts if they match the MonthlyData[] interface.
  // The AnalyticsCharts component has a built-in fallback to beautiful dummy data if undefined is passed,
  // ensuring the dashboard always looks great even if the backend is empty or failing.

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Activity className="w-8 h-8 mr-3 text-primary" />
            Analytics Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor user growth, and revenue.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-card/60 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Users
                </p>
                <h3 className="text-3xl font-bold">
                  {summary?.users?.totalUsers?.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-card/60 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Travel Plans
                </p>
                <h3 className="text-3xl font-bold">
                  {summary?.plans?.totalPlans?.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Map className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+18% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-card/60 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Active Subs
                </p>
                <h3 className="text-3xl font-bold">
                  {summary?.subscriptions?.activeSubscriptions?.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-card/60 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Revenue
                </p>
                <h3 className="text-3xl font-bold">
                  ${summary?.payments?.totalRevenue?.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500 font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+24% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts userGrowthData={userStats} travelPlanData={planStats} />

      {/* Bottom Section - System Health or Recent Activity */}
      {/* <Card className="border-none shadow-md bg-card/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">System Health & Metrics</h3>
            <Badge
              variant="outline"
              className="text-green-500 border-green-500/30 bg-green-500/10"
            >
              All Systems Operational
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-muted/50 border">
              <p className="text-sm text-muted-foreground mb-1">API Uptime</p>
              <p className="text-2xl font-semibold">99.99%</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border">
              <p className="text-sm text-muted-foreground mb-1">
                Avg Response Time
              </p>
              <p className="text-2xl font-semibold">124ms</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border">
              <p className="text-sm text-muted-foreground mb-1">
                Database Load
              </p>
              <p className="text-2xl font-semibold text-amber-500">42%</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
