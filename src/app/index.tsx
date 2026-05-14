import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { useAppReady } from "@/contexts/app-ready-context";
import { Redirect } from "expo-router";

export default function Index() {
  const { onboardingComplete } = useAppReady();

  if (onboardingComplete) {
    return <Redirect href="/home" />;
  }

  return <WelcomeScreen />;
}
