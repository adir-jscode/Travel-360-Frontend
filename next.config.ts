import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "i.pravatar.cc",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "images.remotePatterns",
    ],
  },
};

export default nextConfig;
