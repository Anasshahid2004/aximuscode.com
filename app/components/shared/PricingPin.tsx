"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ports "pricing-2-pin" from nimo-core.js: on desktop, the pricing section
// (`.nm-price-2-area`) pins in place while the newsletter/"Free Trial"
// section right after it (`.nm-trial-2-area`) scrolls up and over it,
// unpinning once the newsletter section has mostly passed.
export default function PricingPin() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!window.matchMedia("(min-width: 1200px)").matches) return;
    if (!document.querySelector(".nm-price-2-area") || !document.querySelector(".nm-trial-2-area")) return;

    const tween = gsap.to(".nm-price-2-area", {
      scrollTrigger: {
        trigger: ".nm-trial-2-area",
        start: "top 80%",
        end: "bottom 60%",
        pin: ".nm-price-2-area",
        pinSpacing: false,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return null;
}
