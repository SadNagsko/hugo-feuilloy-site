export type PageMeta = { title: string; description: string; url: string };

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function applyPageMeta(html: string, meta: PageMeta) {
  return html
    .replaceAll("%PAGE_TITLE%", escapeHtml(meta.title))
    .replaceAll("%PAGE_DESCRIPTION%", escapeHtml(meta.description))
    .replaceAll("%PAGE_URL%", escapeHtml(meta.url));
}
