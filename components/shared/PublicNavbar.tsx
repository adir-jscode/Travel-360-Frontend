import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserInfo } from "@/services/auth/getUserInfo";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  Plane,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import Signout from "./Signout";

const PublicNavbar = async () => {
  // Google session (NextAuth)
  const session = await auth();

  // If the user just logged in via Google, sync their tokens into cookies
  // so the rest of the app (serverFetch, middleware) can use them.
  if (session?.accessToken) {
    //await syncGoogleTokensToCookies();
    await fetch("http://localhost:3000/api/auth/sync-google-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
  }

  // Credential session (JWT cookies)
  const credentialUser = await getUserInfo();

  // Determine which user to display — prefer credential login if both exist
  const displayUser = credentialUser
    ? {
        name: credentialUser.name,
        picture: credentialUser.picture ?? null,
        role: credentialUser.role,
        isLoggedIn: true,
      }
    : session?.user
      ? {
          name: session.user.name ?? "User",
          picture: session.user.image ?? null,
          isLoggedIn: true,
        }
      : null;

  const navItems = [
    { href: "/explore", label: "Find Travel Buddy" },
    { href: "/travel-plans", label: "Search Travel Plans" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold text-primary">Travel360</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Area */}
        <div className="hidden md:flex items-center gap-3">
          {displayUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-10 items-center gap-2 rounded-full px-2"
                >
                  {displayUser.picture ? (
                    <Image
                      src={displayUser.picture}
                      alt={displayUser.name}
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                      {displayUser.name.charAt(0)}
                    </div>
                  )}

                  <span className="max-w-30 truncate font-medium">
                    {displayUser.name}
                  </span>

                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                <div className="px-3 py-2">
                  <p className="font-semibold">{displayUser.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {displayUser.role}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href={
                      displayUser.role === "ADMIN" ||
                      displayUser.role === "SUPER_ADMIN"
                        ? "/admin/dashboard"
                        : "/user/dashboard"
                    }
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard/my-profile">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/change-password">
                    <Settings className="mr-2 h-4 w-4" />
                    Change Password
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="p-2">
                  <Signout />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>

              <Link href="/register">
                <Button size="sm" variant="outline">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100 p-4">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                ))}

                {displayUser ? (
                  <div className="border-t pt-4 flex flex-col gap-3">
                    <Link
                      href={
                        displayUser.role === "USER"
                          ? "/user/dashboard"
                          : "/admin/dashboard"
                      }
                      className="flex items-center gap-2"
                    >
                      {displayUser.picture && (
                        <Image
                          src={displayUser.picture}
                          alt={displayUser.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}

                      <p className="font-medium text-sm">{displayUser.name}</p>
                    </Link>

                    <Signout />
                  </div>
                ) : (
                  <div className="border-t pt-4 flex flex-col space-y-4">
                    <Link href="/login" className="text-lg font-medium">
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link href="/register" className="text-lg font-medium">
                      <Button variant="outline" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
