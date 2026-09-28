// 把每个 ## 标题和它下面的内容包成 <details open><summary><h2/></summary>…</details>，点标题即可折叠 / 展开。
// 用原生 details，不需要客户端 JS；折叠的内容仍在 HTML 里，搜索索引照常收录。
type Node = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[] };

export default function rehypeSections() {
  return (tree: Node) => {
    const out: Node[] = [];
    let section: Node | null = null;

    for (const child of tree.children ?? []) {
      if (child.type === "element" && child.tagName === "h2") {
        section = {
          type: "element",
          tagName: "details",
          properties: { open: true, dataSection: "" },
          children: [{ type: "element", tagName: "summary", properties: {}, children: [child] }],
        };
        out.push(section);
      } else if (section && child.type !== "mdxjsEsm") {
        section.children!.push(child);
      } else {
        out.push(child);
      }
    }

    tree.children = out;
  };
}
