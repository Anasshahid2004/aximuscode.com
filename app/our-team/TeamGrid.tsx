"use client";

import ElementorIcon from "@/app/components/shared/ElementorIcon";
import SplitTitle from "@/app/components/shared/SplitTitle";
import styles from "./TeamGrid.module.css";

// Member names come through as HTML (they can carry <br> or <span>), which
// is fine inside the card but not as an aria-label.
function stripTags(html?: string): string {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// A dedicated, page-specific design for /our-team - the homepage's
// TeamLists widget (nm-team-1-*) is a 3-at-a-time Swiper teaser, not meant
// to show a full roster. This page instead lays every member out in a
// single responsive grid, so all of them are visible at once.
export default function TeamGrid({
  subTitle,
  title,
  description,
  members,
}: {
  subTitle?: string;
  title?: string;
  description?: string;
  members: any[];
}) {
  return (
    <section className={`${styles.section} tx-section`}>
      <div className="container nm-container-1">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {subTitle && (
              <h6 className="nm-subtitle-1">
                <span className="dot" />
                <span className="text" dangerouslySetInnerHTML={{ __html: subTitle }} />
              </h6>
            )}
            {title && <SplitTitle as="h2" className="tx-title nm-sec-title-1" html={title} />}
          </div>
          {description && (
            <p className={`nm-p-1 ${styles.description}`} dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </div>

        <div className={styles.grid}>
          {members.map((member, i) => (
            // The card is a <div>, not an <a>: each member's social icons are
            // links of their own, and HTML forbids nesting anchors. The
            // browser's parser silently hoists an inner <a> out of its parent,
            // which left the client DOM shaped differently from the server
            // HTML - React reported "In HTML, <a> cannot be a descendant of
            // <a>" and threw away the whole hydrated tree. The member link is
            // now a stretched overlay anchor covering the card, with the
            // socials sitting above it.
            <div className={styles.card} key={member._id || i}>
              {member.team_image?.url && (
                <div className={styles.cardImgWrap}>
                  <img src={member.team_image.url} alt={member.name || ""} />
                </div>
              )}
              <div className={styles.overlay} />
              <a
                href={member.link?.url || "#"}
                className={styles.cardLink}
                aria-label={stripTags(member.name) || "Team member"}
              />
              <div className={styles.content}>
                {member.name && (
                  <h5 className={styles.name} dangerouslySetInnerHTML={{ __html: member.name }} />
                )}
                {member.designation && (
                  <p className={styles.designation} dangerouslySetInnerHTML={{ __html: member.designation }} />
                )}
                {(member.social_links || []).length > 0 && (
                  <div className={styles.socials}>
                    {member.social_links.map((s: any, si: number) => (
                      <a key={s._id || si} href={s.social_link?.url || "#"} aria-label="social link">
                        <ElementorIcon icon={s.social_icon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
