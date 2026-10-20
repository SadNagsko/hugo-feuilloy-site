import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { applyPageMeta } from "./page-meta.ts";

type ServerEntry = typeof import("../src/entry-server");

const root = join(import.meta.dirname, "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const { render, routes, site } = (await import(join(ssrDir, "entry-server.js"))) as ServerEntry;
const template = readFileSync(join(dist, "index.html"), "utf8");
const pageUrl = (path: string) => `${site.url}${path === "/" ? "/" : path}`;

for (const route of routes) {
  const html = applyPageMeta(template, { title: route.title, description: route.description, url: pageUrl(route.path) }).replace(
    '<div id="root"></div>',
    `<div id="root">${render(route.path)}</div>`,
  );
  const files = route.path === "/" ? [join(dist, "index.html")] : [join(dist, `${route.path.slice(1)}.html`), join(dist, route.path.slice(1), "index.html")];
  for (const file of files) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }
  console.log(`prerendered ${route.path}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${pageUrl(route.path)}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
rmSync(ssrDir, { recursive: true, force: true });
