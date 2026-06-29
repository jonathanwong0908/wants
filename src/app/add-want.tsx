import { ItemFormFields } from "@/components/wants/item-form-fields";
import { ItemFormScrollView } from "@/components/wants/item-form-scroll-view";
import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { createItem } from "@/db/mutations/items";
import { selectWaitingItems } from "@/db/queries/items";
import { useItemForm } from "@/hooks/use-item-form";
import { useIsPro } from "@/hooks/use-is-pro";
import type { ItemFormValues } from "@/lib/forms/item-form-schema";
import { isAddWantGatedWhenReady } from "@/lib/is-add-want-gated";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ADD_WANT_PORTAL_HOST = "add-want-portal";

export default function AddWantModalScreen() {
  const router = useRouter();
  const isPro = useIsPro();
  const { data: waitingItems } = useLiveQuery(selectWaitingItems());
  const gated = isAddWantGatedWhenReady(isPro, waitingItems);

  useFocusEffect(
    useCallback(() => {
      if (gated === true) {
        router.replace("/paywall" as never);
      }
    }, [gated, router])
  );

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

  const insets = useSafeAreaInsets();
  const { sideOffset, ref, onLayout, style } = useModalPortalRoot();
  const dropdownInsets = {
    top: insets.top,
    bottom: insets.bottom + Math.abs(sideOffset),
    left: 16,
    right: 16,
  };

  if (gated !== false) {
    return null;
  }

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

        <ItemFormScrollView className="flex-1 px-5 pt-4">
          <Form {...methods}>
            <ItemFormFields
              portalHost={ADD_WANT_PORTAL_HOST}
              sideOffset={sideOffset}
              dropdownInsets={dropdownInsets}
              currencyCode={currencyCode}
              autoFocusName
              showDelayField
              isPro={isPro}
            />
          </Form>
        </ItemFormScrollView>
        <PortalHost name={ADD_WANT_PORTAL_HOST} />
      </View>
    </SafeAreaView>
  );
}
