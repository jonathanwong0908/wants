import { FieldContainerItem } from "@/components/common/field";
import { Text } from "@/components/ui/text";
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "@/constants/legal-links";
import { openLegalLink } from "@/lib/open-legal-link";
import { Separator } from "@rn-primitives/dropdown-menu";

type LegalLinkTextProps = {
  url: string;
  label: string;
  className?: string;
};

export function LegalLinkText({ url, label, className }: LegalLinkTextProps) {
  return (
    <Text className={className} onPress={() => void openLegalLink(url)}>
      {label}
    </Text>
  );
}

export function LegalLinkSettingsRows() {
  return (
    <>
      <Separator />
      <FieldContainerItem
        onPress={() => void openLegalLink(PRIVACY_POLICY_URL)}
        showChevron={false}
      >
        <Text className="text-base text-foreground">Privacy Policy</Text>
      </FieldContainerItem>
      <Separator />
      <FieldContainerItem
        onPress={() => void openLegalLink(TERMS_OF_USE_URL)}
        showChevron={false}
      >
        <Text className="text-base text-foreground">Terms of Use</Text>
      </FieldContainerItem>
    </>
  );
}

export function PaywallLegalFooter() {
  return (
    <Text variant="muted" className="text-xs leading-4 text-center">
      Lifetime unlock is a one-time purchase. Restore purchases from
      Settings → Purchase if you reinstall.{" "}
      <LegalLinkText
        url={PRIVACY_POLICY_URL}
        label="Privacy Policy"
        className="text-xs text-primary underline"
      />{" "}
      and{" "}
      <LegalLinkText
        url={TERMS_OF_USE_URL}
        label="Terms of Use"
        className="text-xs text-primary underline"
      />
      .
    </Text>
  );
}
