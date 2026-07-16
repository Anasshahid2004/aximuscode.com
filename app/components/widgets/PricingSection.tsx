"use client";

import { useState } from "react";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import SplitTitle from "@/app/components/shared/SplitTitle";
import { on, type Settings } from "@/app/lib/types";
import marqueeStyles from "./Brand.module.css";

const MIN_REPEATS = 6;
const SECONDS_PER_ITEM = 7;

const CURRENCY_SYMBOLS: Record<string, string> = {
  dollar: "$",
  euro: "€",
  baht: "฿",
  bdt: "৳",
  franc: "₣",
  krona: "kr",
  lira: "₤",
  peseta: "₧",
  rupee: "₹",
  indian_rupee: "₹",
  shekel: "₪",
  won: "₩",
  yen: "¥",
};

function currencySymbol(list: any) {
  if (list.currency === "custom") return list.currency_custom || "";
  return CURRENCY_SYMBOLS[list.currency || "dollar"] || "$";
}

// Ports tx-pricing-section/views/view-1.php ("Pricing Section", style_1).
// The monthly/yearly toggle ports "price-3-toggle-class" from
// nimo-core.js: clicking the switcher just toggles `.is-active` on itself
// and every `.price-wrap` - nimo-core.css hides/shows the matching price
// line via that class, no JS-side price math needed.
export default function PricingSection({ settings }: { settings: Settings }) {
  const [yearly, setYearly] = useState(false);
  const boxes: any[] = settings.pricing_boxs || [];
  // .nm-price-2-marquee-elm (nimo-core.css) is a flex group holding one
  // full pass of `.single-elm` items, with its own gap/margin-right for
  // spacing between repeats - so each repeat is one -elm block, not one
  // item, unlike Brand/CountBox's flat-item repeat.
  const marqueeItems: any[] = settings.list_items || [];
  const marqueeRepeats = Math.max(MIN_REPEATS, marqueeItems.length ? Math.ceil(12 / marqueeItems.length) : MIN_REPEATS);
  const marqueeGroups = Array.from({ length: marqueeRepeats * 2 }, () => marqueeItems);
  const marqueeDuration = `${marqueeRepeats * marqueeItems.length * SECONDS_PER_ITEM}s`;

  // "SECTION STYLE" > Padding (section-style.php) is a per-instance
  // Elementor style-tab control that overrides the pt-70/pb-130 utility
  // classes with `padding: {{TOP}} {{RIGHT}} {{BOTTOM}} {{LEFT}}` on
  // `.tx-section` - this page's own instance sets 120px top/bottom
  // (taller than the 70px/130px defaults), which is why the "06. Pricing"
  // title sat higher than the original without it.
  const p = settings.service_section_padding;
  const sectionStyle: React.CSSProperties | undefined = p
    ? { padding: `${p.top}${p.unit} ${p.right}${p.unit} ${p.bottom}${p.unit} ${p.left}${p.unit}` }
    : undefined;

  return (
    <section className="nm-price-2-area pt-70 pb-130 wa-p-relative home-2-bg-clr tx-section" style={sectionStyle}>
      {settings.image_1?.url && (
        <div className="home-2-bg-noise" style={{ backgroundImage: `url(${settings.image_1.url})` }} />
      )}
      {settings.image_2?.url && (
        <div className="nm-price-2-bg-shape-1">
          <img className="wa_parallax_shape_2" src={settings.image_2.url} alt="" />
        </div>
      )}
      {settings.image_3?.url && (
        <div className="nm-price-2-bg-shape-2">
          <img className="wa_parallax_shape_2" src={settings.image_3.url} alt="" />
        </div>
      )}

      <div className="container nm-container-2">
        <div className="nm-price-2-sec-title mb-45 fix">
          <div className="left">
            {on(settings.enable_sub_title) && (
              <h6 className="nm-subtitle-2">
                {settings.sub_icon_1?.value && (
                  <span className="icon">
                    <ElementorIcon icon={settings.sub_icon_1} />
                  </span>
                )}
                <span className="text" dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
                <span className="line" />
              </h6>
            )}
            {on(settings.enable_title) && (
              <SplitTitle as="h2" className="tx-title nm-sec-title-2" html={settings.title} />
            )}
          </div>

          <div className="right">
            {on(settings.enable_description) && (
              <p className="nm-p-1 sec-disc wow fadeInRight2" dangerouslySetInnerHTML={{ __html: settings.description }} />
            )}
            {on(settings.enable_tab_switcher) && (
              <div className="nm-price-2-btn-wrap wow fadeInRight2" data-wow-delay=".2s">
                <div
                  className={`nm-price-2-toggle-btn ${yearly ? "is-active" : ""}`}
                  onClick={() => setYearly((v) => !v)}
                >
                  {settings.pricing_text_1 && <button className="nm-h-2 btn-elm">{settings.pricing_text_1}</button>}
                  {settings.pricing_text_2 && <button className="nm-h-2 btn-elm">{settings.pricing_text_2}</button>}
                </div>
                {settings.pricing_discounts && <h6 className="nm-price-2-btn-offer nm-h-1">{settings.pricing_discounts}</h6>}
              </div>
            )}
          </div>
        </div>

        {on(settings.enable_pricing_boxs) && (
          <div className="nm-price-2-wrap">
            {boxes.map((list, i) => (
              <div
                className="nm-price-2-card wow fadeInUp2"
                data-wow-delay={i === 0 ? ".1s" : i === 1 ? ".2s" : undefined}
                key={list._id || i}
              >
                <div className="card-top">
                  <div className="package-x-icon">
                    {list.package_name && <h5 className="nm-h-1 package-name" dangerouslySetInnerHTML={{ __html: list.package_name }} />}
                    {settings.icon_1?.value && (
                      <div className="icon">
                        <ElementorIcon icon={settings.icon_1} />
                      </div>
                    )}
                  </div>

                  <div className={`price-wrap ${yearly ? "is-active" : ""}`}>
                    <h5 className="nm-h-2 price monthly">
                      {currencySymbol(list)}
                      {list.price} <span>{list.price_period}</span>
                    </h5>
                    <h5 className="nm-h-2 price monthly">
                      {currencySymbol(list)}
                      {list.price_year} <span>{list.price_period_year}</span>
                    </h5>
                  </div>

                  {list.price_short_description && (
                    <p className="nm-p-1 package-disc" dangerouslySetInnerHTML={{ __html: list.price_short_description }} />
                  )}
                </div>

                {on(list.enable_button) && (
                  <a
                    href={list.button_link?.url || "#"}
                    target={list.button_link?.is_external ? "_blank" : "_self"}
                    rel={list.button_link?.nofollow ? "nofollow" : undefined}
                    aria-label={list.button_text}
                    className="nm-h-2 card-btn"
                  >
                    {list.button_text}
                    <ElementorIcon icon={list.button_icon} />
                  </a>
                )}

                <div className="card-bottom">
                  {list.feature_heading && (
                    <p className="nm-p-1 card-body-title">
                      <span dangerouslySetInnerHTML={{ __html: list.feature_heading }} />
                      <span />
                    </p>
                  )}
                  {on(list.enable_feature_lists) && list.pricing_description && (
                    <ul className="wa-ul package-features">
                      {String(list.pricing_description)
                        .split("\n")
                        .filter(Boolean)
                        .map((line: string, li: number) => (
                          <li className="nm-p-1" key={li} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {on(settings.enable_moving_text) && (
          <>
            {settings.gallery_heading && (
              <div className="nm-price-2-all-plans mt-55 wow fadeInUp2">
                <div className="ani-line" />
                <h4 className="nm-h-2 title">{settings.gallery_heading}</h4>
                <div className="ani-line has-right" />
              </div>
            )}
            <div className="nm-price-2-marquee-wrap wa-fix mt-50 wow fadeInUp2">
              <div
                className={`nm-price-2-marquee ${marqueeStyles.marquee}`}
                style={{ display: "flex", "--marquee-duration": marqueeDuration } as React.CSSProperties}
              >
                {marqueeGroups.map((group, gi) => (
                  <div className="nm-price-2-marquee-elm" key={gi}>
                    {group.map((list, i) => (
                      <h4 className="nm-h-2 single-elm" key={list._id || i}>
                        {list.info_label}
                        <ElementorIcon icon={list.icon} />
                      </h4>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
