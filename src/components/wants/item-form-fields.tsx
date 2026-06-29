import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormField } from "@/components/ui/form";
import { CustomDelayPicker } from "@/components/wants/custom-delay-picker";
import {
  CUSTOM_DELAY_OPTION_VALUE,
  DEFAULT_DELAY_HOURS,
  getCurrencyFractionDigits,
  NOTE_MAX_LENGTH,
  sanitizePriceInput,
  type ItemFormInput,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";
import { getPriceInputPlaceholder } from "@/lib/money-format";
import { pushPaywallRoute } from "@/lib/push-paywall-route";
import { getDelayOptionsForValue } from "@/lib/want-format";
import { Separator } from "@rn-primitives/dropdown-menu";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";

type DropdownInsets = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type ItemFormFieldsProps = {
  portalHost: string;
  sideOffset: number;
  dropdownInsets: DropdownInsets;
  currencyCode: string;
  isPro: boolean;
  autoFocusName?: boolean;
  showDelayField?: boolean;
};

export function ItemFormFields({
  portalHost,
  sideOffset,
  dropdownInsets,
  currencyCode,
  isPro,
  autoFocusName = false,
  showDelayField = true,
}: ItemFormFieldsProps) {
  const { control, setValue } = useFormContext<
    ItemFormInput,
    unknown,
    ItemFormValues
  >();
  const [customPickerVisible, setCustomPickerVisible] = useState(false);
  const allowDecimals = getCurrencyFractionDigits(currencyCode) > 0;
  const pricePlaceholder = getPriceInputPlaceholder(currencyCode);
  const delayHours = useWatch({ control, name: "delayHours" });

  const dropdownOptions = useMemo(
    () => getDelayOptionsForValue(delayHours ?? DEFAULT_DELAY_HOURS, true),
    [delayHours]
  );

  function handleDelayChange(
    value: string,
    onChange: (hours: number) => void
  ) {
    if (value === CUSTOM_DELAY_OPTION_VALUE) {
      if (!isPro) {
        pushPaywallRoute();
        return;
      }

      setCustomPickerVisible(true);
      return;
    }

    onChange(Number(value));
  }

  function handleCustomDelayConfirm(hours: number) {
    setValue("delayHours", hours, { shouldDirty: true, shouldValidate: true });
    setCustomPickerVisible(false);
  }

  return (
    <View className="gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormInput
            {...field}
            autoFocus={autoFocusName}
            label="Name"
            placeholder="Enter the name of the item"
            onBlur={() => {
              field.onBlur();
              field.onChange(field.value.trim());
            }}
          />
        )}
      />
      {showDelayField ? (
        <FieldContainer>
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormInput
                {...field}
                label=""
                placeholder={pricePlaceholder}
                className="rounded-none border-0 bg-transparent"
                numberOnly
                allowDecimal={allowDecimals}
                onChange={(text) =>
                  field.onChange(sanitizePriceInput(text, allowDecimals))
                }
              />
            )}
          />
          <Separator />
          <FormField
            control={control}
            name="delayHours"
            render={({ field }) => (
              <FieldContainerItem>
                <SelectDropdown
                  label="Delay"
                  options={dropdownOptions}
                  value={String(delayHours ?? field.value)}
                  onChange={(value) =>
                    handleDelayChange(value, field.onChange)
                  }
                  portalHost={portalHost}
                  sideOffset={sideOffset}
                  insets={dropdownInsets}
                />
              </FieldContainerItem>
            )}
          />
        </FieldContainer>
      ) : (
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormInput
              {...field}
              label="Price"
              placeholder={pricePlaceholder}
              numberOnly
              allowDecimal={allowDecimals}
              onChange={(text) =>
                field.onChange(sanitizePriceInput(text, allowDecimals))
              }
            />
          )}
        />
      )}
      <FormField
        control={control}
        name="note"
        render={({ field }) => (
          <FormTextarea
            {...field}
            label="Note"
            placeholder="Add an optional note"
            maxLength={NOTE_MAX_LENGTH}
            onBlur={() => {
              field.onBlur();
              field.onChange((field.value ?? "").trim());
            }}
          />
        )}
      />

      <CustomDelayPicker
        visible={customPickerVisible}
        initialDelayHours={delayHours ?? 72}
        onConfirm={handleCustomDelayConfirm}
        onCancel={() => setCustomPickerVisible(false)}
      />
    </View>
  );
}
