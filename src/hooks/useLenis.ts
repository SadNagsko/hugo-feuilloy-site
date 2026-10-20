import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

const NAV_SELECTOR = "[data-site-nav]";

function navOffset() {
  return document.querySelector<HTMLElement>(NAV_SELECTOR)?.offsetHeight ?? 0;
}

export function useLenis() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || touch) return;

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash) return;
      const target = hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
      if (target === null) return;
      event.preventDefault();
      const scrollMargin = target === 0 ? 0 : parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(target, { offset: target === 0 ? 0 : scrollMargin - navOffset() });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
