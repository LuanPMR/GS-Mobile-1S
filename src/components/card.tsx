import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedView } from './themed-view';

type CardProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'elevated';
};

export function Card({ children, style }: CardProps) {
  return (
    <ThemedView type="backgroundElement" style={[styles.card, style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    // subtle elevation
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: Spacing.one,
  },
});
