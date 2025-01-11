import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mpd2nln5nqcgsysu.public.blob.vercel-storage.com", // Hanya hostname, tanpa https://
      },
    ],
  },
};

export default nextConfig;
