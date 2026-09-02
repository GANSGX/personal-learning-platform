import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type ContentLinkIssue = {
  file: string;
  link: string;
  message: string;
};

const MARKDOWN_LINK_PATTERN = /\[(?:[^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function cleanLinkTarget(rawUrl: string): string {
  const noHash = rawUrl.split("#")[0] ?? "";
  return noHash.split("?")[0] ?? "";
}

function extractHeadingAnchors(content: string): Set<string> {
  const anchors = new Set<string>();
  const headingPattern = /^#{1,6}\s+(.+)$/gm;
  let match: RegExpExecArray | null = headingPattern.exec(content);

  while (match !== null) {
    const rawHeading = match[1]?.trim().toLowerCase() ?? "";
    const slug = rawHeading.replaceAll(/[^\w\s-]/g, "").replaceAll(/\s+/g, "-");
    anchors.add(slug);
    match = headingPattern.exec(content);
  }

  return anchors;
}

export function validateContentLinks(
  filePaths: readonly string[],
  validNodeIds: ReadonlySet<string>,
): ContentLinkIssue[] {
  const issues: ContentLinkIssue[] = [];

  for (const filePath of filePaths) {
    const content = readFileSync(filePath, "utf8");
    const headingAnchors = extractHeadingAnchors(content);

    let match: RegExpExecArray | null = MARKDOWN_LINK_PATTERN.exec(content);
    while (match !== null) {
      const url = match[1];

      if (
        url !== undefined &&
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("mailto:")
      ) {
        if (url.startsWith("#")) {
          const anchor = url.slice(1).toLowerCase();
          if (anchor.length > 0 && !headingAnchors.has(anchor)) {
            issues.push({
              file: filePath,
              link: url,
              message: `Broken internal heading anchor '${url}' in ${path.basename(filePath)}`,
            });
          }
        } else if (url.startsWith("/nodes/")) {
          const targetNodeId = cleanLinkTarget(url.slice("/nodes/".length));
          if (!validNodeIds.has(targetNodeId)) {
            issues.push({
              file: filePath,
              link: url,
              message: `Target node '${targetNodeId}' does not exist in curriculum`,
            });
          }
        } else if (url.startsWith("./") || url.startsWith("../")) {
          const targetFile = path.resolve(path.dirname(filePath), cleanLinkTarget(url));
          if (!existsSync(targetFile)) {
            issues.push({
              file: filePath,
              link: url,
              message: `Referenced relative file does not exist: '${url}'`,
            });
          }
        }
      }

      match = MARKDOWN_LINK_PATTERN.exec(content);
    }
  }

  return issues;
}
