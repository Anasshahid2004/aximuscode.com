"use client";

import SplitTitle from "@/app/components/shared/SplitTitle";
import ThinScrollbar from "@/app/components/shared/ThinScrollbar";
import { useEffect, useState } from "react";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import FaqAccordion from "./FaqAccordion";
import FaqContactForm from "@/app/components/shared/FaqContactForm";
import { on, type Settings } from "@/app/lib/types";

function SectionTitle({ settings }: { settings: Settings }) {
  return (
    <>
      {on(settings.enable_sub_title) && (
        <h6 className="nm-subtitle-1 tx-subTitle">
          <span className="dot" />
          <span className="text" dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
        </h6>
      )}
      {on(settings.enable_title) && (
        <SplitTitle as="h2" className="tx-title nm-sec-title-1" html={settings.title} />
      )}
    </>
  );
}

// style_1 - services tab section. Ports views/view-1.php
function ServicesTabs({ settings }: { settings: Settings }) {
  const tabs: any[] = settings.txTab_lists || [];
  const initial = tabs.findIndex((t) => t.is_active === "yes");
  const [active, setActive] = useState(initial === -1 ? 0 : initial);
  // Bootstrap's real tab.js toggles `.active` (display:block/none, instant)
  // and `.show` (the fade/flip-in transition trigger) separately, with
  // `.show` added one frame after `.active` so the browser has a chance to
  // paint the pane's hidden resting state (rotateY(90deg) content card,
  // translateX(-100%) image - see nimo-core.css) before animating away
  // from it. React re-renders on `active` change and paints the "revealed"
  // classes as a single frame with nothing to transition from, so without
  // this two-step lag the switch looks instant instead of the flip-in.
  const [revealed, setRevealed] = useState(true);

  // `setRevealed(false)` must land in the SAME commit as `setActive(i)` -
  // React batches synchronous setState calls from one event handler into a
  // single render, so the browser's first paint after a click already
  // shows the new pane as "active but not revealed" (hidden resting
  // state). Resetting it from a separate useEffect keyed on `active`
  // instead fires *after* that first paint, so the new pane briefly
  // flashes its old (already revealed) state before flipping hidden and
  // back - a flicker instead of a clean entrance.
  function selectTab(i: number) {
    setActive(i);
    setRevealed(false);
  }

  useEffect(() => {
    // A plain timeout is more reliable than requestAnimationFrame here -
    // rAF only fires while the tab is actively compositing, which isn't
    // guaranteed right after a click in every browser/embedding context.
    const id = setTimeout(() => setRevealed(true), 20);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <section className="nm-services-1-area pt-100 pb-100 tx-section">
      <div className="nm-services-1-container">
        <div className="nm-services-1-sec-title mb-40">
          <SectionTitle settings={settings} />
          {on(settings.enable_description) && (
            <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
          )}
        </div>

        <div className="nm-services-1-wrap">
          <ThinScrollbar className="nm-services-1-tabs-btn-scrollbar with-plugin">
            <div className="nm-services-1-tabs-btn" role="tablist">
              {tabs.map((tab, i) => (
                <button
                  key={tab._id || i}
                  className={`nav-link nm-h-1 ${active === i ? "active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => selectTab(i)}
                  dangerouslySetInnerHTML={{ __html: tab.tab_title }}
                />
              ))}
            </div>
          </ThinScrollbar>

          <div className="tab-content nm-services-1-tabs-pane">
            {tabs.map((tab, i) => (
              <div
                className={`tab-pane fade ${active === i ? "active" : ""} ${active === i && revealed ? "show" : ""}`}
                key={tab._id || i}
              >
                <div className="nm-services-1-tabs-pane-single">
                  <div className="content-wrap">
                    {tab.tab_icon?.value && (
                      <div className="item-icon">
                        <ElementorIcon icon={tab.tab_icon} />
                      </div>
                    )}
                    {tab.description_1 && (
                      <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: tab.description_1 }} />
                    )}
                    {on(tab.enable_feature_lists_1) && tab.feature_lists_1 && (
                      <ul className="features-list wa-ul">
                        {String(tab.feature_lists_1)
                          .split("\n")
                          .filter(Boolean)
                          .map((line: string, li: number) => (
                            <li className="nm-h-1" key={li}>
                              {tab.feature_lists_image?.url && <img src={tab.feature_lists_image.url} alt="" />}
                              <span dangerouslySetInnerHTML={{ __html: line }} />
                            </li>
                          ))}
                      </ul>
                    )}
                    {tab.button_text && (
                      <div className="item-btn">
                        <a
                          href={tab.button_link?.url || "#"}
                          target={tab.button_link?.is_external ? "_blank" : "_self"}
                          rel={tab.button_link?.nofollow ? "nofollow" : undefined}
                          aria-label={tab.button_text}
                          className="nm-pr-btn-1 has-v2 wa_magnetic_btn_2"
                        >
                          {tab.button_icon?.value && (
                            <span className="icon wa_magnetic_btn_2_elm">
                              <ElementorIcon icon={tab.button_icon} />
                              <ElementorIcon icon={tab.button_icon} />
                            </span>
                          )}
                          <span className="text" data-back={tab.button_text} data-front={tab.button_text} />
                        </a>
                      </div>
                    )}
                  </div>
                  {tab.tab_image?.url && (
                    <div className="item-img wa-fix wa-img-cover">
                      <img src={tab.tab_image.url} alt="" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// style_2 - FAQ + contact form split section. Ports views/view-2.php.
// The right-hand tab panes all reference the same nested Elementor
// "tx_faq" library template in the source data, so they're rendered
// identically here via <FaqAccordion>.
function FaqTabs({ settings }: { settings: Settings }) {
  const tabs: any[] = settings.txTab_lists || [];
  const initial = tabs.findIndex((t) => t.is_active === "yes");
  const [active, setActive] = useState(initial === -1 ? 0 : initial);
  const current = tabs[active];
  const faqLists = current?.resolved_template?.settings?.faq_lists || [];

  return (
    <section className="nm-faqs-1-area pt-105 wa-p-relative pb-110 tx-section">
      <div className="nm-faqs-1-container">
        <div className="nm-faqs-1-wrap">
          <div className="nm-faqs-1-left wa-p-relative">
            <div className="nm-faqs-1-contact-pin">
              <div className="nm-faqs-1-contact">
                {settings.contact_info_sub_title && (
                  <p className="response nm-p-1">
                    <span className="dot" />
                    <span dangerouslySetInnerHTML={{ __html: settings.contact_info_sub_title }} />
                  </p>
                )}
                {settings.contact_info_title && (
                  <h4 className="nm-h-1 title" dangerouslySetInnerHTML={{ __html: settings.contact_info_title }} />
                )}
                <FaqContactForm />
              </div>
            </div>
            {settings.image_1?.url && (
              <div className="nm-faqs-1-left-bg-shape">
                <img src={settings.image_1.url} alt="" />
              </div>
            )}
          </div>

          <div className="nm-faqs-1-right">
            <div className="nm-team-1-faqs-title mb-40">
              <SectionTitle settings={settings} />
              {on(settings.enable_description) && (
                <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
              )}
            </div>

            <div className="nm-faqs-1-tabs-btn" role="tablist">
              {tabs.map((tab, i) => (
                <button
                  key={tab._id || i}
                  className={`nav-link nm-h-1 ${active === i ? "active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  dangerouslySetInnerHTML={{ __html: tab.tab_title }}
                />
              ))}
              <div className="nm-faqs-1-tabs-btn-line" />
            </div>

            <div className="tab-content nm-faqs-1-tabs-pane mt-50">
              <div className="tab-pane fade show active">
                <div className="nm-faqs-1-tabs-pane-single">
                  <FaqAccordion settings={{ faq_lists: faqLists }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Tabs({ settings }: { settings: Settings }) {
  if (settings.design_style === "style_2") return <FaqTabs settings={settings} />;
  return <ServicesTabs settings={settings} />;
}
