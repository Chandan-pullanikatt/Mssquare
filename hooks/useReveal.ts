"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal using IntersectionObserver.
 * Attach the returned ref to a container, and all children with `.rev`
 * will get `.visible` toggled when they enter the viewport.
 */
export function useReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(".rev");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return containerRef;
}
