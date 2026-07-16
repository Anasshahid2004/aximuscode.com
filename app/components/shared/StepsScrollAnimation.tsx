"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ports "steps-1-animation" from nimo-core.js: each `.nm_steps1_ani_trigger`
// step card reveals itself as it scrolls through - the number badge turns
// from black to the accent green, the vertical connector line fills
// downward (scaleY 0 -> 1), and the content card un-rotates from its
// resting rotateY(±45deg) (see nimo-core.css's nth-child odd/even rules)
// to flat, all scrubbed to scroll position.
export default function StepsScrollAnimation() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timelines = gsap.utils.toArray<HTMLElement>(".nm_steps1_ani_trigger").map((card) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: () => "+=" + card.offsetHeight,
          toggleActions: "play none none reverse",
          scrub: true,
        },
      });

      const number = card.querySelector(".number");
      const fill = card.querySelector(".number-line-fill");
      const content = card.querySelector(".content");

      if (number) {
        tl.to(number, { backgroundColor: "var(--nm-clr-pr-1)", color: "#000", duration: 0.3 });
      }
      if (fill) {
        tl.to(fill, { scaleY: 1, duration: 1 });
      }
      if (content) {
        tl.to(content, { rotateY: 0, duration: 1 }, "<");
      }

      return tl;
    });

    return () => {
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  }, []);

  return null;
}
