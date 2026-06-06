import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useItemForm } from "@/hooks/use-item-form";
import { THEME } from "@/lib/theme";
import { useRouter } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddWantModalScreen() {
  const router = useRouter();
  const palette = THEME[useColorScheme() === "dark" ? "dark" : "light"];
  // Form provider + field binding come in the next pass.
  const methods = useItemForm();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Button
          variant="outline"
          size="icon"
          onPress={() => router.back()}
          className="pt-1"
        >
          <ChevronDown size={24} color={palette.foreground} strokeWidth={1.5} />
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
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
}
