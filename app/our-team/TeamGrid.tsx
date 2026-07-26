"use client";

import ElementorIcon from "@/app/components/shared/ElementorIcon";
import SplitTitle from "@/app/components/shared/SplitTitle";
import styles from "./TeamGrid.module.css";

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
            <a href={member.link?.url || "#"} className={styles.card} key={member._id || i}>
              {member.team_image?.url && (
                <div className={styles.cardImgWrap}>
                  <img src={member.team_image.url} alt={member.name || ""} />
                </div>
              )}
              <div className={styles.overlay} />
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
                      <a
                        key={s._id || si}
                        href={s.social_link?.url || "#"}
                        aria-label="social link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ElementorIcon icon={s.social_icon} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
