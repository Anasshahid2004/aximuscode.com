"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "@/app/lib/gsap-club/SplitText";

// Ports "menu-link-animation" from nimo-core.js: each character of the link
// text flips in on rotateY (alternating -180/180deg per char) on hover. The
// original references an ease named "case1", which is never actually
// registered anywhere in the theme's own JS (only "ease1" is) - a typo, not
// an intentional un-eased fallback - so this registers and uses "ease1"
// instead of replicating the broken reference.
export default function SplitHoverLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const splitRef = useRef<any>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.registerPlugin(SplitText, CustomEase);
      if (!CustomEase.get("ease1")) CustomEase.create("ease1", "0, 0, 0.2, 1");
      splitRef.current = new SplitText(ref.current, { type: "words,chars" });
      return () => splitRef.current?.revert();
    },
    { scope: ref },
  );

  function onMouseEnter() {
    const chars = splitRef.current?.chars;
    if (!chars) return;
    chars.forEach((char: Element, i: number) => {
      const yValue = i % 2 === 0 ? -180 : 180;
      gsap.fromTo(char, { rotateY: yValue }, { rotateY: 0, opacity: 1, duration: 0.6, ease: "ease1" });
    });
  }

  return (
    <a ref={ref} href={href} className={className} onMouseEnter={onMouseEnter}>
      {children}
    </a>
  );
}
