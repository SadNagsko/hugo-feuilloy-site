import { approach } from "../data/site";
import { Container, Dot, mobileText } from "./primitives";
import { Reveal } from "./Reveal";
import { Steps } from "./Statement";

export function Approach() {
  return (
    <section id={approach.id} aria-label={approach.label} className="py-24 max-md:pb-12 md:py-[160px]">
      <Container>
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="text-[clamp(44px,5.6vw,80px)] leading-[0.96] font-bold tracking-[-0.05em] text-balance">
            {approach.title}
            <Dot />
          </h2>
          <p className={`mt-6 text-[19px] leading-[1.45] text-muted sm:text-[21px] max-md:text-balance ${mobileText}`}>{approach.text}</p>
        </Reveal>

        <Reveal className="mt-10 max-md:text-center md:mt-20">
          <Steps visible animated={false} items={approach.points} />
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-[760px] border-t border-white/[0.07] pt-8 text-center md:mt-20">
          <h3 className="text-[19px] leading-[1.3] font-semibold tracking-[-0.02em] md:text-[22px]">{approach.faq.question}</h3>
          <p className={`mt-3 text-[17px] leading-[1.55] text-muted max-md:text-balance ${mobileText}`}>{approach.faq.answer}</p>
        </Reveal>
      </Container>
    </section>
  );
}
