"use client";

import { useEffect, useRef } from "react";

// Ports the "choose-1-handshake-video" behavior from nimo-core.js: plays
// (from wherever it left off) while the video is in the viewport, pauses
// when it scrolls out, and always stops itself after 1s of playback - a
// short "tap" of motion each time it comes into view rather than a full
// loop.
export default function ScrollPlayVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function onTimeUpdate() {
      if (video!.currentTime >= 1) {
        video!.pause();
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video!.currentTime = 0;
            video!.play().catch(() => {});
          } else {
            video!.pause();
          }
        });
      },
      { threshold: 0 },
    );

    video.addEventListener("timeupdate", onTimeUpdate);
    observer.observe(video);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      observer.disconnect();
    };
  }, []);

  return <video ref={videoRef} src={src} muted playsInline className={className} />;
}
