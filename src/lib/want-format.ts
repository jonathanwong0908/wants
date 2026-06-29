import {
  CUSTOM_DELAY_OPTION_VALUE,
  DEV_ONE_MINUTE_DELAY_HOURS,
  getDelayOptionsForForm,
} from "@/lib/forms/item-form-schema";

export function formatDelayHours(hours: number): string {
  if (hours === DEV_ONE_MINUTE_DELAY_HOURS) {
    return "1 minute";
  }

  const preset = getDelayOptionsForForm().find(
    (option) => Number(option.value) === hours
  );
  if (preset) {
    return preset.label.replace(" (dev)", "");
  }

  if (hours < 24) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  if (hours % 24 === 0) {
    const days = hours / 24;
    if (days === 30) {
      return "1 month";
    }
    if (days === 28) {
      return "4 weeks";
    }
    if (days === 21) {
      return "3 weeks";
    }
    if (days === 14) {
      return "2 weeks";
    }
    if (days === 7) {
      return "1 week";
    }
    return days === 1 ? "1 day" : `${days} days`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const dayLabel = days === 1 ? "1 day" : `${days} days`;
  const hourLabel = remainingHours === 1 ? "1 hour" : `${remainingHours} hours`;
  return `${dayLabel} ${hourLabel}`;
}

const CUSTOM_DELAY_OPTION = {
  value: CUSTOM_DELAY_OPTION_VALUE,
  label: "Custom…",
} as const;

export function getDelayOptionsForFormWithCustom(includeCustomOption: boolean) {
  const options = getDelayOptionsForForm();
  if (!includeCustomOption) {
    return options;
  }

  return [...options, CUSTOM_DELAY_OPTION];
}

export function getDelayOptionsForValue(
  delayHours: number,
  includeCustomOption = true
) {
  const formOptions = getDelayOptionsForFormWithCustom(includeCustomOption);
  const isPreset = getDelayOptionsForForm().some(
    (option) => Number(option.value) === delayHours
  );
  if (isPreset) {
    return formOptions;
  }

  return [
    ...getDelayOptionsForForm(),
    { value: String(delayHours), label: formatDelayHours(delayHours) },
    ...(includeCustomOption ? [CUSTOM_DELAY_OPTION] : []),
  ];
}
