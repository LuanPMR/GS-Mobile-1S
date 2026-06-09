import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { AnaliseAmbientalDto, getAnalises, simulateAnalysis } from '@/services/analysisService';
import { getRegions } from '@/services/regionService';
import { getSources } from '@/services/satelliteSourceService';

export default function AnalysisScreen() {
  const [regions, setRegions] = React.useState<any[] | null>(null);
  const [sources, setSources] = React.useState<any[] | null>(null);
  const [analises, setAnalises] = React.useState<AnaliseAmbientalDto[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [simLoading, setSimLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = React.useState<number | null>(null);
  const [selectedSource, setSelectedSource] = React.useState<number | null>(null);
  const [dataCaptura, setDataCaptura] = React.useState<string>(new Date().toISOString());
  const [lastResult, setLastResult] = React.useState<AnaliseAmbientalDto | null>(null);

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rRes, sRes, aRes] = await Promise.all([getRegions(), getSources(), getAnalises()]);
      if (rRes.success && rRes.data) setRegions(rRes.data as any[]);
      else setRegions([]);
      if (sRes.success && sRes.data) setSources(sRes.data as any[]);
      else setSources([]);
      if (aRes.success && aRes.data) setAnalises(aRes.data as AnaliseAmbientalDto[]);
      else setAnalises([]);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar dados');
      setRegions([]);
      setSources([]);
      setAnalises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => loadAll(), 0);
    return () => clearTimeout(t);
  }, [loadAll]);

  const onSimulate = async () => {
    if (!selectedRegion) {
      setError('Selecione uma região');
      return;
    }
    setError(null);
    setSimLoading(true);
    try {
      const res = await simulateAnalysis({ regiaoMonitoradaId: selectedRegion, fonteSatelitalId: selectedSource ?? undefined, dataCaptura });
      if (res.success && res.data) {
        setLastResult(res.data);
        // refresh list
        const list = await getAnalises();
        if (list.success && list.data) setAnalises(list.data as AnaliseAmbientalDto[]);
      } else {
        setError(res.error || 'Falha ao simular análise.');
      }
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido');
    } finally {
      setSimLoading(false);
    }
  };

  function formatDate(d?: string | null) {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Análises" subtitle="Simular e listar análises ambientais" />

        {loading ? (
          <Loading />
        ) : (
          <>
            <Card>
              <ThemedText type="smallBold">Selecionar região</ThemedText>
              <View style={{ marginTop: Spacing.one, marginBottom: Spacing.two }}>
                {(regions ?? []).length === 0 ? (
                  <ThemedText type="small">Nenhuma região disponível.</ThemedText>
                ) : (
                  (regions ?? []).map((r: any) => (
                    <Button key={r.id} title={(r.nome ?? (r as any).Nome) as string} variant={selectedRegion === r.id ? 'primary' : 'secondary'} onPress={() => setSelectedRegion(r.id)} style={{ marginBottom: Spacing.two }} />
                  ))
                )}
              </View>

              <ThemedText type="smallBold">Selecionar fonte satelital</ThemedText>
              <View style={{ marginTop: Spacing.one, marginBottom: Spacing.two }}>
                {(sources ?? []).length === 0 ? (
                  <ThemedText type="small">Nenhuma fonte disponível.</ThemedText>
                ) : (
                  (sources ?? []).map((s: any) => (
                    <Button key={s.id} title={(s.nome ?? (s as any).Nome) as string} variant={selectedSource === s.id ? 'primary' : 'secondary'} onPress={() => setSelectedSource(s.id)} style={{ marginBottom: Spacing.two }} />
                  ))
                )}
              </View>

              <ThemedText type="smallBold">Data de captura</ThemedText>
              <TextInput value={dataCaptura} onChangeText={setDataCaptura} style={styles.input} />

              {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText> : null}

              <View style={{ marginTop: Spacing.four }}>
                <Button title={simLoading ? 'Simulando...' : 'Simular análise'} onPress={onSimulate} loading={simLoading} />
              </View>
            </Card>

            {lastResult ? (
              <Card style={{ marginTop: Spacing.four }}>
                <ThemedText type="smallBold">Resultado da simulação</ThemedText>
                <ThemedText type="small">NDVI médio: {lastResult.ndviMedio.toFixed(3)}</ThemedText>
                <ThemedText type="small">% Vegetação: {lastResult.percentualVegetacao.toFixed(1)}%</ThemedText>
                <ThemedText type="small">% Solo exposto: {lastResult.percentualSoloExposto.toFixed(1)}%</ThemedText>
                <ThemedText type="small">% Área queimada: {lastResult.percentualAreaQueimada.toFixed(1)}%</ThemedText>
                <ThemedText type="small">Classificação: {lastResult.classificacao}</ThemedText>
                <ThemedText type="small">Nível de risco: {lastResult.nivelRisco}</ThemedText>
                <ThemedText type="small">Resumo: {lastResult.resumo}</ThemedText>
                <ThemedText type="caption">Data análise: {formatDate(lastResult.dataAnalise)}</ThemedText>
              </Card>
            ) : null}

            <ThemedText type="subtitle" style={{ marginTop: Spacing.four }}>Análises existentes</ThemedText>
            <ScrollView style={{ marginTop: Spacing.two }} contentContainerStyle={{ gap: Spacing.two }}>
              {(analises ?? []).map((a) => (
                <Card key={a.id}>
                  <ThemedText type="smallBold">Região: {String(a.regiaoMonitoradaId)}</ThemedText>
                  <ThemedText type="small">NDVI médio: {a.ndviMedio.toFixed(3)}</ThemedText>
                  <ThemedText type="small">% Vegetação: {a.percentualVegetacao.toFixed(1)}%</ThemedText>
                  <ThemedText type="small">% Solo exposto: {a.percentualSoloExposto.toFixed(1)}%</ThemedText>
                  <ThemedText type="small">% Área queimada: {a.percentualAreaQueimada.toFixed(1)}%</ThemedText>
                  <ThemedText type="small">Classificação: {a.classificacao}</ThemedText>
                  <ThemedText type="small">Nível de risco: {a.nivelRisco}</ThemedText>
                  <ThemedText type="small">Resumo: {a.resumo}</ThemedText>
                  <ThemedText type="caption">Data análise: {formatDate(a.dataAnalise)}</ThemedText>
                </Card>
              ))}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth },
  input: {
    marginTop: Spacing.one,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
});
