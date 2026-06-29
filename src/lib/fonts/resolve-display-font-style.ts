import { cn } from "@/lib/utils";
import type { ThemeDisplayFonts } from "@/lib/themes/types";

import type { MetaFontTextVariant } from "@/lib/fonts/resolve-meta-font-style";

const TITLE_TEXT_SIZE = /\btext-(xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/;
const SMALL_TEXT_SIZE = /\btext-(xs|sm)\b/;

const HEADING_VARIANTS = new Set<MetaFontTextVariant>(["h1", "h2", "h3", "h4"]);

function isTitleText(
  variant: MetaFontTextVariant,
  ...classNames: (string | undefined)[]
): boolean {
  const combined = cn(...classNames);

  if (SMALL_TEXT_SIZE.test(combined)) {
    return false;
  }

  if (HEADING_VARIANTS.has(variant)) {
    return true;
  }

  if (!TITLE_TEXT_SIZE.test(combined)) {
    return false;
  }

  return (
    combined.includes("font-bold") || combined.includes("font-extrabold")
  );
}

function resolveDisplayFontWeight(
  displayFonts: ThemeDisplayFonts,
  variant: MetaFontTextVariant,
  combined: string
): string {
  if (combined.includes("font-extrabold") || variant === "h1") {
    return displayFonts.extrabold;
  }

  if (combined.includes("font-bold")) {
    return displayFonts.bold;
  }

  return displayFonts.semibold;
}

export function resolveDisplayFontStyle(
  displayFonts: ThemeDisplayFonts | undefined,
  variant: MetaFontTextVariant,
  ...classNames: (string | undefined)[]
): { fontFamily: string } | undefined {
  if (!displayFonts) {
    return undefined;
  }

  const combined = cn(...classNames);

  if (!isTitleText(variant, ...classNames)) {
    return undefined;
  }

  return {
    fontFamily: resolveDisplayFontWeight(displayFonts, variant, combined),
  };
}
