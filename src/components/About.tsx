import { motion } from "motion/react";
import { about, site } from "../data/site";
import { Container, Dot, springIn, useImageStatus } from "./primitives";
import { Reveal } from "./Reveal";

// Une seule structure : deux colonnes en desktop ; en mobile, le titre passe au-dessus
// et la photo, la bio et les repères forment une carte (colonne de texte en display: contents).
const cardPiece = "max-md:border-x max-md:border-white/[0.07] max-md:bg-surface";

function Portrait() {
  const { status, imageProps } = useImageStatus();

  return (
    <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/[0.07] bg-surface sm:h-[520px] max-md:h-[240px] max-md:rounded-b-none max-md:rounded-t-[24px] max-md:border-b-0 max-md:bg-bg-deep">
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <span className="text-[120px] leading-none font-bold tracking-[-0.06em] text-white/[0.06] max-md:text-[96px]">{site.initials}</span>
      </div>
      {status !== "error" && (
        <img
          src={site.portrait}
          alt={`Portrait de ${site.name}`}
          loading="lazy"
          decoding="async"
          {...imageProps}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 max-md:object-[center_25%] ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

export function About() {
  return (
    <section id="a-propos" className="py-24 max-md:pb-12 md:py-[160px]">
      <Container className="flex flex-wrap items-center gap-[72px] max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:gap-0">
        <Reveal className="min-w-0 flex-[1_1_380px] max-md:order-2 max-md:mt-8 max-md:flex-none">
          <Portrait />
        </Reveal>
        <Reveal className="min-w-0 flex-[1_1_440px] max-md:contents">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em] max-md:order-1 max-md:text-center">
            {about.title}
            <Dot />
          </h2>
          <div className={`px-5 pt-5 md:hidden max-md:order-3 ${cardPiece}`}>
            <p className="text-[18px] font-bold tracking-[-0.02em]">{site.name}</p>
            <p className="mt-1 text-[14px] leading-[1.4] text-muted">{about.role}</p>
          </div>
          <p className={`mt-7 text-[19px] leading-[1.45] text-muted sm:text-[21px] max-md:order-4 max-md:mt-0 max-md:px-5 max-md:pt-4 max-md:pb-5 max-md:text-[16px] max-md:leading-[1.5] max-md:text-ink ${cardPiece}`}>
            <span className="max-md:hidden">{about.textLead}</span>
            {about.text}
          </p>
          <ul
            className={`mt-12 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-6 gap-y-8 max-md:order-5 max-md:mt-0 max-md:grid-cols-3 max-md:gap-0 max-md:rounded-b-[24px] max-md:border-y max-md:text-center ${cardPiece}`}
          >
            {about.traits.map((trait, i) => (
              <motion.li
                key={trait.title}
                className="border-t border-white/[0.12] pt-5 max-md:border-t-0 max-md:border-l max-md:border-white/[0.07] max-md:px-2 max-md:py-4 max-md:first:border-l-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0, transition: { ...springIn, delay: 0.2 + i * 0.09 } }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <p className="text-[17px] font-semibold max-md:text-[20px] max-md:leading-none max-md:font-bold max-md:tracking-[-0.03em]">{trait.title}</p>
                <p className="mt-1.5 text-[15px] leading-[1.45] text-muted max-md:text-[12px] max-md:leading-[1.3]">{trait.text}</p>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
