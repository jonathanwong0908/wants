import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import {
  createItemFormSchema,
  DEFAULT_CURRENCY_CODE,
  DEFAULT_DELAY_HOURS,
  type ItemFormInput,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";

export type UseItemFormOptions = {
  currencyCode?: string;
  defaultDelayHours?: number;
  defaultValues?: Partial<ItemFormInput>;
};

export function useItemForm(
  options: UseItemFormOptions = {}
): UseFormReturn<ItemFormInput, unknown, ItemFormValues> {
  const currencyCode = options.currencyCode ?? DEFAULT_CURRENCY_CODE;
  const defaultDelayHours = options.defaultDelayHours ?? DEFAULT_DELAY_HOURS;

  const schema = useMemo(
    () => createItemFormSchema(currencyCode),
    [currencyCode]
  );

  // TODO: read currencyCode and defaultDelayHours from settings store when available.
  return useForm<ItemFormInput, unknown, ItemFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      price: "",
      delayHours: defaultDelayHours,
      note: "",
      ...options.defaultValues,
    },
  });
}
