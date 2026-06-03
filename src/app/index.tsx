import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { useAppReady } from "@/contexts/app-ready-context";

import HomeScreen from "./home";

export default function Index() {
  const { onboardingComplete } = useAppReady();

  if (onboardingComplete) {
    return <HomeScreen />;
  }

  return <WelcomeScreen />;
}
