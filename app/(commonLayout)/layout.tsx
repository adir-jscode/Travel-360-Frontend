import PublicNavbar from "@/components/shared/PublicNavbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PublicNavbar />
      {children}
    </div>
  );
}
