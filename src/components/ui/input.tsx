import React from "react";
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<TextInput, TextInputProps>(function Input(
  { className, placeholderClassName, editable, ...props },
  ref
) {
  return (
    <TextInput
      ref={ref}
      className={cn(
        "flex h-12 w-full min-w-0 flex-row items-center rounded-2xl border border-border bg-input px-4 py-1 text-base leading-5 text-foreground shadow-none",
        editable === false && cn("opacity-50"),
        className
      )}
      editable={editable}
      {...props}
    />
  );
});

export { Input };
