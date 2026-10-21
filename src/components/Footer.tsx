import { footerLinks } from "../data/pages";
import { site } from "../data/site";

const columnLink = "inline-flex min-h-11 items-center hover:text-ink md:min-h-9";

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-semibold text-ink">{title}</p>
      <ul className="mt-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={columnLink}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ ctaBar = false }: { ctaBar?: boolean }) {
  const bottom = ctaBar ? "max-md:pb-[calc(2rem+77px+env(safe-area-inset-bottom))]" : "max-md:pb-[calc(2rem+env(safe-area-inset-bottom))]";
  return (
    <footer className="border-t border-white/[0.07]">
      <div className={`mx-auto max-w-[1200px] px-5 pt-12 pb-8 text-[14px] text-muted md:px-8 ${bottom}`}>
        <nav aria-label="Pied de page" className="grid gap-8 sm:grid-cols-3 max-md:text-center">
          <Column title="Services" links={footerLinks.services} />
          <Column title="Ressources" links={footerLinks.resources} />
          <Column
            title="Informations"
            links={[
              { label: "Mentions légales", href: site.links.legal },
              { label: "Confidentialité", href: site.links.privacy },
            ]}
          />
        </nav>
        <p className="mt-10 flex items-center gap-2.5 border-t border-white/[0.07] pt-6 text-[13px] max-md:justify-center">
          <img src="/brand/hf-mark-on-dark.svg" alt="" width="24" height="24" className="size-6 shrink-0" />© {new Date().getFullYear()} {site.legalName} · {site.area}
        </p>
      </div>
    </footer>
  );
}
