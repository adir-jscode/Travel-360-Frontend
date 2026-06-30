/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "@/types/user.types";
import {
  Compass,
  LayoutDashboard,
  Lock,
  Map,
  MapPinned,
  Settings,
  Shield,
  Ticket,
  User,
  Users,
} from "lucide-react";

export type SidebarItem = {
  name: string;
  href: string;
  icon: any;
  badge?: string;
};

export const sidebarConfig: Record<Role, SidebarItem[]> = {
  USER: [
    {
      name: "My Profile",
      href: "/user/dashboard/my-profile",
      icon: User,
    },
    {
      name: "My Travel Plans",
      href: "/user/travel-plans",
      icon: Map,
    },
    {
      name: "Trip Requests",
      href: "/user/dashboard/trip-requests",
      icon: Ticket,
    },
    {
      name: "Change Password",
      href: "/user/dashboard/security",
      icon: Lock,
    },
  ],

  GUIDE: [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Tours",
      href: "/user/my-tours",
      icon: MapPinned,
    },
    {
      name: "Explore",
      href: "/travel-plans",
      icon: Compass,
    },
    {
      name: "Settings",
      href: "/user/settings",
      icon: Settings,
    },
  ],

  ADMIN: [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Travel Plans",
      href: "/admin/travel-plans",
      icon: Map,
    },
    {
      name: "Change Password",
      href: "/admin/dashboard/security",
      icon: Lock,
    },
  ],

  SUPER_ADMIN: [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Admins",
      href: "/admin/admins",
      icon: Shield,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Travel Plans",
      href: "/admin/travel-plans",
      icon: Map,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],
};
