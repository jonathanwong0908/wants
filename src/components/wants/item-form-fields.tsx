import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormField } from "@/components/ui/form";
import {
  DELAY_OPTIONS,
  getCurrencyFractionDigits,
  NOTE_MAX_LENGTH,
  sanitizePriceInput,
  type ItemFormInput,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";
import { Separator } from "@rn-primitives/dropdown-menu";
import { View } from "react-native";
import { useFormContext } from "react-hook-form";

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
  autoFocusName?: boolean;
  showDelayField?: boolean;
  delayOptions?: { label: string; value: string }[];
};

export function ItemFormFields({
  portalHost,
  sideOffset,
  dropdownInsets,
  currencyCode,
  autoFocusName = false,
  showDelayField = true,
  delayOptions = DELAY_OPTIONS,
}: ItemFormFieldsProps) {
  const { control } = useFormContext<ItemFormInput, unknown, ItemFormValues>();
  const allowDecimals = getCurrencyFractionDigits(currencyCode) > 0;

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
                placeholder="Price"
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
                  options={delayOptions}
                  value={String(field.value)}
                  onChange={(value) => field.onChange(Number(value))}
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
              placeholder="Price"
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
    </View>
  );
}
