import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const palette = { ink: "#f4f2fa", subtle: "#6f6987" } as const;

export const springIn = { type: "spring", bounce: 0, duration: 0.8 } as const;

const noopSubscribe = () => () => {};

export function useReducedMotionSafe() {
  const reduceMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return hydrated && Boolean(reduceMotion);
}

export const pressable = "transition-transform duration-[120ms] active:scale-[0.97]";

export const primaryButton = `inline-flex h-[54px] items-center justify-center rounded-[12px] bg-violet-strong px-7 text-[17px] font-semibold text-white hover:bg-violet ${pressable}`;

export function Dot({ color }: { color?: string }) {
  return (
    <span className={color ? undefined : "text-violet"} style={color ? { color } : undefined}>
      .
    </span>
  );
}

export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  );
}

export type ImageStatus = "loading" | "loaded" | "error";

export function useImageStatus() {
  const ref = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<ImageStatus>("loading");

  useEffect(() => {
    const image = ref.current;
    if (image?.complete) setStatus(image.naturalWidth > 0 ? "loaded" : "error");
  }, []);

  return {
    status,
    imageProps: { ref, onLoad: () => setStatus("loaded"), onError: () => setStatus("error") },
  };
}
