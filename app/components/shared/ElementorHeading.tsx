// Generic Elementor core "heading" widget - used by one-off pages built
// with plain Elementor blocks rather than a nimo-core widget (e.g. the
// "Digital Strategy & Marketing" single service post). Elementor normally
// generates a scoped CSS class per widget instance for these "local style"
// typography controls; reproduced here as inline styles instead since we
// don't have Elementor's own CSS-generation pipeline.
export default function ElementorHeading({ settings }: { settings: any }) {
  if (!settings.title) return null;
  const Tag = (settings.header_size || "h2") as keyof React.JSX.IntrinsicElements;

  const style: React.CSSProperties = {};
  if (settings.typography_font_family) style.fontFamily = settings.typography_font_family;
  if (settings.typography_font_size?.size) style.fontSize = `${settings.typography_font_size.size}px`;
  if (settings.typography_font_weight) style.fontWeight = settings.typography_font_weight;
  if (settings.typography_line_height?.size) style.lineHeight = settings.typography_line_height.size;
  if (settings.title_color) style.color = settings.title_color;
  const m = settings._margin;
  if (m) style.margin = `${m.top || 0}${m.unit} ${m.right || 0}${m.unit} ${m.bottom || 0}${m.unit} ${m.left || 0}${m.unit}`;

  return <Tag style={style}>{settings.title}</Tag>;
}
