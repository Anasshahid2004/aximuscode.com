"use client";

import { useState } from "react";
import type { Settings } from "@/app/lib/types";

const WOW_DELAYS = [".1s", ".2s", ".3s", ".4s", ".5s", ".6s", ".7s"];

// Ports tx-faq/views/view-1.php. Each item carries `wow fadeInUp2` (with a
// staggered delay, matching the original) so it slides up into view as the
// section scrolls in - the reveal itself is handled by the site-wide `.wow`
// observer in ScrollReveal.tsx. The open/close panel uses a CSS Grid
// 0fr->1fr trick instead of Bootstrap's real .collapse/.collapsing classes
// (which we don't ship bootstrap.js for) to get the same smooth slide
// height animation without needing to measure scrollHeight manually.
export default function FaqAccordion({ settings }: { settings: Settings }) {
  const list: any[] = settings.faq_lists || [];
  const initialActive = list.findIndex((l) => l.is_active === "yes");
  const [active, setActive] = useState(initialActive === -1 ? 0 : initialActive);

  // Opening/closing an item changes the height of this whole right-hand
  // column, which the left contact panel's GSAP scroll-pin (FaqLeftPin.tsx)
  // depends on to know where to unpin. That's handled by the site-wide
  // debounced ResizeObserver in ScrollReveal.tsx (watches document.body,
  // refreshes ScrollTrigger once things settle) rather than a bespoke
  // refresh call here - calling ScrollTrigger.refresh() synchronously
  // during the toggle, while the left panel may be actively pinned, made
  // GSAP re-measure and reposition the pin mid-flight, which is what was
  // causing the left panel's content to visibly flicker/fade.
  function toggle(i: number) {
    setActive((prev) => (prev === i ? -1 : i));
  }

  return (
    <div className="nm-accordion">
      {list.map((item, i) => {
        const isOpen = active === i;
        return (
          <div
            className="nm-accordion-item wa_accordion_item wow fadeInUp2"
            data-wow-delay={WOW_DELAYS[i % WOW_DELAYS.length]}
            key={item._id || i}
          >
            <button
              className={`item-title nm-h-1 ${isOpen ? "" : "collapsed"}`}
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              {item.count && <span className="text">{item.count}</span>}
              <span dangerouslySetInnerHTML={{ __html: item.title }} />
              <span className="icon">
                <i className="fa-solid fa-plus" />
              </span>
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.4s var(--nm-cube-1)",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p className="nm-p-1 item-disc" dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
