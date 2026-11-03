import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: { "/api/case-studies/gpi/download": ["./private/case-studies/*.pdf"] },
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig

