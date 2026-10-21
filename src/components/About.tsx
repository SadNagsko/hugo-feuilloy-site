import { motion } from "motion/react";
import { about, site } from "../data/site";
import { Container, Dot, mobileText, springIn, useImageStatus } from "./primitives";
import { Reveal } from "./Reveal";

function Portrait() {
  const { status, imageProps } = useImageStatus();

  return (
    <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/[0.07] bg-surface sm:h-[520px] max-md:aspect-[4/5] max-md:h-auto max-md:max-h-[420px] max-md:w-full max-md:rounded-[24px]">
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <span className="text-[120px] leading-none font-bold tracking-[-0.06em] text-white/[0.06]">{site.initials}</span>
      </div>
      {status !== "error" && (
        <img
          src={site.portrait}
          alt={`Portrait de ${site.name}`}
          loading="lazy"
          decoding="async"
          {...imageProps}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 max-md:object-top ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

export function About() {
  return (
    <section id="a-propos" className="py-24 md:py-[160px]">
      <Container className="flex flex-wrap items-center gap-[72px] max-md:gap-10">
        <Reveal className="min-w-0 flex-[1_1_380px]">
          <Portrait />
        </Reveal>
        <Reveal className="min-w-0 flex-[1_1_440px]">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em]">
            {about.title}
            <Dot />
          </h2>
          <p className={`mt-7 text-[19px] leading-[1.45] text-muted sm:text-[21px] ${mobileText}`}>{about.text}</p>
          <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-6 gap-y-8 max-md:mt-10 max-md:flex max-md:flex-col max-md:gap-0 max-md:border-b max-md:border-white/[0.06]">
            {about.traits.map((trait, i) => (
              <motion.li
                key={trait.title}
                className="border-t border-white/[0.12] pt-5 max-md:flex max-md:items-baseline max-md:justify-between max-md:gap-4 max-md:border-white/[0.06] max-md:py-4"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0, transition: { ...springIn, delay: 0.2 + i * 0.09 } }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <p className="text-[17px] font-semibold">{trait.title}</p>
                <p className="mt-1.5 text-[15px] leading-[1.45] text-muted max-md:mt-0 max-md:text-right">{trait.text}</p>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
