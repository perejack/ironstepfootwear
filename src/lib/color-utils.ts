/** Friendly footwear colour names → CSS values (hex or oklch). */
const ALIASES: Record<string, string> = {
  black: "#1a1a1a",
  charcoal: "#2e2e2e",
  white: "#faf8f4",
  offwhite: "#f5efdf",
  cream: "#efe6d3",
  beige: "#f5e7d0",
  sand: "#e8dcc8",
  tan: "#c9a66b",
  brown: "#5b3a23",
  chocolate: "#3d2314",
  burgundy: "#5a1a2a",
  maroon: "#6b1e2d",
  wine: "#722f37",
  red: "#c44b3f",
  orange: "#e25822",
  terracotta: "#c44b3f",
  rust: "#b7410e",
  gold: "#e8a317",
  mustard: "#e8a317",
  yellow: "#f5c842",
  green: "#2d6a4f",
  olive: "#6b705c",
  sage: "#9caf88",
  navy: "#1a2744",
  blue: "#3d5a80",
  grey: "#9a9a9a",
  gray: "#9a9a9a",
  silver: "#c0c0c0",
  pink: "#e8a0a8",
  coral: "#ff6b4a",
};

const CSS_COLOR_RE =
  /^(#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb\(|rgba\(|hsl\(|hsla\(|oklch\(|oklab\()/i;

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

/** Turn admin text like "burgundy, black, cream" into CSS-ready colour values. */
export function resolveColor(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (CSS_COLOR_RE.test(trimmed)) return trimmed;

  const alias = ALIASES[normalizeKey(trimmed)];
  if (alias) return alias;

  // Pass through CSS named colours (navy, coral, etc.) and multi-word names with spaces
  return trimmed.replace(/\s+/g, " ");
}

export function parseColorList(input: string): string[] {
  return input
    .split(",")
    .map((part) => resolveColor(part))
    .filter(Boolean)
    .slice(0, 10);
}

export function colorPreviewStyle(value: string): { background: string } {
  const resolved = resolveColor(value);
  return { background: resolved || "#e5e5e5" };
}
