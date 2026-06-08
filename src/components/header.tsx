import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

export function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}> 
      {subtitle ? <ThemedText type="small">{subtitle}</ThemedText> : null}
      {title ? <ThemedText type="title" style={styles.title}>{title}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
});
