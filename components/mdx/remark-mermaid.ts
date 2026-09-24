// 把 ```mermaid 代码块换成 <Mermaid chart="..." />，交给客户端渲染。
// 需要在代码高亮（rehype-pretty-code）之前运行，否则会被当成普通代码高亮掉。
type Node = { type: string; lang?: string | null; value?: string; children?: Node[] };

export default function remarkMermaid() {
  return (tree: Node) => {
    (function visit(node: Node) {
      node.children?.forEach((child, i) => {
        if (child.type === "code" && child.lang === "mermaid") {
          node.children![i] = {
            type: "mdxJsxFlowElement",
            name: "Mermaid",
            attributes: [{ type: "mdxJsxAttribute", name: "chart", value: child.value ?? "" }],
            children: [],
          } as unknown as Node;
        } else {
          visit(child);
        }
      });
    })(tree);
  };
}
