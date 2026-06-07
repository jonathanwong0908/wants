import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useSettings } from "@/contexts/settings-context";
import {
  createItemFormSchema,
  type ItemFormInput,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";

export type UseItemFormOptions = {
  currencyCode?: string;
  defaultDelayHours?: number;
  defaultValues?: Partial<ItemFormInput>;
};

export type UseItemFormReturn = UseFormReturn<
  ItemFormInput,
  unknown,
  ItemFormValues
> & {
  currencyCode: string;
};

export function useItemForm(
  options: UseItemFormOptions = {}
): UseItemFormReturn {
  const settings = useSettings();
  const currencyCode = options.currencyCode ?? settings.currencyCode;
  const defaultDelayHours =
    options.defaultDelayHours ?? settings.defaultDelayHours;

  const schema = useMemo(
    () => createItemFormSchema(currencyCode),
    [currencyCode]
  );

  const form = useForm<ItemFormInput, unknown, ItemFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      price: "",
      delayHours: defaultDelayHours,
      note: "",
      ...options.defaultValues,
    },
  });

  return Object.assign(form, { currencyCode });
}
