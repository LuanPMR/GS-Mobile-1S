import { Link } from 'expo-router';
import { FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const REGIONS = [
  { id: 'amazonia', name: 'Amazônia', summary: 'Maior cobertura florestal', alerts: 12 },
  { id: 'cerrado', name: 'Cerrado', summary: 'Savanas e cerrado', alerts: 4 },
  { id: 'pantanal', name: 'Pantanal', summary: 'Área alagada', alerts: 2 },
];

export default function RegionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Regiões" subtitle="Áreas monitoradas" />

        <FlatList
          data={REGIONS}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingBottom: Spacing.six }}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold">{item.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{item.summary}</ThemedText>
                </View>

                <Link href={{ pathname: '/alerts', params: { region: item.id } }} asChild>
                  <Pressable style={styles.linkButton}>
                    <ThemedText type="linkPrimary">Ver alertas ({item.alerts})</ThemedText>
                  </Pressable>
                </Link>
              </View>
            </Card>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.four },
  linkButton: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
});
