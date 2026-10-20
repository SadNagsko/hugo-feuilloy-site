import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/data/site";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function siteMeta(): Plugin {
  return {
    name: "site-meta",
    transformIndexHtml: (html) =>
      html.replace("%SITE_TITLE%", escapeHtml(site.seo.title)).replace("%SITE_DESCRIPTION%", escapeHtml(site.seo.description)),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
});
