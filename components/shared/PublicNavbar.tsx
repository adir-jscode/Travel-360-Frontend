import { auth } from "@/auth";

import { getUserInfo } from "@/services/auth/getUserInfo";
import { Menu, Plane } from "lucide-react";
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
  }

  // Credential session (JWT cookies)
  const credentialUser = await getUserInfo();

  // Determine which user to display — prefer credential login if both exist
  const displayUser = credentialUser
    ? {
        name: credentialUser.name,
        picture: credentialUser.picture ?? null,
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
    { href: "/explore", label: "Explore Travelers" },
    { href: "#", label: "Find Travel Buddy" },
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
        {displayUser ? (
          <div className="hidden md:flex items-center gap-3">
            {displayUser.picture && (
              <Image
                src={displayUser.picture}
                alt={displayUser.name}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-primary/20"
              />
            )}
            <span className="text-sm font-medium text-foreground truncate max-w-30">
              {displayUser.name}
            </span>
            <Signout />
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login" className="text-lg font-medium">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/register" className="text-lg font-medium">
              <Button>Register</Button>
            </Link>
          </div>
        )}

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
                    <div className="flex items-center gap-2">
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
                    </div>
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
