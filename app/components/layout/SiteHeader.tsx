"use client";

import { useEffect, useRef } from "react";
import PrimaryButton from "@/app/components/shared/PrimaryButton";
import SplitHoverLink from "@/app/components/shared/SplitHoverLink";
import { on, type Settings } from "@/app/lib/types";

type NavLink = { label: string; href: string; children?: NavLink[] };

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  {
    label: "Services",
    href: "/our-services",
    children: [
      { label: "Services", href: "/our-services" },
      { label: "Service Details", href: "/services/digital-strategy-marketing" },
    ],
  },
  {
    label: "Pages",
    href: "/our-team",
    children: [
      {
        label: "Team",
        href: "/our-team",
        // The original's own menu nests both a self-link back to the list
        // page ("Team") and the one team-member detail page ("Alfred
        // Noble") under this dropdown, not just the detail page.
        children: [
          { label: "Team", href: "/our-team" },
          { label: "Alfred Noble", href: "/teams/alfred-noble" },
        ],
      },
      {
        label: "Shop",
        href: "#",
        // WooCommerce Shop/Cart/Checkout/Shop Details are out of scope for
        // this static rebuild (no product data, cart state, or payments)
        // - kept in the nav to match the original's menu structure, but
        // left as placeholder links until the shop itself is built.
        children: [
          { label: "Shop", href: "#" },
          { label: "Shop Details", href: "#" },
          { label: "Cart", href: "#" },
          { label: "Checkout", href: "#" },
        ],
      },
      {
        label: "Blog",
        href: "/blog",
        // Same self-link + detail pattern as Team - "Blog Details" (a
        // single post page) isn't built yet, points at the blog list page
        // for now.
        children: [
          { label: "Blog", href: "/blog" },
          { label: "Blog Details", href: "/blog" },
        ],
      },
      { label: "Price Page", href: "/price-page" },
      { label: "FAQs page", href: "/faqs-page" },
      { label: "Choose Us", href: "/choose-us" },
      { label: "Work Process", href: "/work-process" },
      { label: "Testimonial", href: "/testimonial" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// Ports tx-headers/views/view-1.php ("Header 1", the site default per
// demo-data/codestar.json's header_style option). The original menu is
// pulled dynamically via wp_nav_menu(); reproduced here as a static list
// matching the core pages this rebuild covers.
// Ports "sticky-header-function" from nimo-core.js: the header floats
// absolutely positioned over the hero by default. Once scrolled past its
// own height (+30px), it switches to fixed positioning and hides itself
// off-screen (`.wa_sticky`) - then scrolling back *up* while in that state
// slides it back into view near the top (`.wa_sticky_show`), scrolling
// down hides it again. The CSS (`.wa_sticky_header` and friends in
// nimo-core.css) owns the actual transform/transition; this just tracks
// scroll direction and toggles the two classes, matching the original's
// direct classList approach instead of routing every scroll tick through
// React state/re-renders.
function useStickyHeader(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let lastScrollTop = 0;
    const headerHeight = header.offsetHeight + 30;

    function onScroll() {
      const windowTop = window.scrollY;
      if (windowTop >= headerHeight) {
        header!.classList.add("wa_sticky");
      } else {
        header!.classList.remove("wa_sticky");
        header!.classList.remove("wa_sticky_show");
      }
      if (header!.classList.contains("wa_sticky")) {
        if (windowTop < lastScrollTop) {
          header!.classList.add("wa_sticky_show");
        } else {
          header!.classList.remove("wa_sticky_show");
        }
      }
      lastScrollTop = windowTop;
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}

// Recursive so a dropdown item (e.g. "Team" under "Pages") can itself carry
// a nested dropdown (e.g. "Team Details") - matches the original site's
// menu, which nests a 3rd level under Team/Blog/Shop. nimo-core.css already
// styles `.dropdown-menu li .dropdown-menu` to open to the right of its
// parent item, so this only needed matching markup, not new CSS.
//
// The chevron indicator only comes from an explicit <i> element at the top
// level (see tx-headers/views/view-1.php) - nested dropdown items get theirs
// from a pure-CSS `::before` on `.dropdown-menu li:is(.dropdown) > a`
// (nimo-core.css), so rendering the <i> at every depth would double it up.
function NavItem({ link, depth = 0 }: { link: NavLink; depth?: number }) {
  return (
    <li className={link.children ? "dropdown" : undefined}>
      <SplitHoverLink href={link.href}>
        {link.label}
        {link.children && depth === 0 && <i className="flaticon-down flaticon" />}
      </SplitHoverLink>
      {link.children && (
        <ul className="dropdown-menu">
          {link.children.map((child) => (
            // Keyed by label, not href - placeholder items (Shop's
            // not-yet-built children) share href="#", which would collide
            // as a key.
            <NavItem key={child.label} link={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SiteHeader({ settings }: { settings: Settings }) {
  const headerRef = useRef<HTMLElement>(null);
  useStickyHeader(headerRef);

  return (
    <header ref={headerRef} className="nm-header-1-area tx-header wa_sticky_header">
      <div className="nm-header-1-container">
        <div className="nm-header-1-wrap">
          {settings.logo?.url && (
            <a href="/" aria-label="Nimo" className="tx-logo nm-header-1-logo">
              <img src={settings.logo.url} alt="Nimo" />
            </a>
          )}

          <nav className="nm-main-navigation d-none d-xl-block">
            <ul className="nav navbar-nav btn-split-right" id="main-nav">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.href} link={link} />
              ))}
            </ul>
          </nav>

          <div className="nm-header-1-action-link">
            {on(settings.enable_button) && (
              <PrimaryButton text={settings.button_text} link={settings.button_link} icon={settings.button_icon} />
            )}
            <button type="button" aria-label="Menu" className="nm-offcanvas-btn-1 offcanvas_toggle d-inline-flex d-xl-none">
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
