"use client";

import { useEffect, useRef, useState } from "react";
import PrimaryButton from "@/app/components/shared/PrimaryButton";
import SplitHoverLink from "@/app/components/shared/SplitHoverLink";
import ElementorIcon from "@/app/components/shared/ElementorIcon";
import { on, type Settings } from "@/app/lib/types";

type NavLink = { label: string; href: string; children?: NavLink[] };

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/our-services" },
  { label: "Portfolio", href: "/portfolio" },
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

// Mobile offcanvas nav item - ports "mobile-dropdown-function" from
// nimo-core.js: unlike the desktop dropdown (hover-driven), a submenu here
// only opens on tapping its own `.dropdown-btn` chevron, independent of
// tapping the link itself (which navigates as normal).
function MobileNavItem({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={link.children ? "dropdown" : undefined}>
      <a href={link.href} onClick={onNavigate}>
        {link.label}
      </a>
      {link.children && (
        <>
          <span
            className={`dropdown-btn ${open ? "active" : ""}`}
            onClick={() => setOpen((v) => !v)}
          >
            <i className="fa-solid fa-angle-right" />
          </span>
          <ul className={`dropdown-menu ${open ? "active" : ""}`} style={{ display: open ? "block" : "none" }}>
            {link.children.map((child) => (
              <MobileNavItem key={child.label} link={child} onNavigate={onNavigate} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

// Ports "offcanvas-function" from nimo-core.js: the toggle button only
// added an "active" class to `.wa-overly`/`.offcanvas_box_active` - but
// neither the overlay nor the offcanvas panel itself existed anywhere in
// this rebuild, only the button did, so there was nothing to open. Escape,
// clicking the overlay/close button, or clicking any link inside the panel
// all close it, matching the original 1:1.
function MobileOffcanvas({ settings, open, onClose }: { settings: Settings; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div className={`wa-overly ${open ? "active" : ""}`} onClick={onClose} />
      <div className={`wa-offcanvas-area ${open ? "active" : ""}`}>
        <div className="wa-offcanvas-wrap">
          <div className="wa-offcanvas-top">
            {(settings.mobile_logo?.url || settings.logo?.url) && (
              <a className="wa-offcanvas-top-logo tx-logo" aria-label="Nimo" href="/">
                <img src={settings.mobile_logo?.url || settings.logo?.url} alt="Nimo" />
              </a>
            )}
            <button className="wa-offcanvas-close offcanvas_box_close" aria-label="Close menu" onClick={onClose}>
              <span />
              <span />
            </button>
          </div>

          <nav className="mobile-main-navigation mb-50 d-block d-xl-none">
            <ul className="wa-ul">
              {NAV_LINKS.map((link) => (
                <MobileNavItem key={link.href} link={link} onNavigate={onClose} />
              ))}
            </ul>
          </nav>

          {settings.gallerys?.length > 0 && (
            <div className="wa-offcanvas-gallery">
              {settings.gallery_heading && <h5 className="wa-offcanvas-gallery-title">{settings.gallery_heading}</h5>}
              <div className="wa-offcanvas-gallery-grid">
                {settings.gallerys.map((img: any) => (
                  <div className="wa-offcanvas-gallery-item wa-fix wa-img-cover" key={img.id}>
                    <img src={img.url} alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {settings.social_links?.length > 0 && (
            <div className="wa-offcanvas-social">
              {settings.social_heading && <h5 className="wa-offcanvas-social-title">{settings.social_heading}</h5>}
              <div className="wa-offcanvas-social-flex d-flex">
                {settings.social_links.map((list: any) => (
                  <a key={list._id} className="wa-offcanvas-social-link" href={list.social_link?.url || "#"} aria-label="social link">
                    <ElementorIcon icon={list.social_icon} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function SiteHeader({ settings }: { settings: Settings }) {
  const headerRef = useRef<HTMLElement>(null);
  useStickyHeader(headerRef);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
              <button
                type="button"
                aria-label="Menu"
                className="nm-offcanvas-btn-1 offcanvas_toggle d-inline-flex d-xl-none"
                onClick={() => setMenuOpen(true)}
              >
                <i className="fa-solid fa-bars" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sibling of <header>, not a child - see nimo-default-header.php.
          Nesting it inside `.wa_sticky_header` meant the sticky-scroll
          `transform: translateY(-190%)` (see useStickyHeader below) that
          hides the header also dragged the open offcanvas panel off-screen
          with it, since a child inherits its parent's transform. */}
      <MobileOffcanvas settings={settings} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
