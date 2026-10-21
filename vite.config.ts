import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { routeHead } from "./src/data/seo.ts";
import { resolveRoute, site } from "./src/data/site.ts";
import { applyPageMeta } from "./scripts/page-meta.ts";

function devPageMeta(): Plugin {
  return {
    name: "dev-page-meta",
    apply: "serve",
    transformIndexHtml: (html, context) => {
      const route = resolveRoute(new URL(context.originalUrl ?? "/", site.url).pathname);
      return applyPageMeta(html, { title: route.title, description: route.description, url: `${site.url}${route.path === "/" ? "/" : route.path}`, head: routeHead(route.path) });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devPageMeta()],
});
