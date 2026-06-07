import { ChevronsUpDown } from "lucide-react-native";
import { Fragment } from "react";
import { View } from "react-native";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";

type Props = {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  portalHost?: string;
  sideOffset?: number;
  insets?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
};

export function SelectDropdown({
  label,
  options,
  value,
  onChange,
  portalHost,
  sideOffset,
  insets,
}: Props) {
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {label ? (
          <View className="w-full flex-row items-center justify-between">
            <Text className="">{label}</Text>
            <View className="flex-row items-center gap-2">
              <Text>{selectedLabel}</Text>
              <ChevronsUpDown size={16} color="#9CA3AF" />
            </View>
          </View>
        ) : (
          <View className="flex-row items-center gap-2">
            <Text>{selectedLabel}</Text>
            <ChevronsUpDown size={16} color="#9CA3AF" />
          </View>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl"
        portalHost={portalHost}
        sideOffset={sideOffset}
        insets={insets}
      >
        {options.map((option, index) => (
          <Fragment key={option.value}>
            <DropdownMenuItem onPress={() => onChange(option.value)}>
              <Text className="text-base">{option.label}</Text>
            </DropdownMenuItem>
            {index !== options.length - 1 && <DropdownMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
