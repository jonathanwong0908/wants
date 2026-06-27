import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OnboardingInfoRow } from "@/components/onboarding/onboarding-info-row";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import {
  CreditCard,
  Hourglass,
  LoaderCircle,
  Plus,
  type LucideIcon,
} from "lucide-react-native";
import { Fragment } from "react";
import { View } from "react-native";

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
    <OnboardingScreen
      ctaLabel="Continue"
      onCtaPress={() => router.push("/notification-permission")}
    >
      <OnboardingHeader
        icon={Hourglass}
        title="How it works"
        description="Wants gives you a pause — log what you want, wait, then decide with a clear head."
      />
      <View className="gap-2.5 flex-1">
        {STEPS.map((step, index) => (
          <Fragment key={step.title}>
            <View className="flex-row gap-4">
              <Text className="text-base font-semibold">{index + 1}</Text>
              <OnboardingInfoRow
                className="flex-1"
                title={step.title}
                description={step.description}
                leading={
                  <Icon
                    as={step.icon}
                    size={28}
                    className="mt-0.5 text-card-foreground"
                  />
                }
              />
            </View>
            {index !== STEPS.length - 1 && (
              <Separator className="my-1 border-border pr-8" />
            )}
          </Fragment>
        ))}
      </View>
    </OnboardingScreen>
  );
}
