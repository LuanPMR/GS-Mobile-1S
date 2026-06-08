import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Satellite = { id: number; name: string; region: string };

const SATELLITES: Satellite[] = [
  { id: 1, name: 'MS-01', region: 'Amazônia' },
  { id: 2, name: 'MS-02', region: 'Cerrado' },
  { id: 3, name: 'MS-03', region: 'Pantanal' },
  { id: 4, name: 'MS-04', region: 'Amazônia' },
  { id: 5, name: 'MS-05', region: 'Cerrado' },
  { id: 6, name: 'MS-06', region: 'Pantanal' },
  { id: 7, name: 'MS-07', region: 'Amazônia' },
  { id: 8, name: 'MS-08', region: 'Cerrado' },
];

export default function MonitoringScreen() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setActive((prev) => (prev + 1) % SATELLITES.length), 1400);
    return () => clearInterval(id);
  }, [running]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Monitoramento" subtitle="Status de satélites e alertas" />

        <ThemedText type="subtitle">Minissatélites em operação</ThemedText>

        {loading ? (
          <Loading />
        ) : (
          <>
            <FlatList
              data={SATELLITES}
              keyExtractor={(s) => String(s.id)}
              renderItem={({ item, index }) => (
                <Card style={[styles.card, active === index && { borderWidth: 2, borderColor: theme.warning }]}>
                  <View style={styles.row}>
                    <ThemedText type="smallBold">{item.name}</ThemedText>
                    <ThemedText themeColor="textSecondary">{item.region}</ThemedText>
                  </View>
                  <ThemedText type="small" themeColor={active === index ? 'primary' : 'textSecondary'}>
                    {active === index ? 'Ativo agora' : 'Aguardando'}
                  </ThemedText>
                </Card>
              )}
            />

            <View style={styles.controls}>
              <Button title={running ? 'Parar simulação' : 'Iniciar simulação'} onPress={() => setRunning((r) => !r)} />
            </View>
          </>
        )}
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
  card: {},
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.one },
  controls: { marginTop: Spacing.four, alignItems: 'center' },
});
