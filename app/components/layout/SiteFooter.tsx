import ElementorIcon from "@/app/components/shared/ElementorIcon";
import FireflyAnim from "@/app/components/shared/FireflyAnim";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-footers/views/view-1.php ("Footer 1", the site default per
// demo-data/codestar.json's footer_style option).
export default function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="nm-footer-1-area wa-p-relative wa-fix pt-140 tx-section">
      {settings.image_1?.url && <FireflyAnim backgroundUrl={settings.image_1.url} />}
      {settings.image_2?.url && <FireflyAnim backgroundUrl={settings.image_2.url} variant="right" />}
      <div className="nm-footer-1-container">
        <div className="nm-footer-1-main mb-80">
          <div className="nm-footer-1-widget">
            {settings.footer_logo?.url && (
              <a href="/" aria-label="Nimo" className="nm-footer-1-logo">
                <img src={settings.footer_logo.url} alt="Nimo" />
              </a>
            )}
            {settings.footer_description && (
              <p className="nm-p-1 nm-footer-1-disc">{settings.footer_description}</p>
            )}

            <div className="nm-footer-1-hire">
              {settings.contact_info_text && (
                <a
                  href={settings.contact_info_link?.url || "#"}
                  target={settings.contact_info_link?.is_external ? "_blank" : "_self"}
                  rel={settings.contact_info_link?.nofollow ? "nofollow" : undefined}
                  aria-label={settings.contact_info_text}
                  className="hire-mail nm-p-1"
                >
                  <ElementorIcon icon={settings.contact_info_icon} />
                  {settings.contact_info_text}
                </a>
              )}
              {settings.contact_info_bottom_text && (
                <h4 className="nm-h-1 hire-title btn-split-right">
                  <span />
                  <a
                    href={settings.contact_info_bottom_link?.url || "#"}
                    target={settings.contact_info_bottom_link?.is_external ? "_blank" : "_self"}
                    rel={settings.contact_info_bottom_link?.nofollow ? "nofollow" : undefined}
                  >
                    {settings.contact_info_bottom_text}
                  </a>
                </h4>
              )}
            </div>
          </div>

          {on(settings.enable_link_list_1) && settings.link_list_1_heading && (
            <div className="nm-footer-1-widget">
              <h4 className="widget-title">{settings.link_list_1_heading}</h4>
              <ul className="wa-ul nm-footer-1-menu btn-split-right">
                {(settings.link_list_1 || []).map((list: any, i: number) => (
                  <li className="nm-p-1" key={list._id || i}>
                    <a
                      href={list.link_url?.url || "#"}
                      target={list.link_url?.is_external ? "_blank" : "_self"}
                      rel={list.link_url?.nofollow ? "nofollow" : undefined}
                      aria-label={list.link_text}
                    >
                      {list.link_text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {on(settings.enable_link_list_2) && settings.link_list_2_heading && (
            <div className="nm-footer-1-widget">
              <h4 className="widget-title">{settings.link_list_2_heading}</h4>
              <ul className="wa-ul nm-footer-1-menu btn-split-right">
                {(settings.link_list_2 || []).map((list: any, i: number) => (
                  <li className="nm-p-1" key={list._id || i}>
                    <a
                      href={list.link_url?.url || "#"}
                      target={list.link_url?.is_external ? "_blank" : "_self"}
                      rel={list.link_url?.nofollow ? "nofollow" : undefined}
                      aria-label={list.link_text}
                    >
                      {list.link_text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {on(settings.enable_social_links) && (
            <div className="nm-footer-1-widget">
              {settings.social_links_heading && <h4 className="widget-title">{settings.social_links_heading}</h4>}
              <div className="nm-footer-1-social">
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
            </div>
          )}
        </div>

        <div className="nm-footer-1-bottom wa-p-relative">
          {on(settings.enable_shape_1) && (
            <div className="nm-about-1-line">
              <div className="nm-about-1-line-border wa-no-ani-tf" />
              <div className="nm-about-1-line-plus">
                <span className="plus">+</span>
              </div>
            </div>
          )}
          {on(settings.enable_copyright) && settings.copyright_text && (
            <p
              className="nm-p-1 nm-footer-1-bottom-copyright"
              dangerouslySetInnerHTML={{ __html: settings.copyright_text.replace("copyright-year\"></span>", `copyright-year">${new Date().getFullYear()}</span>`) }}
            />
          )}
          {settings.footer_bottom_right_text && (
            <p
              className="nm-p-1 nm-footer-1-bottom-make"
              dangerouslySetInnerHTML={{ __html: settings.footer_bottom_right_text }}
            />
          )}
          {on(settings.enable_bottom_menu) && (
            <ul className="wa-ul nm-footer-1-bottom-link">
              {(settings.bottom_menu_links || []).map((list: any, i: number) => (
                <li className="nm-p-1" key={list._id || i}>
                  <a
                    href={list.link_url?.url || "#"}
                    target={list.link_url?.is_external ? "_blank" : "_self"}
                    rel={list.link_url?.nofollow ? "nofollow" : undefined}
                    aria-label={list.link_text}
                  >
                    {list.link_text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
