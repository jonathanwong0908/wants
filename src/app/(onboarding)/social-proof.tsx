import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";

const SOCIAL_PROOF_SOURCE = "Source: PartnerCentric consumer survey";

/** Onboarding social proof (PRD S2) → How it works (S3). */
export default function OnboardingSocialProofScreen() {
  return (
    <OnboardingScreen
      ctaLabel="Continue"
      onCtaPress={() => router.push("/how-it-works")}
      centered
      footnote={SOCIAL_PROOF_SOURCE}
    >
      <Text className="max-w-sm text-center text-3xl font-bold tracking-tighter leading-8 px-4">
        Around 65% of impulse spenders regret a spur-of-the-moment purchase.
      </Text>
    </OnboardingScreen>
  );
}
