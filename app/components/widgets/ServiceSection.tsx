import ElementorIcon from "@/app/components/shared/ElementorIcon";
import FireflyAnim from "@/app/components/shared/FireflyAnim";
import SplitTitle from "@/app/components/shared/SplitTitle";
import ScrollPlayVideo from "@/app/components/shared/ScrollPlayVideo";
import CounterUp from "@/app/components/shared/CounterUp";
import PortfolioStackAnimation from "@/app/components/shared/PortfolioStackAnimation";
import StepsScrollAnimation from "@/app/components/shared/StepsScrollAnimation";
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

// style_1 - "Choose Us" bento grid. Ports views/view-1.php
function ChooseUsView({ settings }: { settings: Settings }) {
  return (
    <section className="nm-choose-1-area wa-p-relative pb-95 pt-150 tx-section">
      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}

      <div className="nm-choose-1-container">
        <div className="container nm-container-1">
          <div className="nm-choose-1-sec-title mb-60">
            <div className="left">
              <SectionTitle settings={settings} />
            </div>
            {on(settings.enable_description) && (
              <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
            )}
          </div>
        </div>

        <div className="nm-choose-1-wrap wa-pp-2000">
          {(settings.service_slide_boxs || []).map((list: any, i: number) => {
            const layoutStyle = list.layout_style || "style_1";
            if (layoutStyle === "style_1") {
              return (
                <div className="nm-choose-1-item wow slideRightUp2" key={list._id || i}>
                  <div
                    className="nm-choose-1-handshake wa-bg-default"
                    style={list.image_1?.url ? { backgroundImage: `url(${list.image_1.url})` } : undefined}
                  >
                    {list.image_2?.url && (
                      <div className="handshake-video">
                        <ScrollPlayVideo src={list.image_2.url} />
                      </div>
                    )}
                    <div className="content">
                      {list.title && <h4 className="nm-h-1 title" dangerouslySetInnerHTML={{ __html: list.title }} />}
                      {list.description && <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: list.description }} />}
                    </div>
                  </div>
                </div>
              );
            }
            if (layoutStyle === "style_2") {
              return (
                <div className="nm-choose-1-item wow slideRightUp2" key={list._id || i}>
                  <div className="nm-choose-1-fast wa-p-relative">
                    {list.image_1?.url && (
                      <div className="bg-img wa-fix wa-img-cover">
                        <img src={list.image_1.url} alt="" />
                      </div>
                    )}
                    <div className="content-wrap">
                      {list.icon?.value && (
                        <div className="icon">
                          <ElementorIcon icon={list.icon} />
                        </div>
                      )}
                      {list.title && <h4 className="nm-h-1 title" dangerouslySetInnerHTML={{ __html: list.title }} />}
                    </div>
                  </div>
                </div>
              );
            }
            if (layoutStyle === "style_3") {
              return (
                <div className="nm-choose-1-item wow slideRightUp2" key={list._id || i}>
                  <div className="nm-choose-1-experience">
                    {list.image_1?.url && (
                      <div className="bg-img wa-fix wa-img-cover">
                        <img src={list.image_1.url} alt="" />
                      </div>
                    )}
                    <div className="content-wrap">
                      {list.title && <h4 className="nm-h-1 title" dangerouslySetInnerHTML={{ __html: list.title }} />}
                      {list.description && <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: list.description }} />}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}

          {on(settings.enable_author_box) && (
            <div className="nm-choose-1-item has-2-clm wow slideRightUp2">
              <div
                className="nm-choose-1-testimonial wa-bg-default"
                style={settings.author_shape_image?.url ? { backgroundImage: `url(${settings.author_shape_image.url})` } : undefined}
              >
                <div className="content-wrap">
                  <div className="nm-choose-1-rating">
                    {on(settings.enable_rating) && (
                      <div className="rating-icon">
                        {Array.from({ length: 5 }, (_, i) => (
                          <i
                            key={i}
                            className={i < Number(settings.rating_star) ? "fa-solid fa-star" : "fa-regular fa-star-half-stroke"}
                          />
                        ))}
                      </div>
                    )}
                    {settings.author_info && <p className="nm-p-1 rating-text">{settings.author_info}</p>}
                  </div>
                  <div className="content-wrap-line" />
                  <div className="nm-choose-1-author wa_add_class">
                    {(settings.author_images || []).map((brand: any, i: number) => (
                      <div className="author-img wa-fix wa-img-cover" key={i}>
                        <img src={brand.url} alt={brand.alt || ""} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {on(settings.enable_info_box) && (
            <div className="nm-choose-1-item wow slideRightUp2">
              <div
                className="nm-choose-1-turnaround"
                style={settings.info_image_1?.url ? { backgroundImage: `url(${settings.info_image_1.url})` } : undefined}
              >
                {(settings.info_icon?.value || settings.info_title) && (
                  <h4 className="nm-h-1 title">
                    <ElementorIcon icon={settings.info_icon} />
                    <span dangerouslySetInnerHTML={{ __html: settings.info_title }} />
                  </h4>
                )}
                {settings.info_image_2?.url && (
                  <div className="item-video">
                    <video src={settings.info_image_2.url} autoPlay loop muted />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// style_2 - portfolio/stats grid. Ports views/view-2.php
function PortfolioView({ settings }: { settings: Settings }) {
  return (
    <section className="nm-portfolio-1-area wa-p-relative pt-90 wa-fix tx-section p1_ani_trigger">
      <PortfolioStackAnimation />
      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}

      <div
        className="nm-portfolio-1-top wa-p-relative pb-110 wa-bg-default"
        style={settings.image_3?.url ? { backgroundImage: `url(${settings.image_3.url})` } : undefined}
      >
        <div className="container nm-container-1">
          <div className="nm-portfolio-1-top-wrap">
            <div className="nm-portfolio-1-sec-title mb-30">
              {settings.top_sub_title && (
                <h6 className="nm-subtitle-1 tx-subTitle">
                  <span className="dot" />
                  <span className="text" dangerouslySetInnerHTML={{ __html: settings.top_sub_title }} />
                </h6>
              )}
              {(settings.top_title_1 || settings.top_title_2) && (
                <SplitTitle
                  as="h2"
                  className="nm-sec-title-1"
                  html={`<span>${settings.top_title_1 || ""}</span>${
                    settings.top_title_image?.url ? `<img src="${settings.top_title_image.url}" alt="" />` : ""
                  }<span>${settings.top_title_2 || ""}</span>`}
                />
              )}
              {settings.top_description && (
                <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.top_description }} />
              )}
            </div>

            {on(settings.enable_count_box) && (
              <div className="nm-portfolio-1-top-features">
                {(settings.count_boxs || []).map((list: any, i: number) => (
                  <div className="nm-portfolio-1-top-features-single" key={i}>
                    <h4 className="nm-h-1 title">
                      <CounterUp value={list.count_number} />
                      {list.count_prefix}
                    </h4>
                    {list.count_title && <p className="nm-p-1 disc">{list.count_title}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nm-portfolio-1-bottom pt-65">
        <div className="container nm-container-1">
          <div className="nm-portfolio-1-sec-title-2 mb-65">
            <div className="left">
              <SectionTitle settings={settings} />
            </div>
            {on(settings.enable_description) && (
              <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
            )}
          </div>

          <div className="nm-portfolio-1-item-wrap">
            {(settings.service_slide_boxs || []).map((list: any, i: number) => (
              <div
                className={`nm-portfolio-1-item wa_magnetic_btn_2 ${i < 4 ? `p1_ani_trigger_elm_${i + 1}` : ""}`}
                key={list._id || i}
              >
                <div className="nm-portfolio-1-card wa-p-relative wa-fix wa-img-cover">
                  {list.image_1?.url && <img src={list.image_1.url} alt="" />}
                  {list.icon?.value && (
                    <a href={list.link?.url || "#"} aria-label="link" className="card-btn">
                      <span className="wa_magnetic_btn_2_elm d-block">
                        <ElementorIcon icon={list.icon} />
                      </span>
                    </a>
                  )}
                  {on(list.enable_tags) && (
                    <div className="card-categories" dangerouslySetInnerHTML={{ __html: list.tags }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="nm-portfolio-1-all-btn mt-45">
            {on(settings.enable_shape_2) && (
              <div className="nm-portfolio-1-all-plus wa_add_class">
                <span className="plus">+</span>
              </div>
            )}
            {on(settings.enable_button) && settings.button_text && (
              <a
                href={settings.button_link?.url || "#"}
                target={settings.button_link?.is_external ? "_blank" : "_self"}
                rel={settings.button_link?.nofollow ? "nofollow" : undefined}
                aria-label={settings.button_text}
                className="nm-pr-btn-1 has-v2 wa_magnetic_btn_2 tx-button"
              >
                {settings.button_icon?.value && (
                  <span className="icon wa_magnetic_btn_2_elm">
                    <ElementorIcon icon={settings.button_icon} />
                    <ElementorIcon icon={settings.button_icon} />
                  </span>
                )}
                <span className="text" data-back={settings.button_text} data-front={settings.button_text} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// style_3 - process steps list. Ports views/view-3.php
function StepsView({ settings }: { settings: Settings }) {
  return (
    <div className="nm-steps-1-area wa-p-relative pt-95 pb-130 tx-section">
      <StepsScrollAnimation />
      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}

      <div className="container nm-container-1">
        <div className="nm-steps-1-sec-title text-center mb-55">
          <SectionTitle settings={settings} />
          {on(settings.enable_description) && (
            <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
          )}
        </div>

        <div className="nm-steps-1-wrap">
          {(settings.service_slide_boxs || []).map((list: any, i: number) => (
            <div className="nm-steps-1-card nm_steps1_ani_trigger" key={list._id || i}>
              <div className="left">
                {list.count && <h4 className="nm-h-1 number">{list.count}</h4>}
                <div className="number-line">
                  <div className="number-line-fill" />
                </div>
              </div>
              <div className="content wa-p-relative">
                {list.sub_title && <p className="nm-p-1 date">{list.sub_title}</p>}
                {list.title && <h4 className="nm-h-1 title" dangerouslySetInnerHTML={{ __html: list.title }} />}
                {list.description && <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: list.description }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServiceSection({ settings }: { settings: Settings }) {
  const style = settings.design_style || "style_1";
  if (style === "style_2") return <PortfolioView settings={settings} />;
  if (style === "style_3") return <StepsView settings={settings} />;
  return <ChooseUsView settings={settings} />;
}
