"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ports the generic "add-active-class" behavior from nimo-core.js: any
// element with `.wa_add_class` gets `.active` toggled on when it scrolls
// into view. Most of the theme's entrance transitions (hero title reveal,
// section titles, etc.) are plain CSS transitions gated behind that
// `.active` class, so this one observer unlocks them site-wide.
export default function ScrollReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers = gsap.utils.toArray<HTMLElement>(".wa_add_class").map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        end: "bottom bottom",
        once: true,
        onEnter: () => el.classList.add("active"),
      }),
    );

    // wow.js reveal: `.wow` elements start `visibility: hidden` (see
    // globals.css), but that alone only hides them - it doesn't pause the
    // paired @keyframes animation (slideRightUp2, fadeInUp2, etc.), which
    // keeps running and finishes off-screen while hidden. If the user
    // hasn't scrolled there yet by the time the animation's duration has
    // elapsed, revealing it later just shows the already-finished end
    // state with no visible motion. wow.js avoids this by also blanking
    // `animation-name` to "none" until reveal, then restoring the real
    // name - replicate that here instead of relying on visibility alone.
    const wowTriggers = gsap.utils.toArray<HTMLElement>(".wow").map((el) => {
      // Cache the real animation name on the element itself (not just a
      // local var) so this stays correct even if the effect re-runs -
      // React's dev-mode Strict Mode double-invokes effects (mount ->
      // cleanup -> mount again), and the cleanup below only kills the
      // ScrollTrigger, it doesn't undo `animationName = "none"`. Without
      // caching, the second run's `getComputedStyle` would read back its
      // own "none" leftover instead of the real name, permanently
      // freezing the animation - it'd pop in instantly with no motion the
      // first time you scroll to it.
      let realAnimationName = el.dataset.wowRealAnim;
      if (!realAnimationName) {
        realAnimationName = getComputedStyle(el).animationName;
        el.dataset.wowRealAnim = realAnimationName;
      }
      el.style.animationName = "none";
      // Also force visibility back to hidden here, not just animationName -
      // Strict Mode's first (soon-to-be-killed) effect run can already have
      // called ScrollTrigger.refresh() and fired onEnter for elements
      // already in the initial viewport, which sets visibility:visible.
      // Without resetting it here too, the second run's freeze leaves the
      // element visible while animationName snaps to "none" (base, fully
      // -settled CSS state) - a jump-to-final-state flash - right before
      // its own refresh() fires onEnter again and replays the real
      // animation, i.e. the whole thing visibly happens twice.
      el.style.visibility = "hidden";
      const delay = el.getAttribute("data-wow-delay");
      if (delay) el.style.animationDelay = delay;
      const duration = el.getAttribute("data-wow-duration");
      if (duration) el.style.animationDuration = duration;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          el.style.visibility = "visible";
          el.style.animationName = realAnimationName;
        },
      });
    });

    // "subtitle-1-plus": every decorative `+` divider (About/ServiceSection/
    // PostGrid top/bottom shapes, etc.) spins from 360deg to 0deg scrubbed
    // to scroll position as it passes through the viewport.
    const plusTweens = gsap.utils.toArray<HTMLElement>(".nm-about-1-line-plus .plus").map((el) =>
      gsap.fromTo(
        el,
        { rotation: 360 },
        {
          rotation: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            scrub: 3,
          },
        },
      ),
    );

    // "subtitle-2-ani": the `.nm-subtitle-2` style ("06. Pricing"-style
    // subtitles on the pricing/newsletter/steps-2 family of widgets)
    // scrubs its `.icon` rotating in and its `.line` growing from
    // scaleX(0) as the subtitle scrolls through view - without this it
    // renders at full width/rotation immediately on load instead of
    // growing in, which reads as "already there" compared to the
    // original's mid-scroll state.
    const subtitle2Timelines = gsap.utils.toArray<HTMLElement>(".nm-subtitle-2").map((card) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "top 20%",
          toggleActions: "play none none reverse",
          scrub: true,
        },
      });
      const icon = card.querySelector(".icon");
      const line = card.querySelector(".line");
      if (icon) tl.from(icon, { rotation: 360 });
      if (line) tl.from(line, { scaleX: 0 }, "<=");
      return tl;
    });

    // "wa-parallax-shape-2/3": decorative 3D shape images (e.g. the
    // pricing page's metallic sphere) fade + slide in as they scroll
    // through view, rather than being visible at full opacity from page
    // load. The original's own `start: "to 80%"` / `"to 100%"` isn't valid
    // ScrollTrigger syntax (should be "top ..%") - a typo in nimo-core.js
    // itself, corrected here rather than replicated.
    const parallaxShape2Tweens = gsap.utils.toArray<HTMLElement>(".wa_parallax_shape_2").map((el) =>
      gsap.fromTo(
        el,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 10%",
            scrub: true,
          },
        },
      ),
    );
    const parallaxShape3Tweens = gsap.utils.toArray<HTMLElement>(".wa_parallax_shape_3").map((el) =>
      gsap.fromTo(
        el,
        { yPercent: 70 },
        {
          yPercent: 0,
          ease: "elastic.out(1,0.4)",
          duration: 2.5,
          scrollTrigger: {
            trigger: el,
            start: "top 100%",
            end: "top 10%",
            toggleActions: "play none none reverse",
          },
        },
      ),
    );

    // "placeholder-typing": every `.wa_placeholder` input (contact/newsletter
    // forms) has its placeholder typed in character-by-character once it
    // scrolls into view, instead of just showing the full text immediately.
    // Ported as a plain IntersectionObserver (matching the original 1:1)
    // rather than ScrollTrigger, since the original itself doesn't use one.
    const placeholderCleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(".wa_placeholder").forEach((input) => {
      const fullText = input.placeholder;
      let index = 0;
      let typingTimeout: ReturnType<typeof setTimeout> | undefined;
      input.placeholder = "";

      function type() {
        if (index < fullText.length) {
          input.placeholder += fullText.charAt(index);
          index++;
          typingTimeout = setTimeout(type, 70);
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              type();
              observer.unobserve(input);
            }
          });
        },
        { threshold: 0.5 },
      );
      observer.observe(input);

      placeholderCleanups.push(() => {
        observer.disconnect();
        clearTimeout(typingTimeout);
      });
    });

    ScrollTrigger.refresh();

    // Images (hero/testimonial/team photos etc.) and web fonts finish
    // loading after this first paint and push the rest of the page down,
    // which leaves every ScrollTrigger's cached start/end pixel bounds
    // stale (calculated against the shorter, pre-load layout). That makes
    // scroll-scrubbed effects (title fill sweep, the `+` rotation) appear
    // to have "already finished" the moment their section is actually
    // visible. Re-measure whenever the page's total height changes so the
    // trigger bounds always match the real, final layout.
    let refreshTimeout: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    resizeObserver.observe(document.body);

    window.addEventListener("load", () => ScrollTrigger.refresh());

    return () => {
      triggers.forEach((t) => t.kill());
      wowTriggers.forEach((t) => t.kill());
      plusTweens.forEach((t) => t.scrollTrigger?.kill());
      subtitle2Timelines.forEach((t) => t.scrollTrigger?.kill());
      parallaxShape2Tweens.forEach((t) => t.scrollTrigger?.kill());
      parallaxShape3Tweens.forEach((t) => t.scrollTrigger?.kill());
      placeholderCleanups.forEach((fn) => fn());
      resizeObserver.disconnect();
      clearTimeout(refreshTimeout);
    };
  }, []);

  return null;
}
