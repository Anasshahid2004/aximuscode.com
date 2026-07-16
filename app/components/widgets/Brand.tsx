import type { Settings } from "@/app/lib/types";
import styles from "./Brand.module.css";

// Ports tx-brand/views/view-1.php. The original uses jquery.marquee.min.js
// for the infinite-scroll logo strip; reproduced here with a CSS keyframe
// animation over a doubled logo list instead of pulling in jQuery.
// Repeats the logo set enough times that the doubled-for-looping strip is
// comfortably wider than any viewport, so the CSS marquee's -50% loop point
// never shows a gap; duration scales with the repeat count to keep a
// constant per-logo scroll speed regardless of how few brands are supplied.
const MIN_REPEATS = 6;
const SECONDS_PER_LOGO = 3;

export default function Brand({ settings }: { settings: Settings }) {
  const brands: any[] = settings.brands_image || [];
  const repeats = Math.max(MIN_REPEATS, brands.length ? Math.ceil(12 / brands.length) : MIN_REPEATS);
  const single = Array.from({ length: repeats }, () => brands).flat();
  const logos = [...single, ...single];
  const duration = `${single.length * SECONDS_PER_LOGO}s`;

  return (
    <section
      className="nm-partner-1-area wa-p-relative wa-bg-default mb-80"
      style={settings.image_1?.url ? { backgroundImage: `url(${settings.image_1.url})` } : undefined}
    >
      <div className="nm-partner-1-border" />
      <div className="container nm-container-1">
        <div className="nm-partner-1-wrap">
          {settings.brand_heading && (
            <h6 className="nm-p-1 nm-partner-1-title">
              <span dangerouslySetInnerHTML={{ __html: settings.brand_heading }} />
            </h6>
          )}

          <div className="nm-partner-1-logo-mask wa-fix">
            <div
              className={`nm-partner-1-logo-marquee ${styles.marquee} ${styles.pauseOnHover}`}
              style={{ "--marquee-duration": duration } as React.CSSProperties}
            >
              <div className="nm-partner-1-logo-wrap" style={{ display: "flex" }}>
                {logos.map((brand, i) => (
                  <div className="nm-partner-1-logo" key={i}>
                    <img src={brand.url} alt={brand.alt || ""} />
                    <img src={brand.url} alt={brand.alt || ""} />
                    <img src={brand.url} alt={brand.alt || ""} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
