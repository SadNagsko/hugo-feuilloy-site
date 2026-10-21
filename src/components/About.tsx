import { motion } from "motion/react";
import { about, site } from "../data/site";
import { Container, Dot, springIn, useImageStatus } from "./primitives";
import { Reveal } from "./Reveal";

function Portrait() {
  const { status, imageProps } = useImageStatus();

  return (
    <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-white/[0.07] bg-surface sm:h-[520px]">
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

function ProfileCard() {
  const { status, imageProps } = useImageStatus();

  return (
    <Reveal className="mt-8 overflow-hidden rounded-[24px] border border-white/[0.07] bg-surface">
      <div className="relative h-[240px] bg-bg-deep">
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <span className="text-[96px] leading-none font-bold tracking-[-0.06em] text-white/[0.06]">{site.initials}</span>
        </div>
        {status !== "error" && (
          <img
            src={site.portrait}
            alt={`Portrait de ${site.name}`}
            loading="lazy"
            decoding="async"
            {...imageProps}
            className={`absolute inset-0 h-full w-full object-cover object-[center_25%] transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>
      <div className="p-5">
        <p className="text-[18px] font-bold tracking-[-0.02em]">{site.name}</p>
        <p className="mt-1 text-[14px] leading-[1.4] text-muted">{about.role}</p>
        <p className="mt-4 text-[16px] leading-[1.5]">{about.textShort}</p>
      </div>
      <ul className="grid grid-cols-3 border-t border-white/[0.07] text-center">
        {about.stats.map((stat) => (
          <li key={stat.label} className="border-l border-white/[0.07] px-2 py-4 first:border-l-0">
            <p className="text-[20px] leading-none font-bold tracking-[-0.03em]">{stat.value}</p>
            <p className="mt-1.5 text-[12px] leading-[1.3] text-muted">{stat.label}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function About() {
  return (
    <section id="a-propos" className="py-24 max-md:pb-12 md:py-[160px]">
      <Container className="md:hidden">
        <Reveal className="text-center">
          <h2 className="text-[44px] leading-[0.96] font-bold tracking-[-0.05em]">
            {about.title}
            <Dot />
          </h2>
        </Reveal>
        <ProfileCard />
      </Container>
      <Container className="flex flex-wrap items-center gap-[72px] max-md:hidden">
        <Reveal className="min-w-0 flex-[1_1_380px]">
          <Portrait />
        </Reveal>
        <Reveal className="min-w-0 flex-[1_1_440px]">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em]">
            {about.title}
            <Dot />
          </h2>
          <p className="mt-7 text-[19px] leading-[1.45] text-muted sm:text-[21px]">{about.text}</p>
          <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-6 gap-y-8">
            {about.traits.map((trait, i) => (
              <motion.li
                key={trait.title}
                className="border-t border-white/[0.12] pt-5"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0, transition: { ...springIn, delay: 0.2 + i * 0.09 } }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <p className="text-[17px] font-semibold">{trait.title}</p>
                <p className="mt-1.5 text-[15px] leading-[1.45] text-muted">{trait.text}</p>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
