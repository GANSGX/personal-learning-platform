import path from "node:path";

export function getContentRoot(): string {
  return path.join(process.cwd(), "../../content");
}
