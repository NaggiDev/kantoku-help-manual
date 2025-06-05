import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  // Enable output file tracing to reduce bundle size
  outputFileTracingRoot: process.cwd(),

  // Configure image optimization for Docker
  images: {
    unoptimized: true, // Disable image optimization for simpler Docker builds
  },
};

export default nextConfig;
