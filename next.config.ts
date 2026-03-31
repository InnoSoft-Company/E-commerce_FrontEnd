/** @type {import('next').NextConfig} */

import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization in development to avoid localhost issues
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "midoghanam.pythonanywhere.com" },
    ],
  },
};

export default nextConfig;
