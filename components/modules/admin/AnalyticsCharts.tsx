"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyData {
  name: string;
  total: number;
}

interface AnalyticsChartsProps {
  userGrowthData?: MonthlyData[];
  travelPlanData?: MonthlyData[];
}

// Dummy data fallback
const defaultUserGrowth = [
  { name: "Jan", total: 100 },
  { name: "Feb", total: 250 },
  { name: "Mar", total: 400 },
  { name: "Apr", total: 550 },
  { name: "May", total: 800 },
  { name: "Jun", total: 1200 },
];

const defaultPlanData = [
  { name: "Jan", total: 40 },
  { name: "Feb", total: 85 },
  { name: "Mar", total: 150 },
  { name: "Apr", total: 220 },
  { name: "May", total: 310 },
  { name: "Jun", total: 450 },
];

export function AnalyticsCharts({
  userGrowthData,
  travelPlanData,
}: AnalyticsChartsProps) {
  const users = userGrowthData || defaultUserGrowth;
  const plans = travelPlanData || defaultPlanData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* Line Chart: User Growth */}
      <div className="p-6 bg-card/50 backdrop-blur-md border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <span className="w-2 h-6 bg-primary rounded-full mr-3"></span>
          User Growth Overview
        </h3>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={users}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted-foreground) / 0.2)"
              />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="total"
                name="New Users"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: "hsl(var(--background))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Travel Plans Created */}
      <div className="p-6 bg-card/50 backdrop-blur-md border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
          Travel Plans Created
        </h3>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={plans}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted-foreground) / 0.2)"
              />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="total"
                name="Travel Plans"
                fill="hsl(var(--primary) / 0.8)"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
