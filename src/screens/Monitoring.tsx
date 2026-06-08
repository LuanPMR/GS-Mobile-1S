import { SafeAreaView, StyleSheet } from 'react-native';

import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function MonitoringScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Monitoramento" subtitle="Status de satélites e alertas" />

        <ThemedText type="subtitle">Visão Geral</ThemedText>
        <ThemedText type="small">Em breve: mapas, deteções por IA e timeline de alertas.</ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
  },
});
