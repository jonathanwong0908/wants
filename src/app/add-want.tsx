import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { createItem } from "@/db/mutations/items";
import { useItemForm } from "@/hooks/use-item-form";
import {
  DELAY_OPTIONS,
  getCurrencyFractionDigits,
  NOTE_MAX_LENGTH,
  sanitizePriceInput,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";
import { Separator } from "@rn-primitives/dropdown-menu";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { useRouter } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ADD_WANT_PORTAL_HOST = "add-want-portal";

export default function AddWantModalScreen() {
  const router = useRouter();
  const methods = useItemForm();
  const { currencyCode, handleSubmit, formState } = methods;
  const { isValid, isSubmitting } = formState;

  async function onSubmit(values: ItemFormValues) {
    try {
      await createItem(values, currencyCode);
      router.back();
    } catch (error) {
      Alert.alert("Could not save", "Something went wrong. Please try again.");
      console.error("createItem failed:", error);
    }
  }
  const allowDecimals = getCurrencyFractionDigits(currencyCode) > 0;
  const insets = useSafeAreaInsets();
  const { sideOffset, ref, onLayout, style } = useModalPortalRoot();
  const dropdownInsets = {
    top: insets.top,
    bottom: insets.bottom + Math.abs(sideOffset),
    left: 16,
    right: 16,
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View ref={ref} onLayout={onLayout} style={style} className="flex-1">
        <View className="flex-row items-center justify-between px-5 py-5">
          <ScreenBackButton variant="modal" className="pt-1" />
          <Button
            disabled={!isValid || isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className="rounded-full"
          >
            <Text className="text-base font-medium">Save</Text>
          </Button>
        </View>

        <ScrollView
          className="flex-1 px-5 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Form {...methods}>
            <View className="gap-4">
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormInput
                    {...field}
                    autoFocus
                    label="Name"
                    placeholder="Enter the name of the item"
                    onBlur={() => {
                      field.onBlur();
                      field.onChange(field.value.trim());
                    }}
                  />
                )}
              />
              <FieldContainer>
                <FormField
                  control={methods.control}
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
                  control={methods.control}
                  name="delayHours"
                  render={({ field }) => (
                    <FieldContainerItem>
                      <SelectDropdown
                        label="Delay"
                        options={DELAY_OPTIONS}
                        value={String(field.value)}
                        onChange={(value) => field.onChange(Number(value))}
                        portalHost={ADD_WANT_PORTAL_HOST}
                        sideOffset={sideOffset}
                        insets={dropdownInsets}
                      />
                    </FieldContainerItem>
                  )}
                />
              </FieldContainer>
              <FormField
                control={methods.control}
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
          </Form>
        </ScrollView>
        <PortalHost name={ADD_WANT_PORTAL_HOST} />
      </View>
    </SafeAreaView>
  );
}
