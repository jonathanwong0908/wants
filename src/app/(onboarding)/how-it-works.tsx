import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import {
  CreditCard,
  LoaderCircle,
  Plus,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    title: "Log it",
    description: "Add the item and wait",
    icon: Plus,
  },
  {
    title: "We remind you",
    description: "We notify you when it's up",
    icon: LoaderCircle,
  },
  {
    title: "Decide",
    description: "Still want it? Buy or skip",
    icon: CreditCard,
  },
];

/** PRD S3 — How it works → Notification permission (S4). */
export default function HowItWorksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4 gap-6">
      <View className="flex-1">
        <View className="justify-end flex-1 gap-3 tracking-tighter">
          <Text className="text-3xl font-bold">How it works</Text>
          <View className="gap-2.5">
            {STEPS.map((step) => (
              <View
                key={step.title}
                className="flex-row items-center gap-2.5 bg-muted rounded-2xl pr-4 pl-3 py-3"
              >
                <View className="h-12 w-12 items-center justify-center bg-white rounded-full">
                  <Icon
                    as={step.icon}
                    size={28}
                    className="mt-0.5 text-foreground"
                  />
                </View>
                <View className="">
                  <Text className="text-base font-semibold">{step.title}</Text>
                  <Text variant="muted" className="text-sm leading-6">
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Button
        className="w-full"
        size="lg"
        onPress={() => {
          router.push("/notification-permission");
        }}
      >
        <Text>Continue</Text>
      </Button>
    </SafeAreaView>
  );
}
