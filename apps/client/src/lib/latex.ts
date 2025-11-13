import type { ContentNode, LatexNode, StructureNode, TextNode } from "@/types";
import katex from "katex";
export function renderKatexToHTML(src: string) {
  try {
    return katex.renderToString(src, { throwOnError: false });
  } catch {
    return src;
  }
}

export function serializePlaceholderContent(content?: (TextNode | LatexNode)[]) {
  if (!content || content.length === 0) return "";
  return content.map((node) => (node.type === "text" ? node.value : node.value)).join("");
}

export function serializeStructureNode(structure: StructureNode) {
  return structure.parts
    .map((part) =>
      part.type === "static" ? part.value : serializePlaceholderContent(part.content),
    )
    .join("");
}

export function serializeContentNodes(nodes: ContentNode[]) {
  return nodes
    .map((node) => {
      if (node.type === "text") return node.value;
      if (node.type === "latex") return node.value;
      return serializeStructureNode(node);
    })
    .join("");
}
