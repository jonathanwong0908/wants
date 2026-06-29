import { cn } from "@/lib/utils";
import type { ThemeMetaFonts } from "@/lib/themes/types";

const SMALL_TEXT_SIZE = /\btext-(xs|sm)\b/;
const LARGE_TEXT_SIZE =
  /\btext-(base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/;

export type MetaFontTextVariant =
  | "default"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "meta"
  | "metaStrong"
  | null
  | undefined;

function isSmallText(
  variant: MetaFontTextVariant,
  ...classNames: (string | undefined)[]
): boolean {
  const combined = cn(...classNames);

  if (LARGE_TEXT_SIZE.test(combined)) {
    return false;
  }

  if (SMALL_TEXT_SIZE.test(combined)) {
    return true;
  }

  return (
    variant === "muted" ||
    variant === "small" ||
    variant === "meta" ||
    variant === "metaStrong"
  );
}

export function resolveMetaFontStyle(
  metaFonts: ThemeMetaFonts | undefined,
  variant: MetaFontTextVariant,
  ...classNames: (string | undefined)[]
): { fontFamily: string } | undefined {
  if (!metaFonts) {
    return undefined;
  }

  if (variant === "meta") {
    return { fontFamily: metaFonts.medium };
  }

  if (variant === "metaStrong") {
    return { fontFamily: metaFonts.bold };
  }

  if (!isSmallText(variant, ...classNames)) {
    return undefined;
  }

  const combined = cn(...classNames);

  if (combined.includes("font-bold")) {
    return { fontFamily: metaFonts.bold };
  }

  return { fontFamily: metaFonts.medium };
}
