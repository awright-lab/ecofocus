import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ For static export
  images: {
    unoptimized: true, // ✅ Required for Netlify static export
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevent ESLint from breaking builds on Netlify
  },
  typescript: {
    // ✅ Optional: uncomment if type errors are blocking your build
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;

