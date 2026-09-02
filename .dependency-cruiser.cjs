/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "domain-no-ui",
      comment: "Domain must not import UI or apps.",
      severity: "error",
      from: { path: "^packages/domain" },
      to: { path: "^(apps|packages/ui)" },
    },
    {
      name: "domain-no-react",
      comment: "Domain must not depend on React or Next.js.",
      severity: "error",
      from: { path: "^packages/domain" },
      to: { path: "node_modules/(react|react-dom|next)/" },
    },
    {
      name: "graph-no-ui",
      comment: "Graph algorithms must not import UI or apps.",
      severity: "error",
      from: { path: "^packages/graph" },
      to: { path: "^(apps|packages/ui)" },
    },
    {
      name: "graph-no-react",
      comment: "Graph algorithms must not depend on React or Next.js.",
      severity: "error",
      from: { path: "^packages/graph" },
      to: { path: "node_modules/(react|react-dom|next)/" },
    },
    {
      name: "content-no-react",
      comment: "Content parsers must not depend on React or Next.js.",
      severity: "error",
      from: { path: "^packages/content" },
      to: { path: "node_modules/(react|react-dom|next)/" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "warn",
      from: {
        orphan: true,
        pathNot: [
          "\\.d\\.ts$",
          "\\.(config|conf)\\.(js|ts|mjs|cjs)$",
          "\\.(test|spec)\\.[jt]sx?$",
          "^packages/eslint-config/",
          "^apps/web/src/lib/utils\\.ts$",
          "^apps/web/scripts/",
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: "node_modules|\\.next|coverage" },
    exclude: { path: "node_modules|\\.next|coverage" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      mainFields: ["module", "main"],
    },
  },
};
