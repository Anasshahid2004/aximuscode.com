"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";

// Ports "back-to-top-button-function" from nimo-core.js + the
// `.wa-back-to-top.wa_backToTop` markup from header.php: a small fixed
// bottom-right button that's slid off-screen (`bottom: -12.5%`) until the
// page has scrolled past 500px, then slides into view (`.active`), and
// scrolls back to the top on click.
export default function BackToTop() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    function onScroll() {
      setActive(window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      className={`wa-back-to-top wa_backToTop ${active ? "active" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Scroll to top"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <i className="fa-solid fa-angle-up" />
    </div>
  );
}
