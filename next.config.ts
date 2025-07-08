import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/api/install",
      },
    ];
  },
};

export default nextConfig;
