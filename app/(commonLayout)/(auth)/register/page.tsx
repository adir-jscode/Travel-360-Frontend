import SignupForm from "@/components/signup-form";
import Image from "next/image";
import Link from "next/link";
import { Compass, Quote } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-row-reverse">
      {/* Right Column - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <Image 
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
          alt="Awe inspiring mountains"
          fill
          className="object-cover opacity-60 transition-opacity duration-1000 hover:opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <div className="flex justify-end">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white hover:opacity-90 transition-opacity">
              <span>Travel<span className="text-primary">360</span></span>
              <Compass className="h-8 w-8 text-primary" />
            </Link>
          </div>
          
          <div className="max-w-md ml-auto text-right">
            <Quote className="h-8 w-8 text-primary/80 mb-4 ml-auto" />
            <h2 className="text-3xl font-light text-white mb-4 leading-snug">
              "A journey of a thousand miles begins with a single step."
            </h2>
            <p className="text-white/70 font-medium">Lao Tzu</p>
          </div>
        </div>
      </div>

      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 xl:p-24 bg-background overflow-y-auto">
        <div className="w-full max-w-sm space-y-8 my-auto py-10">
          <div className="text-center lg:text-left space-y-2">
            <Link href="/" className="inline-flex lg:hidden items-center gap-2 font-bold text-2xl tracking-tight mb-6">
              <Compass className="h-8 w-8 text-primary" />
              <span>Travel<span className="text-primary">360</span></span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Join the Adventure</h1>
            <p className="text-muted-foreground text-sm">
              Create an account to start building your itineraries
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-blue-500/10 blur-xl rounded-full opacity-50" />
            <div className="relative bg-card/50 backdrop-blur-sm border shadow-xl rounded-2xl p-6 md:p-8">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
