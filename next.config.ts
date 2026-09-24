import type { NextConfig } from "next";

// GitHub Pages 项目站点会部署在 /<repo> 子路径下，由 Actions 注入。
// 使用 <user>.github.io 仓库或自定义域名时为空。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
