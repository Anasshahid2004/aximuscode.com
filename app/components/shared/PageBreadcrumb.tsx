// Ports `nimo_breadcrumb()` (inc/layouts/nimo-breadcrumb.php) - a theme-level
// banner hooked onto `nimo_before_main_content`, prepended before every
// non-front page's Elementor content. It's not an Elementor widget, so it
// never showed up in any page's extracted `_elementor_data` tree; each page
// route renders it directly with its own title/breadcrumb trail.
export default function PageBreadcrumb({ title, current }: { title: string; current: string }) {
  return (
    <div
      className="nm-breadcrumb-area wa-p-relative wa-bg-default tx-breadcrumb"
      style={{ backgroundImage: "url(/images/bg-img.webp)" }}
    >
      <div className="container nm-header-1-container">
        <div className="nm-breadcrumb-wrap">
          <h1 className="nm-breadcrumb-title">{title}</h1>
          <div className="nm-breadcrumb-list">
            <a href="/">Home</a>
            <span>{current}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
