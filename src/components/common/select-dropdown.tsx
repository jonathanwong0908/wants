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
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function SelectDropdown({ label, options, value, onChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-muted-foreground/50">{label}</Text>
          <View className="flex-row items-center gap-2">
            <Text>
              {options.find((option) => option.value === value)?.label}
            </Text>
            <ChevronsUpDown size={16} color="#9CA3AF" />
          </View>
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
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
