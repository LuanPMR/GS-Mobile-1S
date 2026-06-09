import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { getRegions, RegionDto } from '@/services/regionService';

function formatBioma(b: any) {
  const map: Record<number, string> = { 1: 'Amazônia', 2: 'Cerrado', 3: 'Mata Atlântica', 4: 'Caatinga', 5: 'Pantanal', 6: 'Pampa', 7: 'Outro' };
  if (b == null) return '—';
  if (typeof b === 'number') return map[b] ?? `Bioma ${b}`;
  return String(b);
}

export default function RegionsScreen() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<RegionDto[] | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRegions();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || 'Falha ao carregar regiões.');
        setData([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro desconhecido');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Regiões" subtitle="Áreas monitoradas" />

        {loading ? (
          <Loading />
        ) : error ? (
          <>
            <ThemedText type="small" themeColor="danger">{error}</ThemedText>
            <Button title="Tentar novamente" onPress={load} style={{ marginTop: Spacing.two }} />
          </>
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(r) => String(r.id)}
            contentContainerStyle={{ paddingBottom: Spacing.six }}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{item.nome ?? item.Nome}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{formatBioma(item.bioma ?? item.Bioma)} • {item.estado ?? item.Estado ?? '—'}</ThemedText>
                    <ThemedText type="small">{item.pais ?? item.Pais ?? '—'} • {item.areaKm2 ?? item.AreaKm2 ?? '—'} km²</ThemedText>
                  </View>

                  <Link href={{ pathname: '/alerts', params: { region: String(item.id) } }} asChild>
                    <Pressable style={styles.linkButton}>
                      <ThemedText type="linkPrimary">Ver alertas</ThemedText>
                    </Pressable>
                  </Link>
                </View>
              </Card>
            )}
          />
        )}
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
