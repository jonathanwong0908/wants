import { ScreenBackButton } from "@/components/layout/screen-back-button";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/contexts/settings-context";
import { useSavingsByCurrency } from "@/hooks/use-savings-by-currency";
import { useSavingsStats } from "@/hooks/use-savings-stats";
import { formatCurrency } from "@/lib/money-format";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SavingsByCurrencyRow({
  currency,
  totalSaved,
  skippedCount,
  isSettingsCurrency,
  showYourCurrencyLabel,
}: {
  currency: string;
  totalSaved: number;
  skippedCount: number;
  isSettingsCurrency: boolean;
  showYourCurrencyLabel: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4 px-4 py-3">
      <View className="flex-1">
        <Text className="font-medium text-foreground">{currency}</Text>
        {showYourCurrencyLabel && isSettingsCurrency ? (
          <Text variant="muted" className="text-xs">
            Your currency
          </Text>
        ) : null}
      </View>
      <View className="items-end">
        <Text className="tabular-nums font-semibold text-foreground">
          {formatCurrency(totalSaved, currency)}
        </Text>
        <Text variant="muted" className="text-xs">
          {skippedCount} {skippedCount === 1 ? "decision" : "decisions"}
        </Text>
      </View>
    </View>
  );
}

export default function TotalSavedScreen() {
  const { currencyCode } = useSettings();
  const { skippedCount } = useSavingsStats(currencyCode);
  const { rows } = useSavingsByCurrency(currencyCode);

  const hasMultipleCurrencies = rows.length > 1;
  const isEmpty = rows?.length === 0;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 pb-4 pt-2">
        <ScreenBackButton variant="stack" className="mr-1 rounded-full" />
        <Text className="text-xl font-bold text-foreground">Total saved</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="muted" className="mb-4 text-sm">
          across {skippedCount} {skippedCount === 1 ? "decision" : "decisions"}
        </Text>

        {isEmpty ? (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Text variant="muted" className="text-center text-sm">
              Nothing saved yet — skip a want to start.
            </Text>
          </View>
        ) : (
          <View
            className="overflow-hidden rounded-2xl border border-border bg-muted"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {rows.map((row, index) => (
              <View key={row.currency}>
                {index > 0 ? <View className="mx-4 h-px bg-border" /> : null}
                <SavingsByCurrencyRow
                  currency={row.currency}
                  totalSaved={row.totalSaved}
                  skippedCount={row.skippedCount}
                  isSettingsCurrency={row.currency === currencyCode}
                  showYourCurrencyLabel={hasMultipleCurrencies}
                />
              </View>
            ))}
          </View>
        )}

        {!isEmpty ? (
          <Text variant="muted" className="mt-6 text-xs leading-relaxed">
            Savings aren&apos;t combined across currencies. Home shows your
            Settings currency only.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
