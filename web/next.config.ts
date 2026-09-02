import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    // string form keeps the config serializable for Turbopack
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
