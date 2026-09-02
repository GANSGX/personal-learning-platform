import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOTS = [
  "packages/domain/src",
  "packages/graph/src",
  "packages/content/src",
  "packages/visualizations/src",
  "apps/web/src/lib",
];

// Files that are tested elsewhere or are server/runtime-only bindings
const EXCLUDED_PATTERNS = [
  /index\.tsx?$/,
  /\.d\.ts$/,
  /\.test\.tsx?$/,
  /\.spec\.tsx?$/,
  /constants\.ts$/,
  /registry-ids\.ts$/, // Covered in registry.test.ts
  /packet-journey\.tsx$/, // Covered in registry.test.ts
  /load-knowledge-map\.ts$/, // Server-side filesystem loader
  /supabase\/(client|server|middleware)\.ts$/, // Supabase SDK runtime wrappers
  /.*-context\.tsx$/, // React Contexts, verified via component integration tests
  /local-progress-repository\.ts$/, // IndexedDB browser-only storage wrapper
  /translate\.ts$/, // Covered in messages.test.ts
];

function walk(currentDir: string, onFile: (relativePath: string, fullPath: string) => void): void {
  const entries = readdirSync(currentDir);

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry);
    const relativePath = path.relative(process.cwd(), fullPath);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath, onFile);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      onFile(relativePath, fullPath);
    }
  }
}

const missingTests: string[] = [];
let checkedCount = 0;

for (const root of ROOTS) {
  const absoluteRoot = path.resolve(process.cwd(), root);
  if (!existsSync(absoluteRoot)) {
    continue;
  }

  walk(absoluteRoot, (relativePath, fullPath) => {
    const isExcluded = EXCLUDED_PATTERNS.some((pattern) => pattern.test(relativePath));
    if (isExcluded) {
      return;
    }

    checkedCount += 1;
    const testFileTs = fullPath.replace(/\.tsx?$/, ".test.ts");
    const testFileTsx = fullPath.replace(/\.tsx?$/, ".test.tsx");
    const hasTest = existsSync(testFileTs) || existsSync(testFileTsx);

    if (!hasTest) {
      missingTests.push(relativePath);
    }
  });
}

if (missingTests.length > 0) {
  console.error("❌ The following logic files are missing unit test files:");
  for (const file of missingTests) {
    console.error(`   - ${file} (expected ${file.replace(/\.tsx?$/, ".test.ts")})`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `✅ Test-per-File Gate: All ${String(checkedCount)} tracked logic files have corresponding unit test files!`,
  );
}
