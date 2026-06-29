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

export type ResolveMetaFontOptions = {
  monoAllText?: boolean;
};

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

function resolveMetaFontFamily(
  metaFonts: ThemeMetaFonts,
  variant: MetaFontTextVariant,
  combined: string
): string {
  if (variant === "meta") {
    return metaFonts.medium;
  }

  if (variant === "metaStrong") {
    return metaFonts.bold;
  }

  if (combined.includes("font-extrabold") || variant === "h1") {
    return metaFonts.bold;
  }

  if (combined.includes("font-bold")) {
    return metaFonts.bold;
  }

  return metaFonts.medium;
}

export function resolveMetaFontStyle(
  metaFonts: ThemeMetaFonts | undefined,
  variant: MetaFontTextVariant,
  options: ResolveMetaFontOptions | undefined,
  ...classNames: (string | undefined)[]
): { fontFamily: string } | undefined {
  if (!metaFonts) {
    return undefined;
  }

  const monoAllText = options?.monoAllText ?? false;
  const combined = cn(...classNames);

  if (!monoAllText && !isSmallText(variant, ...classNames)) {
    return undefined;
  }

  return {
    fontFamily: resolveMetaFontFamily(metaFonts, variant, combined),
  };
}
