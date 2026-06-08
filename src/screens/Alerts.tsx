import { useSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type AlertItem = { id: string; region: string; title: string; severity: 'low' | 'medium' | 'high' };

const SAMPLE_ALERTS: AlertItem[] = [
  { id: 'a1', region: 'amazonia', title: 'Fumaça detectada', severity: 'medium' },
  { id: 'a2', region: 'cerrado', title: 'Queimada detectada', severity: 'high' },
  { id: 'a3', region: 'pantanal', title: 'Aumento de temperatura', severity: 'low' },
];

export default function AlertsScreen() {
  const params = useSearchParams();
  const region = (params.region as string) || '';
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const alerts = region ? SAMPLE_ALERTS.filter((a) => a.region === region) : SAMPLE_ALERTS;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Alertas" subtitle={region ? `Região: ${region}` : 'Todas as regiões'} />

        {loading ? (
          <Loading />
        ) : alerts.length === 0 ? (
          <ThemedText type="small">Nenhum alerta recente.</ThemedText>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(a) => a.id}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{item.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{item.region}</ThemedText>
                  </View>
                  <ThemedText type="small" themeColor={item.severity === 'high' ? 'danger' : item.severity === 'medium' ? 'warning' : 'success'}>
                    {item.severity.toUpperCase()}
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
