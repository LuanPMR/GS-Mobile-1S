import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Sobre o Nexus Verde</ThemedText>
        <ThemedText type="small" style={{ marginTop: Spacing.two }}>
          Aplicativo móvel da Global Solution para monitoramento ambiental: gerenciamento
          de regiões monitoradas, alertas ambientais e simulação de análises por satélite.
        </ThemedText>

        <ThemedText type="smallBold" style={{ marginTop: Spacing.four }}>Equipe</ThemedText>
        <ThemedText type="small">Mathaus Victor Souza Marcelino — RM: 564146</ThemedText>
        <ThemedText type="small">Luan Peixoto Marins Rocha — RM: 562258</ThemedText>
        <ThemedText type="small">Carlos Alberto Guedes Neto — RM: 566022</ThemedText>
        <ThemedText type="small">Filippo Tolone — RM: 562329</ThemedText>
        <ThemedText type="small">Eduardo Novaes Mollo — RM: 561515</ThemedText>

        <ThemedText type="smallBold" style={{ marginTop: Spacing.four }}>Vídeo demonstrativo</ThemedText>
        <ThemedText type="small">Link: (placeholder) — atualize com o link do vídeo do projeto.</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  content: { padding: Spacing.four, alignItems: 'center' },
  container: { maxWidth: MaxContentWidth, width: '100%', gap: Spacing.two },
});
