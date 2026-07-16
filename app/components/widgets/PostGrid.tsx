"use client";

import { useState } from "react";
import SplitTitle from "@/app/components/shared/SplitTitle";
import FireflyAnim from "@/app/components/shared/FireflyAnim";
import { on, type Settings } from "@/app/lib/types";

// Ports tx-post-grid/views/view-1.php. WP_Query is not available here, so
// the extraction script pre-resolves `settings.resolved_posts` from the
// demo `post` items in the WXR export (respecting the widget's own
// show_post_by:"selected" curated list + per-post image overrides where
// configured, matching the original's WP_Query customization logic).
//
// "hover zoom" here is nimo-core.js's "blog-1-hover-active-class": the
// hovered card grows wider than its siblings, darkens with an overlay, and
// reveals the eye icon - see `.nm-blog-1-item:is(.active)` in
// nimo-core.css. The first card is active by default (matches the theme).
export default function PostGrid({ settings }: { settings: Settings }) {
  const posts: any[] = settings.resolved_posts || [];
  const [active, setActive] = useState(0);

  return (
    <section className="nm-blog-1-area wa-p-relative pt-110 pb-95 tx-section">
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
        <div className="nm-blog-1-sec-title mb-50">
          <div className="left">
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
          {on(settings.enable_description) && (
            <p className="nm-p-1 sec-disc tx-description" dangerouslySetInnerHTML={{ __html: settings.description }} />
          )}
        </div>

        <div className="nm-blog-1-wrap">
          {posts.map((post, i) => (
            <div
              className={`nm-blog-1-item wa_magnetic_btn_2 ${i === active ? "active" : ""}`}
              key={post.id || i}
              onMouseEnter={() => setActive(i)}
            >
              <div className="item-img wa-p-relative wa-fix wa-img-cover">
                {post.image && <img src={post.image} alt={post.title} />}
                <a href={`/blog/${post.slug}`} aria-label={post.title} className="card-btn">
                  <span className="wa_magnetic_btn_2_elm d-block">
                    <i className="flaticon-eye flaticon" />
                  </span>
                </a>
                {post.category && (
                  <div className="card-categories">
                    <span className="link-elm nm-h-1">{post.category}</span>
                  </div>
                )}
              </div>
              <div className="content">
                {post.date && <p className="nm-p-1 item-date">{post.date}</p>}
                <h4 className="nm-h-1 item-title">
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h4>
                {post.excerpt && <p className="nm-p-1 item-disc">{post.excerpt}</p>}
              </div>
            </div>
          ))}
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
