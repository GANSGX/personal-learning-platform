import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const repoRoot = path.join(fileURLToPath(new URL(".", import.meta.url)), "../..");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@plp/content", "@plp/domain", "@plp/graph"],
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/*": [path.join(repoRoot, "content/**/*")],
  },
  serverExternalPackages: ["elkjs"],
};

export default nextConfig;
