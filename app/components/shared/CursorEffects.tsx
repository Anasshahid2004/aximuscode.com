"use client";

import { useEffect } from "react";
import gsap from "gsap";

const POINTER_SELECTOR = "a, input, textarea, button";

const MAGNETIC_CONFIGS = [
  { wrapper: "wa_magnetic_btn", inner: null, strength: 30 },
  { wrapper: "wa_magnetic_btn_2", inner: "wa_magnetic_btn_2_elm", strength: 30 },
  { wrapper: "wa_magnetic_btn_3", inner: "wa_magnetic_btn_3_elm", strength: 100 },
] as const;

// Ports two site-wide interaction effects from nimo-core.js that give the
// theme its "alive" feel:
//   1. `Cursor` class - a custom mouse-follower ring (`.wa-cursor`) that
//      grows into a pointer state over links/buttons.
//   2. `.wa_magnetic_btn[_2/_3]` - buttons/icons that shift toward the
//      cursor while hovered, springing back on mouseout.
// Both are re-implemented here with GSAP + event delegation instead of the
// original jQuery, so they work across the whole app without per-element
// listeners that would need rebinding as React re-renders content.
export default function CursorEffects() {
  useEffect(() => {
    const cursorEl = document.createElement("div");
    cursorEl.className = "wa-cursor";
    const cursorTextEl = document.createElement("div");
    cursorTextEl.className = "wa-cursor-text";
    cursorEl.appendChild(cursorTextEl);
    document.body.appendChild(cursorEl);

    let visible = false;
    let visibleTimeout: ReturnType<typeof setTimeout>;

    function show() {
      if (visible) return;
      clearTimeout(visibleTimeout);
      cursorEl.classList.add("-visible");
      visibleTimeout = setTimeout(() => (visible = true));
    }

    function hide() {
      clearTimeout(visibleTimeout);
      cursorEl.classList.remove("-visible");
      visibleTimeout = setTimeout(() => (visible = false), 300);
    }

    function onMouseMove(e: MouseEvent) {
      gsap.to(cursorEl, {
        x: e.clientX,
        y: e.clientY,
        force3D: true,
        overwrite: true,
        ease: "expo.out",
        duration: visible ? 0.5 : 0,
      });
      show();
    }

    function onMouseOver(e: MouseEvent) {
      if ((e.target as HTMLElement)?.closest?.(POINTER_SELECTOR)) {
        cursorEl.classList.add("-pointer");
      }
    }
    function onMouseOut(e: MouseEvent) {
      if ((e.target as HTMLElement)?.closest?.(POINTER_SELECTOR)) {
        cursorEl.classList.remove("-pointer");
      }
    }

    function onMouseDown() {
      cursorEl.classList.add("-active");
    }
    function onMouseUp() {
      cursorEl.classList.remove("-active");
    }
    function onMouseLeaveDoc() {
      hide();
    }
    function onMouseEnterDoc() {
      show();
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeaveDoc);
    document.documentElement.addEventListener("mouseenter", onMouseEnterDoc);

    // Magnetic buttons: for each configured wrapper class, shift the
    // wrapper (or its designated inner elements) toward the cursor while
    // hovered, springing back with an elastic ease on mouseout.
    const magnetCleanups = MAGNETIC_CONFIGS.map(({ wrapper, inner, strength }) => {
      function handleMove(e: MouseEvent) {
        const target = (e.target as HTMLElement)?.closest<HTMLElement>(`.${wrapper}`);
        if (!target) return;
        const bounding = target.getBoundingClientRect();
        const x = (((e.clientX - bounding.left) / target.offsetWidth) - 0.5) * strength;
        const y = (((e.clientY - bounding.top) / target.offsetHeight) - 0.5) * strength;
        const els = inner ? Array.from(target.querySelectorAll<HTMLElement>(`.${inner}`)) : [target];
        els.forEach((el) => {
          gsap.to(el, { x, y, duration: 1, ease: "elastic.out(1,0.3)" });
        });
      }
      function handleOut(e: MouseEvent) {
        const target = (e.target as HTMLElement)?.closest<HTMLElement>(`.${wrapper}`);
        if (!target) return;
        const els = inner ? Array.from(target.querySelectorAll<HTMLElement>(`.${inner}`)) : [target];
        els.forEach((el) => {
          gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,0.3)" });
        });
      }
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseout", handleOut);
      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseout", handleOut);
      };
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeaveDoc);
      document.documentElement.removeEventListener("mouseenter", onMouseEnterDoc);
      magnetCleanups.forEach((fn) => fn());
      cursorEl.remove();
    };
  }, []);

  return null;
}
