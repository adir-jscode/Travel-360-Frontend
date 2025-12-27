import { ChevronDown, Compass } from "lucide-react";
import Image from "next/image";
export function Hero() {
  return (
    <div className="relative h-screen min-h-150 w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
          alt="Adventure Travel"
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-600/80 via-pink-600/70 to-purple-900/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <div className="mb-6 inline-flex animate-bounce items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md border border-white/20">
          <Compass className="h-4 w-4 text-yellow-400" />
          <span className="uppercase tracking-widest text-yellow-400">
            Explore the Unknown
          </span>
        </div>

        <h1 className="mb-6 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl drop-shadow-lg">
          Find Your Next <br />
          <span className="bg-linear-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Adventure
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg font-medium text-gray-100 md:text-2xl drop-shadow-md">
          Connect with fellow travelers, discover hidden gems, and explore the
          world together. Your journey begins here.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-orange-600 shadow-xl transition-transform hover:scale-105">
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute inset-0 z-0 bg-gray-100 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <button className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
            Watch Video
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse text-white/70">
        <ChevronDown className="h-10 w-10" />
      </div>
    </div>
  );
}
