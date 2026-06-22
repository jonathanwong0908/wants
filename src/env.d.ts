type AppEnv = "development" | "staging" | "production";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_APP_ENV?: AppEnv;
      EXPO_PUBLIC_POSTHOG_KEY?: string;
      EXPO_PUBLIC_REVENUECAT_IOS_KEY?: string;
      EXPO_PUBLIC_REVENUECAT_ANDROID_KEY?: string;
    }
  }
}

export {};
