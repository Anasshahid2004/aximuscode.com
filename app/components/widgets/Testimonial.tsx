"use client";

import SplitTitle from "@/app/components/shared/SplitTitle";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import PrimaryButton from "@/app/components/shared/PrimaryButton";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-testimonial/views/view-1.php. The avatar "preview slider" isn't
// a real horizontally-scrolling Swiper despite the markup/classes - per
// nimo-custom.js's tx_testimonial(), each avatar is placed on a circle
// around the wrapper's center via plain trigonometry (radius 450), and the
// whole circle is scrubbed between rotation 40deg and -40deg as the section
// scrolls. Reproduced here as absolutely-positioned divs instead of Swiper
// slides, since nothing about it actually slides - only the main quote
// panel (a real fade-effect Swiper) changes with each avatar click.
export default function Testimonial({ settings }: { settings: Settings }) {
  const list: any[] = settings.testimonial_lists || [];
  const [active, setActive] = useState(0);
  const mainSwiperRef = useRef<SwiperClass | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const slides = Array.from(wrapper.children) as HTMLElement[];
    const radius = 450;
    const centerX = wrapper.clientWidth / 2;
    const centerY = wrapper.clientHeight / 2;
    const angleStep = (2 * Math.PI) / slides.length;

    slides.forEach((slide, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle) - slide.clientWidth / 2;
      const y = centerY + radius * Math.sin(angle) - slide.clientHeight / 2;
      slide.style.left = `${x}px`;
      slide.style.top = `${y}px`;
    });

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      wrapper,
      { rotation: 40 },
      {
        rotation: -40,
        scrollTrigger: {
          trigger: wrapper,
          toggleActions: "play none none reverse",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [list.length]);

  function selectAvatar(i: number) {
    if (draggedRef.current) return;
    setActive(i);
    mainSwiperRef.current?.slideTo(i);
  }

  // Drag-to-rotate: not part of the original theme (nimo-custom.js's
  // tx_testimonial() only rotates this avatar circle via scroll) - added on
  // request, reusing the same rotation the scroll scrub already drives so a
  // press-and-drag feels like manually scrubbing that same effect.
  //
  // A plain click still needs to select that avatar (selectAvatar above), so
  // rotation only engages after a genuine long-press: movement is ignored
  // until the pointer's been held LONG_PRESS_MS, not just past a distance
  // threshold - a bare distance check misfired on ordinary clicks near an
  // avatar's edge, where the natural pointerdown->pointerup hand jitter alone
  // exceeded it.
  const LONG_PRESS_MS = 350;
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const longPressActive = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedRef = useRef(false);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    draggedRef.current = false;
    longPressActive.current = false;
    dragStartX.current = e.clientX;
    dragStartRotation.current = (gsap.getProperty(wrapper, "rotation") as number) || 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    longPressTimer.current = setTimeout(() => {
      longPressActive.current = true;
    }, LONG_PRESS_MS);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!longPressActive.current) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 3) draggedRef.current = true;
    gsap.set(wrapper, { rotation: dragStartRotation.current + delta / 4 });
  }

  function onPointerUp() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressActive.current = false;
    // Cleared on a delay so the click handler on the avatar just released
    // under the pointer still sees `draggedRef` true and skips selection.
    setTimeout(() => {
      draggedRef.current = false;
    }, 0);
  }

  return (
    <section className="nm-testimonial-1-area pt-65 wa-fix wa-p-relative tx-section">
      <div className="container nm-container-1">
        <div className="nm-testimonial-1-sec-title">
          <div className="left">
            {on(settings.enable_sub_title) && (
              <h6 className="nm-subtitle-1">
                <span className="dot" />
                <span className="text" dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
              </h6>
            )}
            {on(settings.enable_title) && (
              <SplitTitle as="h2" className="tx-title nm-sec-title-1" html={settings.title} />
            )}
          </div>
          <div className="right">
            {on(settings.enable_description) && (
              <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
            )}
            {on(settings.enable_button) && (
              <PrimaryButton text={settings.button_text} link={settings.button_link} icon={settings.button_icon} />
            )}
          </div>
        </div>

        <div
          className="nm-testimonial-1-wrap wa-p-relative wa-bg-default"
          style={settings.image_1?.url ? { backgroundImage: `url(${settings.image_1.url})` } : undefined}
        >
          <div className="nm-testimonial-1-preview">
            <div
              className="nm-testimonial-1-preview-slider"
              style={{ cursor: "grab", touchAction: "pan-y" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="swiper-wrapper" ref={wrapperRef}>
                {list.map((item, i) => (
                  <div
                    className={`swiper-slide ${i === active ? "swiper-slide-thumb-active" : ""}`}
                    key={item._id || i}
                    onClick={() => selectAvatar(i)}
                  >
                    {item.author_image?.url && (
                      <div className="nm-testimonial-1-preview-slider-item wa-fix wa-img-cover">
                        <img src={item.author_image.url} alt={item.name || ""} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nm-testimonial-1-main-slider wa-fix">
            <Swiper
              modules={[EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              slidesPerView={1}
              allowTouchMove={false}
              onSwiper={(s) => (mainSwiperRef.current = s)}
              onSlideChange={(s) => setActive(s.activeIndex)}
            >
              {list.map((item, i) => (
                <SwiperSlide key={item._id || i}>
                  <div className="nm-testimonial-1-main-slider-single">
                    {item.quote_icon?.value && (
                      <div className="icon">
                        <ElementorIcon icon={item.quote_icon} />
                      </div>
                    )}
                    {item.comment && <p className="nm-p-1 comment" dangerouslySetInnerHTML={{ __html: item.comment }} />}
                    <div className="line" />
                    {on(item.enable_rating) && (
                      <div className="nm-choose-1-rating">
                        <div className="rating-icon">
                          {Array.from({ length: 5 }, (_, s) => (
                            <i
                              key={s}
                              className={s < Number(item.rating_star) ? "fa-solid fa-star" : "fa-regular fa-star-half-stroke"}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="nm-p-1 author-name">
                      {item.name} {item.designation}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="nm-testimonial-1-bg-blur" />
    </section>
  );
}
