// 文章分类：键是 content/blog/ 下的目录名，也是网址里的一段；值是显示名。
// 单独放一个文件，不依赖 node:fs，客户端组件也能引用。
export const categories = {
  engineering: "技术",
  product: "产品",
  life: "生活",
} as const;

export type Category = keyof typeof categories;
