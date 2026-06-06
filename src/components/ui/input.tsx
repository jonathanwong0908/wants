import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { cn } from "@/lib/utils";

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "flex h-12 w-full min-w-0 flex-row items-center rounded-2xl border border-border bg-input px-4 py-1 text-base leading-5 text-foreground shadow-none",
        props.editable === false && cn("opacity-50"),
        className
      )}
      {...props}
    />
  );
}

export { Input };
