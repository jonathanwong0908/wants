export type AppEnv = "development" | "preview" | "production";

export const env = {
  appEnv: (process.env.EXPO_PUBLIC_APP_ENV ?? "development") as AppEnv,
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  revenueCatTestKey: process.env.EXPO_PUBLIC_REVENUECAT_TEST_KEY,
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
} as const;

export const isDevelopment = env.appEnv === "development";
export const isPreview = env.appEnv === "preview";
export const isProduction = env.appEnv === "production";
