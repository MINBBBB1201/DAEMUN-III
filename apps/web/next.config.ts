import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Docker: emit a self-contained server (see apps/web/Dockerfile)
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Workspace packages are shipped as TypeScript source
  transpilePackages: ["@daemun/shared"],
  // Files uploaded through the admin API live on the API server; proxy them
  // so the public site can reference them as same-origin paths.
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` }];
  },
};

const withMDX = createMDX({
  options: {
    // string form keeps the config serializable for Turbopack
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
