import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
  const theme = useTheme();

  return (
    <ThemedView type="surfaceElevated" style={[styles.container, { borderColor: theme.border }]}> 
      <View style={styles.textContainer}>
        {subtitle ? <ThemedText type="small" style={styles.subtitle}>{subtitle}</ThemedText> : null}
        {title ? <ThemedText type="title" style={styles.title}>{title}</ThemedText> : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: Spacing.one,
  },
});
