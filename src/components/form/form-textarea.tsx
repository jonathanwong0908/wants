import React, { ComponentPropsWithoutRef } from "react";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FormTextarea({
  label,
  description,
  onChange,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof Input>, "onChange"> & {
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
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onChangeText={onChange}
        className="min-h-24 h-auto items-start py-3"
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
