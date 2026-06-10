import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { analisarImagemMonitoramento, ImagemAnaliseDto } from '@/services/analysisService';
import { getSources } from '@/services/satelliteSourceService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [sources, setSources] = useState<Satellite[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Image analysis states
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<ImagemAnaliseDto | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    let cancelled = false;

    async function loadSources() {
      setLoading(true);
      setError(null);
      try {
        const res = await getSources();
        if (cancelled) return;
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map<Satellite>((s: any) => ({ id: s.id, name: s.nome ?? (s as any).Nome, region: s.provedor ?? s.tipo ?? '—' }));
          setSources(mapped);
        } else {
          // keep fallback
          setSources(null);
        }
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar fontes satelitais');
        setSources(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSources();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  // Load last saved image analysis from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('nexusverde_last_image_analysis');
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw) as ImagemAnaliseDto;
        setAnalysisData(parsed ?? null);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
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
        ) : error ? (
          <>
            <ThemedText type="small" themeColor="danger">{error}</ThemedText>
            <Button title="Tentar novamente" onPress={() => { setError(null); setLoading(true); (async () => { const r = await getSources(); if (r.success && r.data) setSources(r.data.map((s: any) => ({ id: s.id, name: s.nome ?? (s as any).Nome, region: s.provedor ?? s.tipo ?? '—' }))); else setSources(null); setLoading(false); })(); }} style={{ marginTop: Spacing.two }} />
          </>
        ) : (
          <>
            <Card style={styles.currentCard}>
              <ThemedText type="smallBold">Satélite ativo</ThemedText>
              <ThemedText type="subtitle" style={styles.currentName}>{(sources ?? SATELLITES)[active]?.name ?? SATELLITES[active].name}</ThemedText>

              <View style={styles.metaRow}>
                <ThemedText type="small">Região / Fonte</ThemedText>
                <ThemedText type="smallBold">{(sources ?? SATELLITES)[active]?.region ?? SATELLITES[active].region}</ThemedText>
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
                <ThemedText type="smallBold">{(sources ?? SATELLITES)[(active + 1) % (sources ?? SATELLITES).length]?.name ?? SATELLITES[(active + 1) % SATELLITES.length].name}</ThemedText>
              </View>

              <View style={styles.aiRow}>
                <ThemedText type="smallBold">IA:</ThemedText>
                <ThemedText type="small" style={styles.aiStatus}>{getAiStatus(elapsed / cycleMs)}</ThemedText>
              </View>
            </Card>

            <Card style={{ marginTop: Spacing.four }}>
              <ThemedText type="smallBold">Analisar imagem</ThemedText>
              <ThemedText type="small">Cole a URL da imagem ou selecione do dispositivo.</ThemedText>
              <TextInput value={imageUrlInput} onChangeText={setImageUrlInput} placeholder="https://.../imagem.jpg" style={[styles.input, { marginTop: Spacing.two }]} />
              {analysisError ? <ThemedText type="small" themeColor="danger">{analysisError}</ThemedText> : null}
              <View style={{ marginTop: Spacing.two, flexDirection: 'row', gap: Spacing.two }}>
                <Button title={analysisLoading ? 'Analisando...' : 'Analisar URL'} onPress={async () => {
                  setAnalysisError(null);
                  if (!imageUrlInput) { setAnalysisError('Informe a URL da imagem ou selecione um arquivo.'); return; }
                  setAnalysisLoading(true);
                  try {
                    const res = await analisarImagemMonitoramento(imageUrlInput);
                    if (res.success && res.data) {
                      setAnalysisData(res.data);
                      await AsyncStorage.setItem('nexusverde_last_image_analysis', JSON.stringify(res.data));
                    } else {
                      setAnalysisError(res.error || 'Falha ao analisar imagem.');
                    }
                  } catch (e: any) {
                    setAnalysisError(e?.message || 'Erro desconhecido');
                  } finally { setAnalysisLoading(false); }
                }} style={{ flex: 1 }} loading={analysisLoading} />
                <Button title="Selecionar imagem" onPress={async () => {
                  setAnalysisError(null);
                  setAnalysisLoading(true);
                  try {
                    // Try to dynamically load expo-image-picker if available
                    let pickedUri: string | null = null;
                    try {
                      // eslint-disable-next-line @typescript-eslint/no-var-requires
                      const ImagePicker = require('expo-image-picker');
                      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (!perm.granted) {
                        setAnalysisError('Permissão para acessar imagens negada.');
                      } else {
                        const pick = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
                        // compatibilidade com diferentes versões
                        // @ts-ignore
                        if (pick && (pick.assets?.length ? pick.assets[0].uri : pick.uri)) pickedUri = (pick.assets?.length ? pick.assets[0].uri : pick.uri) as string;
                      }
                    } catch (ie) {
                      setAnalysisError('Seleção de imagem não disponível. Instale expo-image-picker para suporte a arquivos.');
                    }

                    if (!pickedUri) return;
                    const res = await analisarImagemMonitoramento(pickedUri);
                    if (res.success && res.data) {
                      setAnalysisData(res.data);
                      await AsyncStorage.setItem('nexusverde_last_image_analysis', JSON.stringify(res.data));
                    } else {
                      setAnalysisError(res.error || 'Falha ao analisar imagem.');
                    }
                  } catch (e: any) {
                    setAnalysisError(e?.message || 'Erro desconhecido ao selecionar imagem.');
                  } finally { setAnalysisLoading(false); }
                }} style={{ flex: 1 }} />
              </View>
            </Card>

            <ThemedText type="subtitle" style={{ marginTop: Spacing.four }}>Resultado da análise</ThemedText>
            {analysisData ? (
              <Card style={{ marginTop: Spacing.two }}>
                <ThemedText type="smallBold">Área total analisada</ThemedText>
                <ThemedText type="small">{analysisData.areaTotal} ha</ThemedText>

                <ThemedText type="smallBold">Área preservada</ThemedText>
                <ThemedText type="small">{analysisData.areaPreservada} ha</ThemedText>

                <ThemedText type="smallBold">Área desmatada</ThemedText>
                <ThemedText type="small">{analysisData.areaDesmatada} ha</ThemedText>

                <ThemedText type="smallBold">Área queimada</ThemedText>
                <ThemedText type="small">{analysisData.areaQueimada} ha</ThemedText>

                <ThemedText type="smallBold">Área em atenção</ThemedText>
                <ThemedText type="small">{analysisData.areaEmAtencao} ha</ThemedText>

                <ThemedText type="smallBold">% Preservado</ThemedText>
                <ThemedText type="small">{analysisData.percentualPreservado}%</ThemedText>

                <ThemedText type="smallBold">% Risco</ThemedText>
                <ThemedText type="small">{analysisData.percentualRisco}%</ThemedText>

                <ThemedText type="smallBold">Status geral</ThemedText>
                <ThemedText type="small">{analysisData.statusGeral}</ThemedText>

                <ThemedText type="smallBold">Última análise</ThemedText>
                <ThemedText type="small">{(function format(d?: string | null){ if(!d) return '—'; try { return new Date(d).toLocaleString(); }catch{ return d;} })(analysisData.ultimaAnalise)}</ThemedText>

                {analysisData.observacao ? (
                  <>
                    <ThemedText type="smallBold">Observação</ThemedText>
                    <ThemedText type="small">{analysisData.observacao}</ThemedText>
                  </>
                ) : null}
              </Card>
            ) : (
              <Card style={{ marginTop: Spacing.two }}>
                <ThemedText type="small">Nenhuma análise realizada ainda.</ThemedText>
              </Card>
            )}

            <ThemedText type="subtitle">Fila de satélites</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline} contentContainerStyle={styles.timelineContent}>
              {(sources ?? SATELLITES).map((s, i) => (
                <Card key={s.id} style={active === i ? [styles.timelineItem, { borderColor: theme.primary, borderWidth: 2 }] : styles.timelineItem}>
                  <ThemedText type="smallBold">{s.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{s.region}</ThemedText>
                  <ThemedText type="small" themeColor={active === i ? 'primary' : 'textSecondary'}>{active === i ? 'Ativo' : i === (active + 1) % (sources ?? SATELLITES).length ? 'Próximo' : 'Aguardando'}</ThemedText>
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
  input: {
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
});
