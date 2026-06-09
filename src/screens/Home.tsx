import { Link } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { getPendentes } from '@/services/alertService';
import { getRegions } from '@/services/regionService';
import { getSources } from '@/services/satelliteSourceService';
import React from 'react';

export default function HomeScreen() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [regionsCount, setRegionsCount] = React.useState<number | null>(null);
  const [pendingAlertsCount, setPendingAlertsCount] = React.useState<number | null>(null);
  const [sourcesCount, setSourcesCount] = React.useState<number | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rRes, aRes, sRes] = await Promise.all([getRegions(), getPendentes(), getSources()]);
      setRegionsCount(rRes.success && rRes.data ? rRes.data.length : 0);
      setPendingAlertsCount(aRes.success && aRes.data ? aRes.data.length : 0);
      setSourcesCount(sRes.success && sRes.data ? sRes.data.filter((x) => x.ativo ?? x.Ativo ?? true).length : 0);
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar resumo');
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
        <Header title="Projeto de Monitoramento" subtitle="Florestas com IA & Minissatélites" />

        <ThemedText type="title" style={styles.title}>
          Monitoramento de Florestas
        </ThemedText>

        <ThemedText style={styles.lead}>Plataforma inicial para visualização de dados e alertas.</ThemedText>

        {loading ? (
          <Loading />
        ) : error ? (
          <>
            <ThemedText type="small" themeColor="danger">{error}</ThemedText>
            <Button title="Tentar novamente" onPress={load} style={{ marginTop: Spacing.two }} />
          </>
        ) : (
          <View style={styles.grid}>
            <Link href="/monitoring" asChild>
              <Pressable>
                <Card>
                  <ThemedText type="smallBold">Monitoramento</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">Fontes ativas: {sourcesCount ?? '—'}</ThemedText>
                </Card>
              </Pressable>
            </Link>

            <Link href="/regions" asChild>
              <Pressable>
                <Card>
                  <ThemedText type="smallBold">Regiões</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{regionsCount ?? 0} regiões monitoradas</ThemedText>
                </Card>
              </Pressable>
            </Link>

            <Link href="/alerts" asChild>
              <Pressable>
                <Card>
                  <ThemedText type="smallBold">Alertas</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">Pendentes: {pendingAlertsCount ?? 0}</ThemedText>
                </Card>
              </Pressable>
            </Link>

            <Link href="/report" asChild>
              <Pressable>
                <Card>
                  <ThemedText type="smallBold">Relatar</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">Criar/editar ocorrência</ThemedText>
                </Card>
              </Pressable>
            </Link>

            <Link href="/team" asChild>
              <Pressable>
                <Card>
                  <ThemedText type="smallBold">Equipe</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">Integrantes do projeto</ThemedText>
                </Card>
              </Pressable>
            </Link>
          </View>
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
  title: { textAlign: 'center' },
  lead: { textAlign: 'center', marginVertical: Spacing.two },
  grid: {
    marginTop: Spacing.four,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});
