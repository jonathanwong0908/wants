import { Linking } from "react-native";

export async function openLegalLink(url: string): Promise<void> {
  if (!url) {
    return;
  }

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
}
