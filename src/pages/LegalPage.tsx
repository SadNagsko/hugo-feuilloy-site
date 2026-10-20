import { legal, type LegalBlock, type LegalDocument } from "../data/legal";
import { Dot } from "../components/primitives";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="flex flex-col gap-1.5">
      {block.map((line) => (
        <li key={line} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-[5px] before:w-[5px] before:rounded-full before:bg-violet-soft/60">
          {line}
        </li>
      ))}
    </ul>
  );
}

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <article className="mx-auto max-w-[760px] px-5 pt-20 pb-[110px] sm:px-8 md:pt-28 md:pb-[160px]">
      <h1 className="text-[clamp(44px,6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em]">
        {document.title}
        <Dot />
      </h1>
      <p className="mt-6 text-[15px] text-muted">Dernière mise à jour : {legal.updated}</p>
      <div className="mt-16 flex flex-col gap-12">
        {document.sections.map((section) => (
          <section key={section.title} className="border-t border-white/[0.07] pt-8">
            <h2 className="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">{section.title}</h2>
            <div className="mt-4 flex flex-col gap-3 text-[17px] leading-[1.6] text-muted">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
