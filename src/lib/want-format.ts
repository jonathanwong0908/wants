import {
  DELAY_OPTIONS,
  PRESET_DELAY_HOURS,
} from "@/lib/forms/item-form-schema";

export function formatDelayHours(hours: number): string {
  const preset = DELAY_OPTIONS.find((option) => Number(option.value) === hours);
  if (preset) {
    return preset.label;
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
  const isPreset = (PRESET_DELAY_HOURS as readonly number[]).includes(
    delayHours
  );
  if (isPreset) {
    return DELAY_OPTIONS;
  }

  return [
    ...DELAY_OPTIONS,
    { value: String(delayHours), label: formatDelayHours(delayHours) },
  ];
}
