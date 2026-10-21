import { site } from "../data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between md:px-8 max-md:pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <p>
          © {new Date().getFullYear()} {site.legalName} · {site.area}
        </p>
        <p className="flex items-center gap-2">
          <a href={site.links.legal} className="inline-flex min-h-11 items-center hover:text-ink">
            Mentions légales
          </a>
          <span aria-hidden="true">·</span>
          <a href={site.links.privacy} className="inline-flex min-h-11 items-center hover:text-ink">
            Confidentialité
          </a>
        </p>
      </div>
    </footer>
  );
}
