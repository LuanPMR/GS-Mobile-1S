import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

type Level = 'ok' | 'warning' | 'danger';

export function AlertBadge({ level = 'warning', label }: { level?: Level; label: string }) {
  const theme = useTheme();
  const bg = level === 'danger' ? theme.danger : level === 'ok' ? theme.success : theme.warning;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}> 
      <ThemedText style={styles.text}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
});
