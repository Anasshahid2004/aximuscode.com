"use client";

import SplitTitle from "@/app/components/shared/SplitTitle";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import FireflyAnim from "@/app/components/shared/FireflyAnim";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-team-lists/views/view-1.php
export default function TeamLists({ settings }: { settings: Settings }) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const members: any[] = settings.team_members || [];
  const [expanded, setExpanded] = useState<number | null>(null);

  // "team-1-active-class" from nimo-core.js: once the slider scrolls into
  // view, `.active` is added for 2s and then removed again. The prev/
  // active/next cards' resting positions are just plain CSS (nimo-core.css),
  // but the `.active` window is what plays their one-shot entrance
  // animation - the active (center) card drops in first (t1activeItem),
  // then after a 1s delay the prev/next cards fly out to their sides
  // (t1prevItem/t1NextItem).
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = sliderRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        el.classList.add("active");
        setTimeout(() => el.classList.remove("active"), 2000);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="nm-team-1-area pt-115 wa-p-relative pb-110 tx-section">
      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}

      <div className="container nm-container-1">
        <div className="nm-team-1-sec-title mb-100">
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
          {on(settings.enable_description) && (
            <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
          )}
        </div>

        <div className="nm-team-1-slider wa-p-relative" ref={sliderRef}>
          <Swiper
            modules={[Navigation]}
            onSwiper={(s) => (swiperRef.current = s)}
            loop
            speed={800}
            breakpoints={{
              0: { slidesPerView: 1, centeredSlides: false },
              576: { slidesPerView: 1, centeredSlides: false },
              768: { slidesPerView: 2, centeredSlides: false, spaceBetween: 20 },
              992: { slidesPerView: 2, spaceBetween: 0, centeredSlides: true },
              1200: { slidesPerView: 3, spaceBetween: 0, centeredSlides: true },
            }}
          >
            {members.map((list, i) => (
              <SwiperSlide key={list._id || i}>
                <div className={`nm-team-1-member wa-p-relative wa-fix wa-img-cover ${expanded === i ? "active" : ""}`}>
                  {list.team_image?.url && <img src={list.team_image.url} alt={list.name || ""} />}
                  <div
                    className="toggle-btn nm-h-1"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                  >
                    <ElementorIcon icon={list.share_icon || { value: "fas fa-plus", library: "fa-solid" }} />
                  </div>

                  <div className="content-1">
                    {list.name && (
                      <h5 className="nm-h-1 member-name">
                        <a
                          href={list.link?.url || "#"}
                          target={list.link?.is_external ? "_blank" : "_self"}
                          rel={list.link?.nofollow ? "nofollow" : undefined}
                          dangerouslySetInnerHTML={{ __html: list.name }}
                        />
                      </h5>
                    )}
                    {list.designation && (
                      <p className="nm-p-1 member-dg" dangerouslySetInnerHTML={{ __html: list.designation }} />
                    )}
                  </div>

                  <div className="content-2">
                    {list.name && (
                      <h5 className="nm-h-1 member-name">
                        <a
                          href={list.link?.url || "#"}
                          target={list.link?.is_external ? "_blank" : "_self"}
                          rel={list.link?.nofollow ? "nofollow" : undefined}
                          dangerouslySetInnerHTML={{ __html: list.name }}
                        />
                      </h5>
                    )}
                    {list.designation && (
                      <p className="nm-p-1 member-dg" dangerouslySetInnerHTML={{ __html: list.designation }} />
                    )}
                    {on(list.enable_social_links) && (
                      <div className="social-link">
                        {(list.social_links || []).map((s: any, si: number) => (
                          <a
                            key={s._id || si}
                            className="link-elm"
                            href={s.social_link?.url || "#"}
                            target={s.social_link?.is_external ? "_blank" : "_self"}
                            rel={s.social_link?.nofollow ? "nofollow" : undefined}
                            aria-label="social link"
                          >
                            <ElementorIcon icon={s.social_icon} />
                          </a>
                        ))}
                      </div>
                    )}
                    {list.description && (
                      <>
                        <div className="hr-line" />
                        <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: list.description }} />
                      </>
                    )}
                    {list.button_text && (
                      <div className="member-btn">
                        <a
                          href={list.link?.url || "#"}
                          target={list.link?.is_external ? "_blank" : "_self"}
                          rel={list.link?.nofollow ? "nofollow" : undefined}
                          className="nm-pr-btn-1 has-v2 wa_magnetic_btn_2"
                        >
                          {list.button_icon?.value && (
                            <span className="icon wa_magnetic_btn_2_elm">
                              <ElementorIcon icon={list.button_icon} />
                              <ElementorIcon icon={list.button_icon} />
                            </span>
                          )}
                          <span className="text" data-back={list.button_text} data-front={list.button_text} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {on(settings.enable_navigation) && (
            <>
              <button
                type="button"
                aria-label="Previous"
                className="nm-slider-btn-1 has-left nm-team-1-slider-btn-1 team1_slider_prev"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <div className="icon wa_magnetic_btn">
                  <i className="fa-solid fa-arrow-left-long" />
                  <i className="fa-solid fa-arrow-left-long" />
                </div>
              </button>
              <button
                type="button"
                aria-label="Next"
                className="nm-slider-btn-1 nm-team-1-slider-btn-2 team1_slider_next"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <div className="icon wa_magnetic_btn">
                  <i className="fa-solid fa-arrow-right-long" />
                  <i className="fa-solid fa-arrow-right-long" />
                </div>
              </button>
            </>
          )}

          <div className="nm-team-1-bg-title">
            {settings.big_title_1 && <h3 className="title-elm nm-h-1 tx-big-title">{settings.big_title_1}</h3>}
            {settings.big_title_2 && <h3 className="title-elm nm-h-1 tx-big-title">{settings.big_title_2}</h3>}
          </div>
        </div>

        {on(settings.enable_button) && (
          <div className="text-center wa-p-relative mt-50">
            <p className="nm-p-1 nm-team-1-all-btn">
              {settings.button_left_text}{" "}
              <a
                href={settings.button_link?.url || "#"}
                target={settings.button_link?.is_external ? "_blank" : "_self"}
                rel={settings.button_link?.nofollow ? "nofollow" : undefined}
                className="link-elm nm-h-1"
              >
                {settings.button_text}
                {on(settings.enable_button_icon) && <ElementorIcon icon={settings.button_icon} />}
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
