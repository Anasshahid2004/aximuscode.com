import ElementorIcon from "@/app/components/shared/ElementorIcon";
import PrimaryButton from "@/app/components/shared/PrimaryButton";
import FireflyAnim from "@/app/components/shared/FireflyAnim";
import SplitTitle from "@/app/components/shared/SplitTitle";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-about/views/view-1.php
export default function About({ settings }: { settings: Settings }) {
  return (
    <section className="nm-about-1-area wa-p-relative pt-80">
      {on(settings.enable_top_shape) && (
        <div className="nm-about-1-line">
          <div className="nm-about-1-line-border" />
          <div className="nm-about-1-line-plus">
            <span className="plus">+</span>
          </div>
        </div>
      )}

      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}

      <div className="container nm-container-1">
        <div className="nm-about-1-wrap">
          <div className="nm-about-1-left wa-p-relative">
            <div className="nm-about-1-left-content">
              <div className="nm-about-1-sec-title mb-30">
                {on(settings.enable_sub_title) && (
                  <h6 className="nm-subtitle-1">
                    <span className="dot" />
                    <span
                      className="text"
                      dangerouslySetInnerHTML={{ __html: settings.sub_title }}
                    />
                  </h6>
                )}

                {on(settings.enable_title) && (
                  <SplitTitle as="h2" className="tx-title nm-sec-title-1" html={settings.title} />
                )}

                {on(settings.enable_description) && (
                  <p
                    className="nm-p-1 sec-disc tx-description"
                    dangerouslySetInnerHTML={{ __html: settings.description }}
                  />
                )}

                {settings.short_description && (
                  <p
                    className="nm-p-1 sec-disc-2"
                    dangerouslySetInnerHTML={{ __html: settings.short_description }}
                  />
                )}
              </div>

              <div className="inner-div">
                {on(settings.enable_author_box) && (
                  <div className="nm-about-1-author">
                    <div className="nm-about-1-author-img wa-fix wa_add_class">
                      {on(settings.enable_author_shape) && (
                        <>
                          <div className="img-shape-1" />
                          <div className="img-shape-2" />
                          <div className="img-shape-3" />
                        </>
                      )}
                      {settings.author_image?.url && (
                        <div className="main-img wa-fix">
                          <img src={settings.author_image.url} alt={settings.author_name || ""} />
                        </div>
                      )}
                    </div>
                    <div className="nm-about-1-author-content">
                      {settings.author_name && (
                        <h5 className="nm-h-1 author-name">
                          <a
                            href={settings.author_link?.url || "#"}
                            target={settings.author_link?.is_external ? "_blank" : "_self"}
                            rel={settings.author_link?.nofollow ? "nofollow" : undefined}
                            aria-label={settings.author_name}
                          >
                            {settings.author_name}
                          </a>
                        </h5>
                      )}
                      {settings.author_designation && (
                        <p className="nm-p-1 author-dg">{settings.author_designation}</p>
                      )}
                      {on(settings.enable_social_links) && (
                        <div className="author-social">
                          {(settings.social_links || []).map((list: any, i: number) => (
                            <a
                              key={list._id || i}
                              className="link-elm"
                              href={list.social_link?.url || "#"}
                              target={list.social_link?.is_external ? "_blank" : "_self"}
                              rel={list.social_link?.nofollow ? "nofollow" : undefined}
                              aria-label="social link"
                            >
                              <ElementorIcon icon={list.social_icon} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {on(settings.enable_line_shape) && <div className="inner-div-line" />}

                {on(settings.enable_button) && (
                  <PrimaryButton
                    text={settings.button_text}
                    link={settings.button_link}
                    icon={settings.button_icon}
                  />
                )}
              </div>
            </div>

            {settings.image_3?.url && (
              <div className="nm-about-1-left-bg-shape">
                <img src={settings.image_3.url} alt="" />
              </div>
            )}
          </div>

          {on(settings.enable_feature_box) && (
            <div className="nm-about-1-card-wrap wa-p-relative">
              {(settings.feature_boxs || []).map((list: any, i: number) => (
                <div className="a1_card_trigger_elm" key={list._id || i}>
                  <div className="nm-about-1-card">
                    {on(list.enable_icon) && (
                      <span className="icon">
                        {(list.type || "icon") === "icon" ? (
                          <ElementorIcon icon={list.list_icon} />
                        ) : (
                          <img src={list.list_image?.url} alt="" />
                        )}
                      </span>
                    )}
                    {list.f_box_title && (
                      <h4 className="nm-h-1 title">
                        <a
                          href={list.f_box_link?.url || "#"}
                          target={list.f_box_link?.is_external ? "_blank" : "_self"}
                          rel={list.f_box_link?.nofollow ? "nofollow" : undefined}
                          aria-label={list.f_box_title}
                          dangerouslySetInnerHTML={{ __html: list.f_box_title }}
                        />
                      </h4>
                    )}
                    {list.f_box_text && (
                      <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: list.f_box_text }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {on(settings.enable_bottom_shape) && (
        <div className="nm-about-1-line has-v2">
          <div className="nm-about-1-line-border" />
          <div className="nm-about-1-line-plus">
            <span className="plus">+</span>
          </div>
        </div>
      )}
    </section>
  );
}
