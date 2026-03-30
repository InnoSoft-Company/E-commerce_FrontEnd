"use client";
import { useEffect } from "react";

/**
 * Global scroll-reveal: watches every .reveal / .reveal-left / .reveal-scale
 * and adds .visible when 15% of the element enters the viewport.
 */
export function ScrollReveal() {
  useEffect(() => {
    const selectors = ".reveal, .reveal-left, .reveal-scale";

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);           // fire once
          }
        });
      },
      { threshold: 0.12 }
    );

    const attach = () => {
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        io.observe(el);
      });
    };

    attach();

    // Re-scan after route changes (Next.js soft nav)
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return null;
}
