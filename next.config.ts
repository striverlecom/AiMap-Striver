import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingIncludes: {
    '/*': ['./prisma/dev.db'],
  },
};

export default nextConfig;
