import type { Settings } from "@/app/lib/types";
import styles from "./Brand.module.css";

const MIN_REPEATS = 6;
// The original uses jquery.marquee with speed:15 (very slow, px/s) - our
// earlier 3s/item translated to a noticeably faster scroll than that, so
// slow it down to match.
const SECONDS_PER_ITEM = 7;

// Ports tx-count-box/views/view-1.php - an infinite marquee strip of stats.
export default function CountBox({ settings }: { settings: Settings }) {
  const boxes: any[] = settings.count_boxs || [];
  const repeats = Math.max(MIN_REPEATS, boxes.length ? Math.ceil(12 / boxes.length) : MIN_REPEATS);
  const single = Array.from({ length: repeats }, () => boxes).flat();
  const items = [...single, ...single];
  const duration = `${single.length * SECONDS_PER_ITEM}s`;

  return (
    <section className="nm-marquee-1-area wa-fix">
      <div className="nm-marquee-1-active d-block">
        <div
          className={`nm-marquee-1-counter-wrap ${styles.marquee}`}
          style={{ display: "flex", "--marquee-duration": duration } as React.CSSProperties}
        >
          {items.map((list, i) => (
            <div className="nm-marquee-1-counter" key={i}>
              {(list.count_number || list.count_prefix) && (
                <h4 className="nm-h-1 number">
                  {list.count_number}
                  {list.count_prefix}
                </h4>
              )}
              {list.count_description && <p className="nm-p-1 disc">{list.count_description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
