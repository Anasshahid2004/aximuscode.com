import ElementorIcon from "@/app/components/shared/ElementorIcon";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-hero-section/views/view-1.php
export default function HeroSection({ settings }: { settings: Settings }) {
  return (
    <section className="nm-hero-1-area wa-p-relative wa-fix wa_magnetic_btn_3 wa_add_class tx-section">
      <canvas />

      {settings.image_1?.url && (
        <div className="nm-hero-1-bg-img wa-img-cover wa-fix">
          <img src={settings.image_1.url} alt="" />
        </div>
      )}

      <div className="nm-hero-1-container">
        <div className="nm-hero-1-content">
          {on(settings.enable_title) && (
            <h1
              className="tx-title nm-hero-1-title has-title-1 wa-fix"
              dangerouslySetInnerHTML={{ __html: settings.title }}
            />
          )}
          {on(settings.enable_sub_title) && (
            <h2 className="nm-hero-1-subtitle nm-p-1 wa-fix">
              <span dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
            </h2>
          )}
          {settings.big_title && (
            <h3 className="nm-hero-1-title has-title-2 wa-fix">
              <span dangerouslySetInnerHTML={{ __html: settings.big_title }} />
            </h3>
          )}
        </div>
      </div>

      <div className="nm-hero-1-content-2">
        <div className="nm-hero-1-container">
          <div className="nm-hero-1-content-2-wrap wa-fix">
            {on(settings.enable_video_button) && settings.video_button_link?.url && (
              <div className="plybtn-wrap">
                <a
                  href={settings.video_button_link.url}
                  aria-label="Watch video"
                  className="nm-hero-1-plybtn popup_video"
                >
                  <div className="bg-elm wa-img-cover wa-fix">
                    <video src={settings.video_button_link.url} autoPlay muted loop playsInline />
                  </div>
                  <ElementorIcon icon={settings.video_button_icon} />
                </a>
              </div>
            )}

            {on(settings.enable_description) && (
              <p
                className="nm-p-1 nm-hero-1-disc tx-description"
                dangerouslySetInnerHTML={{ __html: settings.description }}
              />
            )}

            {on(settings.enable_button) && (
              <div className="nm-hero-1-btn">
                <a
                  href={settings.button_link?.url || "#"}
                  target={settings.button_link?.is_external ? "_blank" : "_self"}
                  rel={settings.button_link?.nofollow ? "nofollow" : undefined}
                  aria-label={settings.button_text}
                  className="nm-pr-btn-1 has-v2 wa_magnetic_btn_2"
                >
                  {settings.button_icon?.value && (
                    <span className="icon wa_magnetic_btn_2_elm">
                      <ElementorIcon icon={settings.button_icon} />
                      <ElementorIcon icon={settings.button_icon} />
                    </span>
                  )}
                  {settings.button_text && (
                    <span className="text" data-back={settings.button_text} data-front={settings.button_text} />
                  )}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nm-hero-1-main-img">
        {settings.image_2?.url && <img src={settings.image_2.url} alt="" />}
        {settings.image_3?.url && (
          <img className="wa_magnetic_btn_3_elm" src={settings.image_3.url} alt="" />
        )}
      </div>

      {settings.moving_icon?.value && (
        <div className="nm-hero-1-bg-icon">
          <ElementorIcon icon={settings.moving_icon} />
        </div>
      )}

      {on(settings.enable_social_links) && settings.social_links?.length > 0 && (
        <div className="nm-hero-1-social-position">
          <div className="nm-hero-1-social-border" />
          <div className="nm-hero-1-social-link wa_add_class">
            {settings.social_links.map((list: any, i: number) => (
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
        </div>
      )}
    </section>
  );
}
