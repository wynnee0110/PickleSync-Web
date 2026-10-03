import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/courts',
        destination: '/book',
        permanent: false,
      },
      {
        source: '/courts/:path*',
        destination: '/book',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
