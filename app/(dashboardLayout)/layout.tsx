import DashboardShell from "@/components/dashboard/DashboardShell";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { Role } from "@/types/user.types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();

  return (
    <DashboardShell role={user?.role as Role} userId={user?._id}>
      {children}
    </DashboardShell>
  );
}
