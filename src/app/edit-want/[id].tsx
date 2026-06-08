import { ItemFormFields } from "@/components/wants/item-form-fields";
import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/contexts/settings-context";
import { deleteItem, updateItem } from "@/db/mutations/items";
import { selectItemById } from "@/db/queries/items";
import type { items } from "@/db/schema";
import { useItemForm } from "@/hooks/use-item-form";
import { getDeleteWantAlertContent } from "@/lib/delete-want-alert";
import {
  itemToFormDefaultValues,
  type ItemFormValues,
} from "@/lib/forms/item-form-schema";
import { parseItemId } from "@/lib/parse-item-id";
import { getDelayOptionsForValue } from "@/lib/want-format";
import { PortalHost, useModalPortalRoot } from "@rn-primitives/portal";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const EDIT_WANT_PORTAL_HOST = "edit-want-portal";

type Item = typeof items.$inferSelect;

type EditWantFormProps = {
  item: Item;
};

function EditWantForm({ item }: EditWantFormProps) {
  const router = useRouter();
  const { currencyCode: settingsCurrencyCode } = useSettings();
  const [isDeleting, setIsDeleting] = useState(false);
  const methods = useItemForm({
    currencyCode: item.currency,
    defaultValues: itemToFormDefaultValues(item),
  });
  const { currencyCode, handleSubmit, formState } = methods;
  const { isValid, isSubmitting, isDirty } = formState;
  const isWaiting = item.status === "waiting";

  const insets = useSafeAreaInsets();
  const { sideOffset, ref, onLayout, style } = useModalPortalRoot();
  const dropdownInsets = {
    top: insets.top,
    bottom: insets.bottom + Math.abs(sideOffset),
    left: 16,
    right: 16,
  };

  async function onSubmit(values: ItemFormValues) {
    try {
      await updateItem(item.id, values, {
        currencyCode: item.currency,
        status: item.status,
        createdAt: item.createdAt,
        previousName: item.name,
        previousPrice: item.price,
        previousDelayHours: item.delayHours,
        previousNotifId: item.notifId,
      });
      router.back();
    } catch (error) {
      Alert.alert("Could not save", "Something went wrong. Please try again.");
      console.error("updateItem failed:", error);
    }
  }

  function handleDeletePress() {
    const { title, message } = getDeleteWantAlertContent(
      item,
      settingsCurrencyCode
    );

    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => void performDelete(),
      },
    ]);
  }

  async function performDelete() {
    setIsDeleting(true);
    try {
      await deleteItem(item.id, { notifId: item.notifId });
      router.dismiss(2);
    } catch (error) {
      Alert.alert(
        "Could not delete",
        "Something went wrong. Please try again."
      );
      console.error("deleteItem failed:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <View ref={ref} onLayout={onLayout} style={style} className="flex-1">
      <View className="flex-row items-center justify-between px-5 py-5">
        <ScreenBackButton variant="modal" className="pt-1" />
        <View className="flex-row items-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            accessibilityLabel="Delete want"
            disabled={isDeleting || isSubmitting}
            onPress={handleDeletePress}
          >
            <Trash size={22} color="#fff" strokeWidth={1.5} />
          </Button>
          <Button
            disabled={!isValid || isSubmitting || !isDirty || isDeleting}
            onPress={handleSubmit(onSubmit)}
            className="rounded-full"
          >
            <Text className="text-base font-medium">Save</Text>
          </Button>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Form {...methods}>
          <ItemFormFields
            portalHost={EDIT_WANT_PORTAL_HOST}
            sideOffset={sideOffset}
            dropdownInsets={dropdownInsets}
            currencyCode={currencyCode}
            showDelayField={isWaiting}
            delayOptions={getDelayOptionsForValue(item.delayHours)}
          />
        </Form>
      </ScrollView>
      <PortalHost name={EDIT_WANT_PORTAL_HOST} />
    </View>
  );
}

export default function EditWantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const itemId = parseItemId(id);

  const { data } = useLiveQuery(
    itemId != null ? selectItemById(itemId) : selectItemById(-1)
  );
  const item = itemId != null ? data?.[0] : undefined;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      {item ? (
        <EditWantForm key={item.id} item={item} />
      ) : (
        <View className="flex-1">
          <View className="flex-row items-center px-5 py-5">
            <ScreenBackButton variant="modal" className="pt-1" />
          </View>
          <View className="flex-1 items-center justify-center px-5 py-16">
            <Text className="text-lg font-semibold text-foreground">
              Want not found
            </Text>
            <Text variant="muted" className="mt-2 text-center text-sm">
              This want may have been removed or the link is invalid.
            </Text>
            <Button
              variant="outline"
              className="mt-6 rounded-full"
              onPress={() => router.back()}
            >
              <Text>Go back</Text>
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
