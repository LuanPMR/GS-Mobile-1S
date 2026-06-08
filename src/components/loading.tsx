import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

export function Loading({ label = 'Carregando...' }: { label?: string }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.primary} />
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: Spacing.two,
  },
});
