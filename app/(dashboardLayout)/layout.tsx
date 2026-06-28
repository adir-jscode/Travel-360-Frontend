import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return <DashboardShell role={user?.role}>{children}</DashboardShell>;
}
