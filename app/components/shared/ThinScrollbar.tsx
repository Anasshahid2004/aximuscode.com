"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Lightweight stand-in for the mCustomScrollbar jQuery plugin the original
// theme uses on `.nm-services-1-tabs-btn-scrollbar` - renders scrollable
// content with the native scrollbar hidden and a thin custom track/dragger
// (matching `.mCSB_scrollTools` / `.mCSB_dragger_bar` styling in
// nimo-core.css) that tracks real scroll position.
export default function ThinScrollbar({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ height: 100, top: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function update() {
      const { scrollTop, scrollHeight, clientHeight } = el!;
      if (scrollHeight <= clientHeight) {
        setThumb({ height: 100, top: 0 });
        return;
      }
      const heightPct = (clientHeight / scrollHeight) * 100;
      const topPct = (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPct);
      setThumb({ height: heightPct, top: topPct });
    }

    update();
    el.addEventListener("scroll", update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "auto",
          scrollbarWidth: "none",
          marginLeft: "20px",
        }}
        className="mCSB_container"
      >
        {children}
      </div>
      <div className="mCSB_scrollTools" style={{ position: "absolute", top: 0, left: 0, height: "100%" }}>
        <div
          className="mCSB_dragger_bar"
          style={{ position: "absolute", left: 0, top: `${thumb.top}%`, height: `${thumb.height}%` }}
        />
      </div>
    </div>
  );
}
