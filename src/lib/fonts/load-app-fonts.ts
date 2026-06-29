import {
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";

export const META_FONT_MEDIUM = "JetBrainsMono_500Medium";
export const META_FONT_BOLD = "JetBrainsMono_700Bold";

export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    [META_FONT_MEDIUM]: JetBrainsMono_500Medium,
    [META_FONT_BOLD]: JetBrainsMono_700Bold,
  });

  return loaded;
}
