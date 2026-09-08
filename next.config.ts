import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg and the Prisma client load native bindings and must stay outside the
  // bundle rather than being traced into it.
  serverExternalPackages: ["@prisma/client", "pg"],

  turbopack: {
    // Turbopack infers the root by walking up for a lockfile, which finds a
    // stray package-lock.json in the home directory and then ignores it for
    // being outside the repository. Pinning the root removes the guesswork.
    root: import.meta.dirname,
  },
};

export default nextConfig;
