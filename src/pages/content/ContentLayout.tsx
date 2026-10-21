import { Fragment } from "react";
import { ctaHref, ctaLabel, type Block, type ContentPage, type PageLink, type Section } from "../../data/pages";
import { statement } from "../../data/site";
import { ComparisonCards, ComparisonTable } from "../../components/Offers";
import { Check, Chevron, Dot, primaryButton, useIsMobile } from "../../components/primitives";

/** Espaces insécables de la typographie française : jamais de « : » ou de « ? » seul en début de ligne. */
export const fr = (text: string) => text.replace(/ ([:;?!»])/g, "\u202f$1").replace(/« /g, "«\u202f");

const linkClass = "text-violet-soft underline decoration-violet-soft/40 underline-offset-4 hover:text-ink hover:decoration-ink";

/** Texte avec liens internes au format [libellé](/chemin). */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return match ? (
          <a key={i} href={match[2]} className={linkClass}>
            {match[1]}
          </a>
        ) : (
          <Fragment key={i}>{fr(part)}</Fragment>
        );
      })}
    </>
  );
}

/** Le point violet termine les titres, sauf ceux qui finissent déjà par une ponctuation. */
export function Title({ text }: { text: string }) {
  return (
    <>
      {fr(text)}
      {!/[?!.]$/.test(text) && <Dot />}
    </>
  );
}

export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-[14px] text-muted">
      <ol className="flex flex-wrap items-center gap-x-1.5 max-md:justify-center">
        <li className="flex items-center gap-1.5">
          <a href="/" className="inline-flex min-h-11 items-center hover:text-ink">
            Accueil
          </a>
          <Chevron className="text-subtle" />
        </li>
        <li aria-current="page" className="text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}

export function CtaButton({ className = "" }: { className?: string }) {
  return (
    <a href={ctaHref} className={`${primaryButton} ${className}`}>
      {ctaLabel}
    </a>
  );
}

function Plans() {
  const isMobile = useIsMobile();
  return <div className="rounded-[22px] border border-white/[0.07] bg-surface px-4 pb-4 sm:px-8 max-md:px-0 max-md:pb-0 max-md:border-0 max-md:bg-transparent">{isMobile ? <ComparisonCards /> : <ComparisonTable />}</div>;
}

