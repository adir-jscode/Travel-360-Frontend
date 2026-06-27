import { auth } from "@/auth";
import { Menu, Plane } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import Signout from "./Signout";

const PublicNavbar = async () => {
  const session = await auth();

  const navItems = [
    { href: "/explore", label: "Explore Travelers" },
    { href: "#", label: "Find Travel Buddy" },
    { href: "/pricing", label: "Pricing" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur  dark:bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold text-primary">Travel360</span>
        </Link>

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

        {session?.user ? (
          <div className="flex gap-4">
            <p className="text-bold-500">{session?.user?.name}</p>
            <Image
              src={session?.user?.image as string}
              alt={session?.user?.name as string}
              width={32}
              height={32}
              className="rounded-full"
            />
            <Signout />
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login" className="text-lg font-medium">
              <Button variant={"secondary"}>Login</Button>
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
                {" "}
                <Menu />{" "}
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
                {session?.user ? (
                  <div>
                    <p>{session?.user?.name}</p>
                  </div>
                ) : (
                  <div className="border-t pt-4 flex flex-col space-y-4">
                    <div className="flex justify-center"></div>
                    <Link href="/login" className="text-lg font-medium">
                      <Button>Login</Button>
                    </Link>
                    <Link href="/register" className="text-lg font-medium">
                      <Button>Register</Button>
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
