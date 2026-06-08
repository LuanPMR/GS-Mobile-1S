import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const TEAM = [
  { name: 'Ana Silva', role: 'Pesquisadora' },
  { name: 'Bruno Costa', role: 'Engenheiro de Dados' },
  { name: 'Carla Souza', role: 'Analista de Imagens' },
];

export default function TeamScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Equipe" subtitle="Quem está no projeto" />

        {TEAM.map((m) => (
          <Card key={m.name}>
            <View style={styles.row}>
              <ThemedText type="smallBold">{m.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{m.role}</ThemedText>
            </View>
          </Card>
        ))}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
