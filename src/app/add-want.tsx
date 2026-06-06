import { FieldContainer, FieldContainerItem } from "@/components/common/field";
import { SelectDropdown } from "@/components/common/select-dropdown";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useItemForm } from "@/hooks/use-item-form";
import {
  DELAY_OPTIONS,
  getCurrencyFractionDigits,
  NOTE_MAX_LENGTH,
  sanitizePriceInput,
} from "@/lib/forms/item-form-schema";
import { THEME } from "@/lib/theme";
import { Separator } from "@rn-primitives/dropdown-menu";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { useRouter } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ADD_WANT_PORTAL_HOST = "add-want-portal";

export default function AddWantModalScreen() {
  const router = useRouter();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  const { currencyCode, ...methods } = useItemForm();
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
        <View className="flex-row items-center justify-between px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            onPress={() => router.back()}
            className="pt-1"
          >
            <ChevronDown
              size={24}
              color={palette.foreground}
              strokeWidth={1.5}
            />
          </Button>
          {/* <Button size="icon" onPress={() => router.back()}>
          <Check size={24} color="#fff" />
        </Button> */}
        </View>

        <ScrollView
          className="flex-1 px-6 pt-4"
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
                    label="Name"
                    placeholder="Enter the name of the item"
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
