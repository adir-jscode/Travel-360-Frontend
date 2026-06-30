import ResetPasswordForm from "@/components/reset-password-form";
import { Compass, KeyRound, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ResetPasswordPageProps {
  searchParams: Promise<{ id?: string; token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { id, token } = await searchParams;

  return (
    <main className="min-h-screen flex">
      {/* Left Column - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <Image
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80"
          alt="Beautiful travel destination"
          fill
          className="object-cover opacity-60 transition-opacity duration-1000 hover:opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <Compass className="h-8 w-8 text-primary" />
            <span>
              Travel<span className="text-primary">360</span>
            </span>
          </Link>

          <div className="max-w-md">
            <Quote className="h-8 w-8 text-primary/80 mb-4 transform -scale-x-100" />
            <h2 className="text-3xl font-light text-white mb-4 leading-snug">
              A fresh start, one new password away.
            </h2>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 xl:p-24 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <Link
              href="/"
              className="inline-flex lg:hidden items-center gap-2 font-bold text-2xl tracking-tight mb-6"
            >
              <Compass className="h-8 w-8 text-primary" />
              <span>
                Travel<span className="text-primary">360</span>
              </span>
            </Link>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-2">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Set a new password
            </h1>
            <p className="text-muted-foreground text-sm">
              Choose a strong password you haven&apos;t used before.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-blue-500/10 blur-xl rounded-full opacity-50" />
            <div className="relative bg-card/50 backdrop-blur-sm border shadow-xl rounded-2xl p-6 md:p-8">
              <ResetPasswordForm id={id ?? ""} token={token ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