function Shots({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="relative mt-2 pb-10 max-md:pb-0">
      <img
        src={`/projets/${slug}-desktop.webp`}
        alt={`Page d’accueil du site ${name}`}
        width={1600}
        height={913}
        loading="lazy"
        decoding="async"
        className="w-[88%] rounded-2xl border border-white/[0.07] max-md:w-full max-md:rounded-xl"
      />
      <div className="absolute right-0 bottom-0 w-[24%] overflow-hidden rounded-[22px] border-[5px] border-[#0A0A0C] bg-[#0A0A0C] shadow-[0_24px_50px_rgba(0,0,0,0.4)] max-md:static max-md:mx-auto max-md:mt-4 max-md:w-[48%]">
        <img src={`/projets/${slug}-mobile.webp`} alt={`Version mobile du site ${name}`} width={480} height={1047} loading="lazy" decoding="async" className="block w-full rounded-[17px]" />
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item) => (
            <li key={item} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:size-[5px] before:rounded-full before:bg-violet">
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "points":
      return (
        <ul className="flex flex-col">
          {block.items.map((item) => (
            <li key={item.title} className="border-t border-white/[0.07] py-4 first:border-t-0 first:pt-0">
              <p className="text-[18px] font-semibold text-ink">{item.title}</p>
              <p className="mt-1">
                <RichText text={item.text} />
              </p>
            </li>
          ))}
        </ul>
      );
    case "steps": {
      const steps = [...statement.steps, ...block.extra];
      return (
        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((step) => (
            <li key={step.label} className="rounded-[20px] border border-white/[0.07] bg-surface p-5">
              <p className="text-[13px] font-medium text-violet-soft">{step.label}</p>
              <p className="mt-2 text-[17px] leading-[1.35] font-semibold text-ink">{step.text}</p>
            </li>
          ))}
        </ol>
      );
    }
    case "faq":
      return (
        <div className="flex flex-col">
          {block.items.map((item) => (
            <div key={item.question} className="border-t border-white/[0.07] py-5 first:border-t-0 first:pt-0">
              <h3 className="text-[18px] leading-[1.35] font-semibold text-ink">{item.question}</h3>
              <p className="mt-2">
                <RichText text={item.answer} />
              </p>
            </div>
          ))}
        </div>
      );
    case "todo":
      return <p className="rounded-[12px] border border-dashed border-violet-soft/50 px-4 py-3 text-[15px] text-violet-soft">{block.text}</p>;
    case "offer":
      return (
        <div className="rounded-[22px] border border-violet/40 bg-surface p-6 sm:p-8">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-[17px] font-semibold text-violet-soft">Offre {block.offer.name}</span>
            <span className="flex items-baseline gap-2 text-ink">
              {block.offer.from && <span className="text-[16px] text-muted">dès</span>}
              <span className="text-[36px] leading-none font-bold tracking-[-0.04em]">{block.offer.price}</span>
            </span>
          </p>
          <ul className="mt-5">
            {block.offer.points.map((point) => (
              <li key={point} className="flex items-start gap-3 border-t border-white/[0.07] py-3 text-[16px] text-ink">
                <Check className="mt-1 shrink-0 text-violet-soft" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      );
    case "plans":
      return <Plans />;
    case "shots":
      return <Shots slug={block.slug} name={block.name} />;
  }
}

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-16">
      {sections.map((section) => (
        <section key={section.title} className="border-t border-white/[0.07] pt-10">
          <h2 className="text-[clamp(26px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.035em] max-md:text-center max-md:text-balance">
            <Title text={section.title} />
          </h2>
          <div className="mt-6 flex flex-col gap-5 text-[17px] leading-[1.65] text-muted">
            {section.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Related({ links }: { links: PageLink[] }) {
  return (
    <section aria-labelledby="voir-aussi" className="mt-16 md:mt-20">
      <h2 id="voir-aussi" className="text-[22px] font-bold tracking-[-0.03em] max-md:text-center">
        Voir aussi
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="flex h-full flex-col rounded-[20px] border border-white/[0.07] bg-surface p-5 transition-colors hover:border-violet/40">
              <span className="flex items-center gap-1.5 text-[17px] font-semibold text-ink">
                {link.label}
                <Chevron className="text-violet-soft" />
              </span>
              <span className="mt-1.5 text-[15px] leading-[1.5] text-muted">{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FinalCta({ title, text }: { title: string; text: string }) {
  return (
    <section className="mt-16 rounded-[28px] border border-white/[0.07] bg-surface px-6 py-10 text-center sm:px-10 md:mt-20 md:py-14">
      <h2 className="text-[clamp(28px,3.4vw,40px)] leading-[1.05] font-bold tracking-[-0.04em] text-balance">
        <Title text={title} />
      </h2>
      <p className="mx-auto mt-4 max-w-[480px] text-[17px] leading-[1.5] text-muted text-balance">{fr(text)}</p>
      <CtaButton className="mt-8 max-md:w-full" />
    </section>
  );
}

type LayoutProps = {
  page: ContentPage;
  /** Sous le titre : date d'un article, lien vers le site d'une étude de cas, bouton d'action… */
  meta?: React.ReactNode;
  children?: React.ReactNode;
};

export function ContentLayout({ page, meta, children }: LayoutProps) {
  return (
    <article className="mx-auto max-w-[820px] px-5 pt-8 pb-24 md:px-8 md:pt-12 md:pb-[160px]">
      <Breadcrumb current={page.breadcrumb} />
      <header className="mt-8 max-md:text-center md:mt-12">
        <h1 className="text-[clamp(40px,5.6vw,72px)] leading-[0.98] font-bold tracking-[-0.05em] text-balance">
          <Title text={page.h1} />
        </h1>
        <p className="mt-6 text-[19px] leading-[1.5] text-muted sm:text-[21px] max-md:text-[17px] max-md:text-balance">{fr(page.intro)}</p>
        {meta}
      </header>
      {children}
      <Sections sections={page.sections} />
      <Related links={page.related} />
      <FinalCta title={page.cta.title} text={page.cta.text} />
    </article>
  );
}
