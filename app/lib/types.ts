export type Settings = Record<string, any>;

// Elementor only serializes SWITCHER control values that differ from their
// default - and every `enable_*` switch in this theme defaults to "yes".
// So a missing key means "on" (default), and only an explicit "" means the
// author turned it off. Use this instead of `settings.enable_x === "yes"`
// everywhere, or content authored at defaults silently disappears.
export function on(value: unknown): boolean {
  return value !== "";
}

export interface ElementorNode {
  id: string;
  elType: "container" | "widget" | string;
  widgetType?: string;
  settings: Settings;
  elements?: ElementorNode[];
}

export interface LinkValue {
  url?: string;
  is_external?: string;
  nofollow?: string;
}

export interface IconValue {
  value?: string;
  library?: string;
}

export interface ImageValue {
  url?: string;
  id?: number;
  alt?: string;
}
