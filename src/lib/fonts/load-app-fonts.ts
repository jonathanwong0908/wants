import {
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import {
  LibreFranklin_600SemiBold,
  LibreFranklin_700Bold,
  LibreFranklin_800ExtraBold,
} from "@expo-google-fonts/libre-franklin";
import { useFonts } from "expo-font";

export const META_FONT_MEDIUM = "JetBrainsMono_500Medium";
export const META_FONT_BOLD = "JetBrainsMono_700Bold";

export const DISPLAY_FONT_SEMIBOLD = "LibreFranklin_600SemiBold";
export const DISPLAY_FONT_BOLD = "LibreFranklin_700Bold";
export const DISPLAY_FONT_EXTRABOLD = "LibreFranklin_800ExtraBold";

export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    [META_FONT_MEDIUM]: JetBrainsMono_500Medium,
    [META_FONT_BOLD]: JetBrainsMono_700Bold,
    [DISPLAY_FONT_SEMIBOLD]: LibreFranklin_600SemiBold,
    [DISPLAY_FONT_BOLD]: LibreFranklin_700Bold,
    [DISPLAY_FONT_EXTRABOLD]: LibreFranklin_800ExtraBold,
  });

  return loaded;
}
