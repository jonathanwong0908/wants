import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { router } from "expo-router";

const APP_ICON = require("@/assets/images/ios-icon.png");

/** PRD S1 — shared by `/` (first launch) and `/welcome` (deep link). */
export function WelcomeScreen() {
  return (
    <OnboardingScreen
      ctaLabel="Get started"
      onCtaPress={() => router.push("/social-proof")}
      centered
    >
      <OnboardingHeader
        centered
        size="large"
        imageSource={APP_ICON}
        title="Welcome to Wants"
        description="Log what you want, wait before you buy, and watch your savings grow."
        descriptionClassName="max-w-xs"
      />
    </OnboardingScreen>
  );
}
