import { useSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { getOccurrences, Occurrence } from '@/services/api';

const SAMPLE_FALLBACK: Occurrence[] = [
  {
    id: 'f1',
    regionName: 'Amazônia',
    satelliteCode: 'MS-01',
    status: 'QUEIMADA',
    vegetationColor: 'PRETO',
    description: 'Fumaça detectada por algoritmo de IA.',
    detectedAt: new Date().toISOString(),
  },
];

export default function AlertsScreen() {
  const params = useSearchParams();
  const region = (params.region as string) || '';
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Occurrence[] | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getOccurrences();
        if (!mounted) return;
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error || 'Erro desconhecido ao buscar ocorrências.');
          setData(SAMPLE_FALLBACK);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Erro desconhecido');
        setData(SAMPLE_FALLBACK);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [region]);

  const occurrences = (data ?? []).filter((o) => {
    if (!region) return true;
    return o.regionName?.toLowerCase().includes(region.toLowerCase());
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Alertas" subtitle={region ? `Região: ${region}` : 'Todas as regiões'} />

        {loading ? (
          <Loading />
        ) : error ? (
          <ThemedText type="small" themeColor="danger">{error}</ThemedText>
        ) : occurrences.length === 0 ? (
          <ThemedText type="small">Nenhuma ocorrência encontrada.</ThemedText>
        ) : (
          <FlatList
            data={occurrences}
            keyExtractor={(a) => String(a.id)}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{item.status}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{item.regionName} • {item.satelliteCode}</ThemedText>
                    {item.description ? <ThemedText type="small">{item.description}</ThemedText> : null}
                  </View>
                  <ThemedText
                    type="small"
                    themeColor={item.status === 'QUEIMADA' || item.status === 'DESMATAMENTO' ? 'danger' : item.status === 'RISCO' ? 'warning' : 'success'}
                  >
                    {item.status}
                  </ThemedText>
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
});
