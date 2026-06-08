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

  const bgColor =
    variant === 'primary' ? theme.primary : variant === 'secondary' ? theme.backgroundElement : 'transparent';
  const color = variant === 'primary' ? '#fff' : theme.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: bgColor, opacity: pressed ? 0.8 : 1 }, style]}
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
