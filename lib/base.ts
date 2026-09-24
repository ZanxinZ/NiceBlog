// GitHub Pages 项目站点部署在 /<repo> 下。next/link 会自动加前缀，
// 但 <img src>、模型文件、fetch 等裸路径不会，统一用 withBase 处理。
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? basePath + path : path;
}
