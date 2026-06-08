import type { items } from "@/db/schema";
import { formatCurrency } from "@/lib/money-format";

type Item = typeof items.$inferSelect;

export function getDeleteWantAlertContent(
  item: Item,
  settingsCurrencyCode: string
): { title: string; message: string } {
  if (item.status === "skipped") {
    const title = "Delete saved want?";

    if (item.currency === settingsCurrencyCode) {
      return {
        title,
        message: `This removes ${formatCurrency(item.price, item.currency)} from your saved total on Home. This can't be undone.`,
      };
    }

    return {
      title,
      message:
        "This removes this decision from your history. It won't change your saved total on Home because it's in a different currency. This can't be undone.",
    };
  }

  return {
    title: "Delete want?",
    message: "This can't be undone.",
  };
}
