import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

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
  const [elapsed, setElapsed] = useState(0); // ms within current satellite monitoring window
  const cycleMs = 12_000; // simulated 1 hour -> compressed to 12s for demo
  const tickMs = 500; // progress tick
  const theme = useTheme();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const t = setTimeout(() => setLoading(false), 700);
    return () => {
      mountedRef.current = false;
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + tickMs;
        if (next >= cycleMs) {
          // advance satellite and roll over remainder
          setActive((a) => (a + 1) % SATELLITES.length);
          return next - cycleMs;
        }
        return next;
      });
    }, tickMs);
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
            <Card style={styles.currentCard}>
              <ThemedText type="smallBold">Satélite ativo</ThemedText>
              <ThemedText type="subtitle" style={styles.currentName}>{SATELLITES[active].name}</ThemedText>

              <View style={styles.metaRow}>
                <ThemedText type="small">Região</ThemedText>
                <ThemedText type="smallBold">{SATELLITES[active].region}</ThemedText>
              </View>

              <View style={styles.metaRow}>
                <ThemedText type="small">Tempo estimado de monitoramento</ThemedText>
                <ThemedText type="smallBold">1 hora (simulado)</ThemedText>
              </View>

              <View style={styles.progressWrap}>
                <View style={[styles.progressBar, { backgroundColor: theme.backgroundElement }]}>
                  <View style={[styles.progressFill, { width: `${Math.round((elapsed / cycleMs) * 100)}%`, backgroundColor: theme.primary }]} />
                </View>
                <ThemedText type="small">Tempo restante (simulado): {Math.max(1, Math.round((1 - elapsed / cycleMs) * 60))} min</ThemedText>
              </View>

              <View style={styles.metaRow}>
                <ThemedText type="small">Próximo satélite</ThemedText>
                <ThemedText type="smallBold">{SATELLITES[(active + 1) % SATELLITES.length].name}</ThemedText>
              </View>

              <View style={styles.aiRow}>
                <ThemedText type="smallBold">IA:</ThemedText>
                <ThemedText type="small" style={styles.aiStatus}>{getAiStatus(elapsed / cycleMs)}</ThemedText>
              </View>
            </Card>

            <ThemedText type="subtitle">Fila de satélites</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline} contentContainerStyle={styles.timelineContent}>
              {SATELLITES.map((s, i) => (
                <Card key={s.id} style={[styles.timelineItem, active === i && { borderColor: theme.primary, borderWidth: 2 }]}>
                  <ThemedText type="smallBold">{s.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{s.region}</ThemedText>
                  <ThemedText type="small" themeColor={active === i ? 'primary' : 'textSecondary'}>{active === i ? 'Ativo' : i === (active + 1) % SATELLITES.length ? 'Próximo' : 'Aguardando'}</ThemedText>
                </Card>
              ))}
            </ScrollView>

            <ThemedText type="small" style={styles.explain}>
              Um satélite monitora por cerca de 1 hora (simulado aqui). Depois o próximo assume a varredura e, no final da fila, o primeiro volta ao ciclo.
            </ThemedText>

            <View style={styles.controls}>
              <Button title={running ? 'Parar simulação' : 'Iniciar simulação'} onPress={() => setRunning((r) => !r)} />
            </View>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function getAiStatus(progressFraction: number) {
  if (progressFraction < 0.15) return 'Capturando imagem';
  if (progressFraction < 0.6) return 'Analisando imagem com IA';
  if (progressFraction < 0.9) return 'Gerando relatório';
  return 'Sincronizando dados';
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
  currentCard: { marginTop: Spacing.four, paddingVertical: Spacing.four },
  currentName: { marginTop: Spacing.two },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.two },
  progressWrap: { marginTop: Spacing.four },
  progressBar: { height: 10, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%' },
  aiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.three },
  aiStatus: { marginLeft: Spacing.two },
  timeline: { marginTop: Spacing.four },
  timelineContent: { gap: Spacing.two, paddingHorizontal: Spacing.one },
  timelineItem: { minWidth: 140, marginRight: Spacing.two },
  explain: { marginTop: Spacing.four, textAlign: 'center' },
});
