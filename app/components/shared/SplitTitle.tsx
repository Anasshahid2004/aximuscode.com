"use client";

import { useRef, createElement } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/app/lib/gsap-club/SplitText";

// Ports the "section-title-1" scroll effect from nimo-core.js: SplitText
// breaks the heading into per-line <div>s, and `.wa_bg_position div` (see
// nimo-core.css) paints each line with a white/grey split-gradient background
// clipped to the text. As the line scrolls through the trigger range, GSAP
// scrubs `backgroundPositionX` from grey-filled to fully white - the
// left-to-right "ink fill" sweep on the About/section titles.
export default function SplitTitle({
  as = "h2",
  html,
  className = "",
}: {
  as?: keyof React.JSX.IntrinsicElements;
  html: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.registerPlugin(SplitText, ScrollTrigger);

      const split: any = new SplitText(ref.current, { type: "lines" });
      split.lines.forEach((line: Element) => {
        gsap.to(line, {
          backgroundPositionX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            // The original's "top 85% -> bottom center" window is only
            // ~300px of scroll for a single text line - easy to blow past
            // in one wheel tick and never actually see the grey/white
            // sweep. Widen it so the transition is comfortably visible.
            scrub: 1,
            start: "top 95%",
            end: "bottom 20%",
          },
        });
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [html] },
  );

  return createElement(as, {
    ref,
    className: `${className} wa_bg_position`.trim(),
    dangerouslySetInnerHTML: { __html: html },
  });
}
