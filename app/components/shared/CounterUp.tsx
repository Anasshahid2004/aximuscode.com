"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Ports jquery.counterup.min.js: counts from 0 up to the target number once
// the element scrolls into view, over the same 5s duration as the
// original's `time: 5000` option.
export default function CounterUp({ value }: { value: number | string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Number(value) || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 5,
            ease: "power1.out",
            onUpdate: () => {
              el.textContent = String(Math.floor(counter.val));
            },
          });
          observer.disconnect();
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [target]);

  return (
    <span className="counter" ref={ref}>
      0
    </span>
  );
}
