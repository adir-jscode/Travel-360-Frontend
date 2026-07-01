import { MapPin, Star } from "lucide-react";
import Image from "next/image";
interface DestinationCardProps {
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  price: string;
}
export function DestinationCard({
  title,
  location,
  imageUrl,
  rating,
  price,
}: DestinationCardProps) {
  return (
    <div className="group relative h-96 w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-glow" />
          <span className="text-sm font-medium uppercase tracking-wider text-primary-glow">
            {location}
          </span>
        </div>
        <h3 className="mb-2 text-3xl font-extrabold leading-tight">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{rating}</span>
          </div>
          <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur-sm">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
