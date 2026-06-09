import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function Button({ title, onPress, variant = 'primary', loading, style }: Props) {
  const theme = useTheme();

  let bgColor: string | undefined = undefined;
  let color: string | undefined = undefined;
  let borderWidth = 0;
  let borderColor: string | undefined = undefined;

  if (variant === 'primary') {
    bgColor = theme.primary;
    color = theme.onPrimary ?? '#fff';
  } else if (variant === 'secondary') {
    bgColor = 'transparent';
    color = theme.primary;
    borderWidth = 1;
    borderColor = theme.primary;
  } else {
    // ghost
    bgColor = 'transparent';
    color = theme.text;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor, borderWidth, borderColor, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
      disabled={!!loading}
    >
      <ThemedText style={[styles.text, { color }]}>{loading ? 'Carregando...' : title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
  },
  text: { fontWeight: '700' },
});
