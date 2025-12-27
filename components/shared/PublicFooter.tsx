import { Plane } from "lucide-react";

export default function PublicFooter() {
  return (
    <div>
      <footer className="bg-gray-900 py-12 px-4 text-gray-400">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold text-white">Travel360</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Trips
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Community
            </a>
            <a href="#" className="hover:text-white transition-colors">
              About
            </a>
          </div>
          <p className="text-sm">© 2025 Travel360. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
