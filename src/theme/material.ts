import { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

/** Material 3 seed colors offered as quick presets. */
export const seedPresets: { name: string; hex: string }[] = [
  { name: "Violet", hex: "#6750A4" },
  { name: "Ocean", hex: "#0061A4" },
  { name: "Forest", hex: "#386A20" },
  { name: "Rose", hex: "#984061" },
  { name: "Amber", hex: "#825500" },
  { name: "Crimson", hex: "#B3261E" },
];

const STORAGE_KEY = "violytra-material-seed";

/** Maps Tailwind shade names onto Material 3 tonal palette tones (dark-theme friendly). */
const shadeToTone: Record<string, number> = {
  "50": 98,
  "100": 95,
  "200": 88,
  "300": 78,
  "400": 68,
  "500": 58,
  "600": 48,
  "700": 38,
  "800": 28,
  "900": 18,
};

/**
 * Generates a Material You tonal palette from a seed color and writes it onto the
 * Tailwind v4 color variables, so every `violet-*` and `fuchsia-*` class follows the theme.
 */
export function applyMaterialTheme(seedHex: string) {
  const theme = themeFromSourceColor(argbFromHex(seedHex));
  const root = document.documentElement.style;
  const primary = theme.palettes.primary;
  const tertiary = theme.palettes.tertiary;

  for (const [shade, tone] of Object.entries(shadeToTone)) {
    root.setProperty(`--color-violet-${shade}`, hexFromArgb(primary.tone(tone)));
    root.setProperty(`--color-fuchsia-${shade}`, hexFromArgb(tertiary.tone(tone)));
  }
  root.setProperty("--md-primary", hexFromArgb(primary.tone(80)));
  root.setProperty("--md-on-primary", hexFromArgb(primary.tone(20)));
  localStorage.setItem(STORAGE_KEY, seedHex);
}

export function getSavedSeed(): string {
  return localStorage.getItem(STORAGE_KEY) ?? seedPresets[0].hex;
}
