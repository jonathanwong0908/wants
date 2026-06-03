import React, { ComponentPropsWithoutRef } from "react";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FormInput({
  label,
  description,
  onChange,
  numberOnly,
  ...props
}: ComponentPropsWithoutRef<typeof Input> & {
  numberOnly?: boolean;
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

  return (
    <FormItem className="gap-2">
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}

      <Input
        ref={inputRef}
        keyboardType={numberOnly ? "numeric" : "default"}
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
