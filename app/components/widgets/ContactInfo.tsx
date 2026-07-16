import SplitTitle from "@/app/components/shared/SplitTitle";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-contact-info/views/view-1.php
export default function ContactInfo({ settings }: { settings: Settings }) {
  return (
    <section
      className="nm-contact-1-area wa-fix pt-105"
      style={settings.image_1?.url ? { backgroundImage: `url(${settings.image_1.url})` } : undefined}
    >
      <div className="container nm-container-1">
        <div className="nm-contact-1-sec-title mb-55">
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

        <div className="nm-contact-1-wrap wa-p-relative">
          <div className="nm-contact-1-img wa-p-relative wow slideInUp2">
            {settings.image_2?.url && <img src={settings.image_2.url} alt="" />}
            <div className="nm-contact-1-img-location">
              <div className="dot-icon" />
              {settings.image_3?.url && (
                <div className="arrow-icon">
                  <img src={settings.image_3.url} alt="" />
                </div>
              )}
              {settings.image_4?.url && (
                <div className="icon">
                  <img src={settings.image_4.url} alt="" />
                </div>
              )}
            </div>
          </div>

          <div className="nm-contact-1-right">
            <div className="nm-contact-1-social">
              {on(settings.enable_social_links) &&
                (settings.social_links || []).map((list: any, i: number) => (
                  <a
                    key={list._id || i}
                    href={list.social_link?.url || "#"}
                    target={list.social_link?.is_external ? "_blank" : "_self"}
                    rel={list.social_link?.nofollow ? "nofollow" : undefined}
                    aria-label={list.social_title}
                    className="link-elm nm-h-1 wow fadeInRight2"
                    data-wow-delay={`.${i + 1}s`}
                  >
                    {list.social_title}
                    <span className="icon">
                      <ElementorIcon icon={list.social_icon} />
                    </span>
                  </a>
                ))}

              {on(settings.enable_button) && (
                <a
                  href={settings.button_link?.url || "#"}
                  target={settings.button_link?.is_external ? "_blank" : "_self"}
                  rel={settings.button_link?.nofollow ? "nofollow" : undefined}
                  aria-label={settings.button_text}
                  className="link-elm nm-h-1 wow fadeInRight2"
                  data-wow-delay=".5s"
                >
                  {settings.button_text}
                  {on(settings.enable_button_icon) && (
                    <span className="icon">
                      <ElementorIcon icon={settings.button_icon} />
                    </span>
                  )}
                </a>
              )}
            </div>

            {on(settings.enable_contact_info) && (
              <div className="nm-contact-1-info mt-85">
                {(settings.contact_infos || []).map((list: any, i: number) => (
                  <div
                    className="nm-contact-1-info-single wow fadeInRight2"
                    data-wow-delay={i < 3 ? `.${i + 1}s` : undefined}
                    key={list._id || i}
                  >
                    {list.icon?.value && (
                      <div className="icon">
                        <ElementorIcon icon={list.icon} />
                      </div>
                    )}
                    {list.title && <h4 className="nm-h-1 title">{list.title}</h4>}
                    {list.text && <div dangerouslySetInnerHTML={{ __html: list.text }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
