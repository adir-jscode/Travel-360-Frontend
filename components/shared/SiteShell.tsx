import type { ReactNode } from "react";
import PublicFooter from "./PublicFooter";
import PublicNavbar from "./PublicNavbar";

export function SiteShell({
  children,
  hideFooter = true,
}: {
  children: ReactNode;
  hideFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  );
}
