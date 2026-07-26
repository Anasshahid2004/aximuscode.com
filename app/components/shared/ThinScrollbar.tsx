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
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
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

  // The dragger bar (visible scrollbar thumb) previously only reflected
  // scroll position - it had no drag interactivity at all, so dragging it
  // (the obvious thing to try when you see a scrollbar thumb) did nothing.
  // Ports mCustomScrollbar's drag-to-scroll behavior: mousedown on the
  // thumb starts a drag, mousemove maps the cursor's position within the
  // track to a scrollTop, mouseup ends it.
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const el = containerRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const trackRect = track.getBoundingClientRect();
      const { scrollHeight, clientHeight } = el;
      const thumbHeightPx = (clientHeight / scrollHeight) * trackRect.height;
      const maxThumbTop = trackRect.height - thumbHeightPx;
      const relY = e.clientY - trackRect.top - thumbHeightPx / 2;
      const clampedY = Math.max(0, Math.min(maxThumbTop, relY));
      const scrollRatio = maxThumbTop > 0 ? clampedY / maxThumbTop : 0;
      el.scrollTop = scrollRatio * (scrollHeight - clientHeight);
    }
    function onMouseUp() {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function onThumbMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    draggingRef.current = true;
    document.body.style.userSelect = "none";
  }

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
      <div
        ref={trackRef}
        className="mCSB_scrollTools"
        style={{ position: "absolute", top: 0, left: 0, height: "100%" }}
      >
        <div
          className="mCSB_dragger_bar"
          onMouseDown={onThumbMouseDown}
          style={{
            position: "absolute",
            left: 0,
            top: `${thumb.top}%`,
            height: `${thumb.height}%`,
            cursor: "grab",
          }}
        />
      </div>
    </div>
  );
}
