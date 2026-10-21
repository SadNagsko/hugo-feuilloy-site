import { Fragment, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue, type Variants } from "motion/react";
import { statement } from "../data/site";
import { Dot, palette, useIsMobile, useReducedMotionSafe } from "./primitives";
import { Reveal } from "./Reveal";

type Sentence = (typeof statement.sentences)[number];

const STEPS_FROM = 0.75;
const paragraph = "text-[clamp(30px,4.6vw,64px)] leading-[1.08] font-semibold tracking-[-0.035em]";

function ScrollSentence({ sentence, index, progress }: { sentence: Sentence; index: number; progress: MotionValue<number> }) {
  const total = statement.sentences.length;
  const range = [index / total, (index + 1) / total];
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const color = useTransform(progress, range, [palette.subtle, palette.ink]);
  const words = sentence.text.split(" ");

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span className="inline-block" style={{ opacity, y, color }}>
            {word}
            {sentence.dot && i === words.length - 1 && <Dot />}
          </motion.span>{" "}
        </Fragment>
      ))}
    </>
  );
}

const sentenceWord: Variants = {
  dim: { opacity: 0.15, y: 8, color: palette.subtle },
  lit: { opacity: 1, y: 0, color: palette.ink, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

function InViewSentence({ sentence }: { sentence: Sentence }) {
  const words = sentence.text.split(" ");
  return (
    <motion.span initial="dim" whileInView="lit" viewport={{ once: true, amount: 0.8 }}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span className="inline-block" variants={sentenceWord}>
            {word}
            {sentence.dot && i === words.length - 1 && <Dot />}
          </motion.span>{" "}
        </Fragment>
      ))}
    </motion.span>
  );
}

function MobileStatement() {
  return (
    <section aria-label="Méthode" className="border-t border-white/[0.07] bg-bg-deep py-24">
      <div className="px-5 text-center">
        <p className="text-[32px] leading-[1.15] font-semibold tracking-[-0.035em] text-balance">
          {statement.sentences.map((sentence) => (
            <InViewSentence key={sentence.text} sentence={sentence} />
          ))}
        </p>
        <ol className="mt-10 flex flex-col">
          {statement.steps.map((step, i) => (
            <motion.li
              key={step.label}
              className="border-t border-white/10 py-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", bounce: 0, duration: 0.6, delay: i * 0.1 }}
            >
              <p className="text-[13px] font-medium text-violet-soft">{step.label}</p>
              <p className="mt-2 text-[19px] leading-[1.25] font-semibold tracking-[-0.02em] text-balance">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type StepItem = { label: string; text: string };

export function Steps({ visible, animated, items = statement.steps }: { visible: boolean; animated: boolean; items?: StepItem[] }) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-6 md:gap-y-10">
      {items.map((step, i) => (
        <motion.li
          key={step.label}
          className="border-t border-white/[0.12] pt-4 md:pt-6"
          initial={false}
          animate={animated ? (visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }) : undefined}
          transition={{ type: "spring", bounce: 0, duration: 0.6, delay: visible ? i * 0.1 : 0 }}
        >
          <p className="text-[14px] font-medium text-violet-soft">{step.label}</p>
          <p className="mt-2 text-[19px] leading-[1.25] font-semibold tracking-[-0.02em] md:mt-3 md:text-[22px]">{step.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

function ScrollStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stepsVisible, setStepsVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => setStepsVisible(value >= STEPS_FROM));

  return (
    <section ref={ref} aria-label="Méthode" className="relative h-[180vh] border-t border-white/[0.07] bg-bg-deep md:h-[240vh]">
      <div className="sticky top-0 flex h-svh items-center pt-[88px] pb-8">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-8">
          <p className={paragraph}>
            {statement.sentences.map((sentence, i) => (
              <ScrollSentence key={sentence.text} sentence={sentence} index={i} progress={scrollYProgress} />
            ))}
          </p>
          <div className="mt-10 md:mt-24">
            <Steps visible={stepsVisible} animated />
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticStatement() {
  return (
    <section aria-label="Méthode" className="border-t border-white/[0.07] bg-bg-deep py-24 md:py-[170px]">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8 max-md:text-center">
        <p className={`${paragraph} max-md:text-balance`}>
          {statement.sentences.map((sentence) => (
            <Fragment key={sentence.text}>
              {sentence.text}
              {sentence.dot && <Dot />}{" "}
            </Fragment>
          ))}
        </p>
        <Reveal className="mt-10 md:mt-28">
          <Steps visible animated={false} />
        </Reveal>
      </div>
    </section>
  );
}

export function Statement() {
  const reduceMotion = useReducedMotionSafe();
  const isMobile = useIsMobile();
  if (reduceMotion) return <StaticStatement />;
  return isMobile ? <MobileStatement /> : <ScrollStatement />;
}
