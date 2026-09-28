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
  // 允许用局域网地址访问开发服务器（例如手机或其他电脑预览）。
  // 不加的话 Next.js 会拦截开发用的 JS，页面能显示但所有交互都不生效。只影响 pnpm dev。
  allowedDevOrigins: ["192.168.1.143"],
};

export default nextConfig;
