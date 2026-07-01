import { Calendar, Users } from "lucide-react";
import Image from "next/image";
interface TripCardProps {
  title: string;
  date: string;
  groupSize: string;
  imageUrl: string;
  spotsLeft: number;
}
export function TripCard({
  title,
  date,
  groupSize,
  imageUrl,
  spotsLeft,
}: TripCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
          {spotsLeft} spots left
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 text-xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>

        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-medium">{groupSize} travelers</span>
          </div>
        </div>

        {/* <div className="mt-auto">
          <button className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-linear-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div> */}
      </div>
    </div>
  );
}
