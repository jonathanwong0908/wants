import React, { ComponentPropsWithoutRef } from "react";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function getNumberKeyboardType(
  numberOnly: boolean | undefined,
  allowDecimal: boolean | undefined
) {
  if (!numberOnly) {
    return "default" as const;
  }
  if (allowDecimal === true) {
    return "decimal-pad" as const;
  }
  if (allowDecimal === false) {
    return "number-pad" as const;
  }
  return "numeric" as const;
}

export function FormInput({
  label,
  description,
  onChange,
  numberOnly,
  allowDecimal,
  autoComplete,
  autoFocus,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof Input>, "onChange"> & {
  numberOnly?: boolean;
  allowDecimal?: boolean;
  label?: string;
  description?: string;
  onChange?: (text: string) => void;
}) {
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  React.useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <FormItem className="gap-2">
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}

      <Input
        ref={inputRef}
        keyboardType={getNumberKeyboardType(numberOnly, allowDecimal)}
        autoComplete={numberOnly ? "off" : autoComplete}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
