import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

const NAV_SELECTOR = "[data-site-nav]";

let lenis: Lenis | null = null;

function navOffset() {
  return document.querySelector<HTMLElement>(NAV_SELECTOR)?.offsetHeight ?? 0;
}

export function scrollToHash(hash: string) {
  const target = hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return false;
  if (lenis) {
    const scrollMargin = target === 0 ? 0 : parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    lenis.scrollTo(target, { offset: target === 0 ? 0 : scrollMargin - navOffset() });
  } else {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (target === 0) window.scrollTo({ top: 0, behavior });
    else target.scrollIntoView({ behavior });
  }
  history.replaceState(null, "", hash);
  return true;
}

export function useLenis() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || touch) return;

    const instance = new Lenis({ lerp: 0.1, autoRaf: false });
    lenis = instance;
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (hash && scrollToHash(hash)) event.preventDefault();
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis = null;
    };
  }, []);
}
