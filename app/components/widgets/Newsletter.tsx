import ElementorIcon from "@/app/components/shared/ElementorIcon";
import CounterUp from "@/app/components/shared/CounterUp";
import NewsletterForm from "@/app/components/shared/NewsletterForm";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-newsletter/views/view-1.php ("Newsletter", style_1).
// `newsletter_shortcode` is a Contact Form 7 shortcode in the original -
// see NewsletterForm.tsx for why it's reproduced as a static form.
export default function Newsletter({ settings }: { settings: Settings }) {
  return (
    <section className="nm-trial-2-area wa-p-relative wa-fix pt-90 tx-section">
      {settings.image_1?.url && (
        <div className="home-2-bg-noise" style={{ backgroundImage: `url(${settings.image_1.url})` }} />
      )}

      <div className="container nm-container-2">
        <div className="nm-trial-2-wrap wa-p-relative">
          {settings.image_2?.url && (
            <div className="bg-shape">
              <img src={settings.image_2.url} alt="" />
            </div>
          )}

          <div className="nm-trial-2-sec-title mb-65">
            {on(settings.enable_sub_title) && (
              <h5 className="subtitle nm-p-1">
                <ElementorIcon icon={settings.sub_title_icon} />
                <span dangerouslySetInnerHTML={{ __html: settings.sub_title }} />
              </h5>
            )}
            {on(settings.enable_title) && (
              <h2 className="tx-title nm-sec-title-2" dangerouslySetInnerHTML={{ __html: settings.title }} />
            )}
            {on(settings.enable_description) && (
              <p className="nm-p-1 sec-disc wow fadeInUp2 tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
            )}
          </div>

          {settings.newsletter_shortcode && (
            <div className="nm-trial-2-form wa-p-relative mb-45 wow fadeInUp2">
              <NewsletterForm />
            </div>
          )}

          {on(settings.enable_feature_lists) && (
            <ul className="wa-ul nm-trial-2-list">
              {(settings.feature_lists || []).map((list: any, i: number) => (
                <li className="nm-h-1 wow fadeInRight2" key={list._id || i}>
                  <ElementorIcon icon={list.feature_icon} />
                  {list.feature_text}
                </li>
              ))}
            </ul>
          )}

          {on(settings.enable_count_box) && (
            <div className="nm-trial-2-counter mt-40">
              {(settings.count_boxs || []).map((list: any, i: number) => (
                <div
                  className="nm-trial-2-counter-single wow fadeInRight2"
                  data-wow-delay={i === 0 ? ".1s" : i === 1 ? ".2s" : undefined}
                  key={list._id || i}
                >
                  <h4 className="nm-h-2 number">
                    <CounterUp value={list.count_number} />
                    {list.count_prefix}
                  </h4>
                  {list.count_title && <p className="nm-p-1 disc" dangerouslySetInnerHTML={{ __html: list.count_title }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
