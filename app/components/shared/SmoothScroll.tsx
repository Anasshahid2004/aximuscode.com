"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ports "lenis-smooth-scroll-activation" from nimo-core.js - the original
// theme drives the whole site's scrolling through Lenis (inertia/easing on
// every wheel tick) rather than the browser's native instant jump, which is
// the "hard" vs. "smooth" feel being reported. Driven off GSAP's own ticker
// (instead of a separate requestAnimationFrame loop, as the original JS
// does) and wired into ScrollTrigger's `scrollerProxy`/`.update()` so the
// site's many scroll-driven effects (pins, scrubs, the wow.js reveals in
// ScrollReveal.tsx) stay in sync with Lenis's virtual scroll position
// instead of the native one they'd otherwise read stale values from.
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
}
