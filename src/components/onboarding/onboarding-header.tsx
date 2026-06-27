import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Image, type ImageSource } from "expo-image";
import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type OnboardingHeaderSize = "default" | "large";

type OnboardingHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  imageSource?: ImageSource;
  imageAccessibilityLabel?: string;
  centered?: boolean;
  size?: OnboardingHeaderSize;
  descriptionClassName?: string;
};

const HEADER_MEDIA_SIZE = {
  default: { container: "h-12 w-12", image: 48, icon: 24 },
  large: { container: "h-16 w-16", image: 64, icon: 28 },
} as const;

export function OnboardingHeader({
  title,
  description,
  icon: IconComponent,
  imageSource,
  imageAccessibilityLabel = "Wants",
  centered = false,
  size = "default",
  descriptionClassName,
}: OnboardingHeaderProps) {
  const mediaSize = HEADER_MEDIA_SIZE[size];

  return (
    <View
      className={cn(size === "large" ? "gap-4" : "gap-3", centered && "items-center")}
    >
      {imageSource ? (
        <View
          className={cn(
            "overflow-hidden rounded-full",
            mediaSize.container
          )}
        >
          <Image
            source={imageSource}
            style={{ width: mediaSize.image, height: mediaSize.image }}
            contentFit="cover"
            accessibilityLabel={imageAccessibilityLabel}
          />
        </View>
      ) : IconComponent ? (
        <View
          className={cn(
            "items-center justify-center bg-muted rounded-full",
            mediaSize.container
          )}
        >
          <Icon
            as={IconComponent}
            size={mediaSize.icon}
            className="text-card-foreground"
          />
        </View>
      ) : null}
      {description ? (
        <View
          className={cn(
            size === "large" ? "gap-1.5" : "gap-1",
            centered && "items-center"
          )}
        >
          <Text
            className={cn(
              "font-bold",
              size === "large" ? "text-3xl" : "text-2xl",
              centered && "text-center"
            )}
          >
            {title}
          </Text>
          <Text
            variant="muted"
            className={cn(
              size === "large" ? "text-lg leading-7" : "text-base leading-6",
              centered && "text-center",
              descriptionClassName
            )}
          >
            {description}
          </Text>
        </View>
      ) : (
        <Text
          className={cn(
            "font-bold",
            size === "large" ? "text-3xl" : "text-2xl",
            centered && "text-center"
          )}
        >
          {title}
        </Text>
      )}
    </View>
  );
}
