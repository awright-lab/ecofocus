import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // ✅ Enables static export
  images: {
    unoptimized: true, // ✅ Required for Netlify or static hosting
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip lint errors on Netlify
  },
};

export default nextConfig;

