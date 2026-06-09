import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedView } from './themed-view';

type CardProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'elevated';
};

export function Card({ children, style }: CardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }, style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
    // subtle elevation
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: Spacing.one,
  },
});
