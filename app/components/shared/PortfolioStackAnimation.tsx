"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ports "portfolio-1-animation" from nimo-core.js: on desktop, the first 4
// portfolio grid cards start stacked/fanned out near the section title
// (large x/y offsets, slight rotation, scaled down) and converge into
// their normal grid position as the section scrolls through the trigger
// range, scrubbed to scroll position.
export default function PortfolioStackAnimation() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mq = window.matchMedia("(min-width: 992px)");
    if (!mq.matches) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".p1_ani_trigger",
        start: "top 20%",
        end: "top -20%",
        toggleActions: "play none none reverse",
        scrub: true,
      },
    });

    tl.from(".p1_ani_trigger_elm_1", { x: 710, y: -790, scale: 0.7, rotate: 4 });
    tl.from(".p1_ani_trigger_elm_2", { x: -50, y: -790, scale: 0.7, rotate: -4 }, "<");
    tl.from(".p1_ani_trigger_elm_3", { x: 730, y: -1250, scale: 0.7, rotate: -7 }, "<");
    tl.from(".p1_ani_trigger_elm_4", { x: -30, y: -1250, scale: 0.7, rotate: 5 }, "<");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return null;
}
