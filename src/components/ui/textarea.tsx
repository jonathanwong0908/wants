import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/theme-context';
import { resolveMetaFontStyle } from '@/lib/fonts/resolve-meta-font-style';
import { Platform, TextInput } from 'react-native';

function Textarea({
  className,
  multiline = true,
  numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
  placeholderClassName,
  style,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  const { metaFonts, monoAllText } = useTheme();
  const textareaClassName = cn(
    'text-foreground border-input dark:bg-input/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 text-base shadow-sm shadow-black/5 md:text-sm',
    Platform.select({
      web: 'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed',
    }),
    props.editable === false && 'opacity-50',
    className
  );
  const monoFontStyle = resolveMetaFontStyle(
    metaFonts,
    'default',
    { monoAllText },
    textareaClassName
  );

  return (
    <TextInput
      className={textareaClassName}
      style={[monoFontStyle, style]}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      {...props}
    />
  );
}

export { Textarea };
