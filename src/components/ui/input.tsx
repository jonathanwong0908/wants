import React from "react";
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { useTheme } from "@/contexts/theme-context";
import { resolveMetaFontStyle } from "@/lib/fonts/resolve-meta-font-style";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<TextInput, TextInputProps>(function Input(
  { className, placeholderClassName, editable, style, ...props },
  ref
) {
  const { metaFonts, monoAllText } = useTheme();
  const inputClassName = cn(
    "flex h-12 w-full min-w-0 flex-row items-center rounded-2xl border border-border bg-muted/40 px-4 py-1 text-base leading-5 text-foreground shadow-none",
    editable === false && cn("opacity-50"),
    className
  );
  const monoFontStyle = resolveMetaFontStyle(
    metaFonts,
    "default",
    { monoAllText },
    inputClassName
  );

  return (
    <TextInput
      ref={ref}
      className={inputClassName}
      style={[monoFontStyle, style]}
      editable={editable}
      {...props}
    />
  );
});

export { Input };
