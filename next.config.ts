import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure rewrites to handle Hono routes
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
