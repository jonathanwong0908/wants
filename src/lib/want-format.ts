import {
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
    return days === 1 ? "1 day" : `${days} days`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const dayLabel = days === 1 ? "1 day" : `${days} days`;
  const hourLabel = remainingHours === 1 ? "1 hour" : `${remainingHours} hours`;
  return `${dayLabel} ${hourLabel}`;
}

export function getDelayOptionsForValue(delayHours: number) {
  const formOptions = getDelayOptionsForForm();
  const isPreset = formOptions.some(
    (option) => Number(option.value) === delayHours
  );
  if (isPreset) {
    return formOptions;
  }

  return [
    ...formOptions,
    { value: String(delayHours), label: formatDelayHours(delayHours) },
  ];
}
