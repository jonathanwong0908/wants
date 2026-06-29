import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/theme-context';
import { resolveMetaFontStyle } from '@/lib/fonts/resolve-meta-font-style';
import * as LabelPrimitive from '@rn-primitives/label';
import { Platform } from 'react-native';

function Label({
  className,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  const { metaFonts, monoAllText } = useTheme();
  const labelClassName = cn(
    'text-foreground text-sm font-medium',
    Platform.select({ web: 'leading-none' }),
    className
  );
  const metaFontStyle = resolveMetaFontStyle(
    metaFonts,
    'default',
    { monoAllText },
    labelClassName
  );

  return (
    <LabelPrimitive.Root
      className={cn(
        'flex select-none flex-row items-center gap-2',
        Platform.select({
          web: 'cursor-default leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        }),
        disabled && 'opacity-50'
      )}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}>
      <LabelPrimitive.Text
        className={labelClassName}
        style={[metaFontStyle, style]}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
