import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { deleteRegion, getRegions, RegionDto } from '@/services/regionService';

function formatBioma(b: any) {
  const mapNum: Record<number, string> = { 1: 'Amazônia', 2: 'Cerrado', 3: 'Mata Atlântica', 4: 'Caatinga', 5: 'Pantanal', 6: 'Pampa', 7: 'Outro' };
  const mapStr: Record<string, string> = {
    Amazonia: 'Amazônia',
    Cerrado: 'Cerrado',
    MataAtlantica: 'Mata Atlântica',
    Caatinga: 'Caatinga',
    Pantanal: 'Pantanal',
    Pampa: 'Pampa',
    Outro: 'Outro',
  };

  if (b == null) return '—';
  if (typeof b === 'number') return mapNum[b] ?? `Bioma ${b}`;
  const s = String(b);
  return mapStr[s] ?? s;
}

export default function RegionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<RegionDto[] | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | string | null>(null);

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
    const t = setTimeout(() => load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function confirmDelete(id: number | string, name?: string) {
    const ok = await new Promise<boolean>((resolve) => {
      Alert.alert('Confirmar exclusão', `Deseja excluir a região "${name ?? id}"?`, [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
      ]);
    });
    if (!ok) return;
    try {
      setDeletingId(id);
      const res = await deleteRegion(id as any);
      setDeletingId(null);
      if (res.success) {
        Alert.alert('Sucesso', 'Região excluída.');
        setData((prev) => (prev ?? []).filter((r) => String(r.id) !== String(id)));
      } else {
        Alert.alert('Erro', res.error || 'Falha ao excluir região.');
      }
    } catch (e: any) {
      setDeletingId(null);
      Alert.alert('Erro', e?.message || 'Erro desconhecido');
    }
  }

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
          <>
            <View style={{ marginBottom: Spacing.two }}>
              <Link href={{ pathname: '/region-form' }} asChild>
                <Pressable>
                  <Button title="Nova região" />
                </Pressable>
              </Link>
            </View>

            <FlatList
              data={data ?? []}
              keyExtractor={(r) => String(r.id)}
              contentContainerStyle={{ paddingBottom: Spacing.six }}
              renderItem={({ item }) => (
                <Card>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="smallBold">{item.nome ?? (item as any).Nome}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">{formatBioma(item.bioma ?? (item as any).Bioma)} • {item.estado ?? (item as any).Estado ?? '—'}</ThemedText>
                      <ThemedText type="small">{item.pais ?? (item as any).Pais ?? '—'} • {item.areaKm2 ?? (item as any).AreaKm2 ?? '—'} km²</ThemedText>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Pressable onPress={() => router.push(`/region-form?id=${item.id}`)} style={styles.linkButton}>
                          <ThemedText type="linkPrimary">Editar</ThemedText>
                        </Pressable>

                        <Link href={{ pathname: '/alerts', params: { region: String(item.id) } }} asChild>
                          <Pressable style={[styles.linkButton, { marginLeft: Spacing.two }]}>
                            <ThemedText type="linkPrimary">Ver alertas</ThemedText>
                          </Pressable>
                        </Link>

                        <Pressable onPress={() => confirmDelete(item.id, item.nome ?? (item as any).Nome)} style={[styles.linkButton, { marginLeft: Spacing.two }]}>
                          <ThemedText type="link" themeColor="danger">{deletingId === item.id ? 'Excluindo...' : 'Excluir'}</ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Card>
              )}
            />
          </>
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
