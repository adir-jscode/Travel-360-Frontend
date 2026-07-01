"use client";

import { NotificationBell } from "@/components/modules/notification/NotificationBell";
import { NotificationsPanel } from "@/components/modules/notification/NotificationsPanel";
import Signout from "@/components/shared/Signout";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/user.types";
import { Compass, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarConfig } from "./sidebar-config";

interface DashboardShellProps {
  children: React.ReactNode;
  role: Role;
  userId?: string;
}

export default function DashboardShell({
  children,
  role,
  userId,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const sidebarLinks = sidebarConfig[role] ?? [];
  const isUserRole = role === "USER";

  return (
    <div className="flex min-h-screen bg-muted/20">
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <Compass className="h-6 w-6 text-primary" />
              <span>
                Travel<span className="text-primary">360</span>
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            {sidebarLinks.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Signout />
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-8 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-bold tracking-tight lg:hidden">
            Travel<span className="text-primary">360</span>
          </div>
          <div className="flex-1" />
          {isUserRole && (
            <NotificationBell
              onOpenPanel={() => setIsPanelOpen(true)}
              userId={userId}
            />
          )}
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {isUserRole && (
        <NotificationsPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
}
