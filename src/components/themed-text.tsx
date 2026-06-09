import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, FontSizes, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code' | 'caption';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && { color: theme.primary, ...styles.linkPrimary },
        type === 'code' && styles.code,
        type === 'caption' && styles.caption,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: FontSizes.small,
    lineHeight: 20,
    fontWeight: '600' as any,
  },
  smallBold: {
    fontSize: FontSizes.small,
    lineHeight: 20,
    fontWeight: '700' as any,
  },
  default: {
    fontSize: FontSizes.base,
    lineHeight: 22,
    fontWeight: '600' as any,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700' as any,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: FontSizes.subtitle,
    lineHeight: 26,
    fontWeight: '700' as any,
  },
  link: {
    lineHeight: 20,
    fontSize: FontSizes.small,
    textDecorationLine: 'underline',
  },
  linkPrimary: {
    lineHeight: 20,
    fontSize: FontSizes.small,
  },
  caption: {
    fontSize: FontSizes.tiny,
    lineHeight: 18,
    color: '#7a8f7e',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' as any }) ?? ('500' as any),
    fontSize: 12,
  },
});
