import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { deleteAlert, getAlertsRaw, resolveAlert } from '@/services/alertService';


type AlertDisplay = {
  id: number | string;
  tipoAlerta: string;
  nivelRisco: string;
  mensagem?: string | null;
  resolvido: boolean;
  dataCriacao?: string | null;
  regiaoMonitoradaId?: number | null;
};

const SAMPLE_FALLBACK: AlertDisplay[] = [
  { id: 'f1', tipoAlerta: 'Queimada', nivelRisco: 'Alto', mensagem: 'Fumaça detectada (fallback)', resolvido: false, dataCriacao: new Date().toISOString() },
];

export default function AlertsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const region = (params.region as string) || '';
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<AlertDisplay[] | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | number | null>(null);
  const refresh = params.refresh as string | undefined;

  const loadAlerts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
        try {
      const res = await getAlertsRaw();
      if (res.success && res.data) {
        const mapped = res.data.map((d: any) => ({
          id: d.id ?? d.Id,
          tipoAlerta: String(d.tipoAlerta ?? d.TipoAlerta ?? d.tipoAlerta),
          nivelRisco: String(d.nivelRisco ?? d.NivelRisco ?? d.nivelRisco),
          mensagem: d.mensagem ?? d.Mensagem ?? null,
          resolvido: !!d.resolvido,
          dataCriacao: d.dataCriacao ?? d.DataCriacao ?? null,
          regiaoMonitoradaId: d.regiaoMonitoradaId ?? d.RegiaoMonitoradaId ?? null,
        } as AlertDisplay));
        setData(mapped);
      } else {
        setError(res.error || 'Erro desconhecido ao buscar alertas.');
        setData(SAMPLE_FALLBACK);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro desconhecido');
      setData(SAMPLE_FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => loadAlerts(), 0);
    return () => clearTimeout(t);
  }, [region, refresh, loadAlerts]);

  const occurrences = (data ?? []).filter((o) => {
    if (!region) return true;
    // try numeric region id match first
    const regionNum = Number(region);
    if (!isNaN(regionNum) && o.regiaoMonitoradaId != null) return Number(o.regiaoMonitoradaId) === regionNum;
    // otherwise try substring match in tipoAlerta or mensagem
    return (o.tipoAlerta ?? '').toString().toLowerCase().includes(region.toLowerCase()) || (o.mensagem ?? '').toString().toLowerCase().includes(region.toLowerCase());
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Alertas" subtitle={region ? `Região: ${region}` : 'Todas as regiões'} />

        {loading ? (
          <Loading />
        ) : error ? (
          <>
            <ThemedText type="small" themeColor="danger">{error}</ThemedText>
            <Button title="Tentar novamente" onPress={() => loadAlerts()} style={{ marginTop: Spacing.two }} />
          </>
        ) : occurrences.length === 0 ? (
          <ThemedText type="small">Nenhuma ocorrência encontrada.</ThemedText>
        ) : (
          <>
            <View style={{ marginBottom: Spacing.two }}>
              <Link href={{ pathname: '/alert-form' }} asChild>
                <Pressable>
                  <Button title="Novo alerta" />
                </Pressable>
              </Link>
            </View>

            <FlatList
            data={occurrences}
            keyExtractor={(a) => String(a.id)}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{item.tipoAlerta}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{item.nivelRisco}</ThemedText>
                    {item.mensagem ? <ThemedText type="small">{item.mensagem}</ThemedText> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText type="small" themeColor={item.resolvido ? 'success' : 'warning'}>
                      {item.resolvido ? 'Resolvido' : 'Pendente'}
                    </ThemedText>

                    <ThemedText type="caption">{item.dataCriacao ? new Date(item.dataCriacao).toLocaleString() : ''}</ThemedText>

                    <View style={styles.cardActions}>
                      <Pressable onPress={() => router.push(`/alert-form?id=${item.id}`)} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                        <ThemedText type="smallBold">Ver / Editar</ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={async () => {
                          const ok = await new Promise<boolean>((resolve) => {
                            Alert.alert('Confirmar', 'Deseja marcar este alerta como resolvido?', [
                              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
                              { text: 'Resolver', onPress: () => resolve(true) },
                            ]);
                          });

                          if (!ok) return;
                          try {
                            const res = await resolveAlert(item.id as any);
                            if (res.success) {
                              Alert.alert('Sucesso', 'Alerta marcado como resolvido.');
                              setData((prev) => prev?.map((d) => (String(d.id) === String(item.id) ? { ...d, resolvido: true } : d)) ?? null);
                            } else {
                              Alert.alert('Erro', res.error || 'Falha ao resolver alerta.');
                            }
                          } catch (e: any) {
                            Alert.alert('Erro', e?.message || 'Erro desconhecido');
                          }
                        }}
                        style={({ pressed }) => [styles.actionButton, { marginLeft: Spacing.two }, pressed && styles.pressed]}
                      >
                        <ThemedText type="smallBold" themeColor="success">Resolver</ThemedText>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          Alert.alert('Confirmar exclusão', 'Deseja excluir esta ocorrência?', [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Excluir',
                              style: 'destructive',
                              onPress: async () => {
                                setDeletingId(item.id);
                                const res = await deleteAlert(item.id as any);
                                setDeletingId(null);
                                if (res.success) {
                                  Alert.alert('Sucesso', 'Ocorrência excluída.');
                                  setData((prev) => prev?.filter((o) => String(o.id) !== String(item.id)) ?? null);
                                } else {
                                  Alert.alert('Erro', res.error || 'Falha ao excluir ocorrência.');
                                }
                              },
                            },
                          ])
                        }
                        style={({ pressed }) => [styles.actionButton, { marginLeft: Spacing.two }, pressed && styles.pressed]}
                        disabled={deletingId != null}
                      >
                        <ThemedText type="smallBold" themeColor="danger">{deletingId === item.id ? 'Excluindo...' : 'Excluir'}</ThemedText>
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
  cardActions: { flexDirection: 'row', marginTop: Spacing.two },
  actionButton: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  pressed: { opacity: 0.7 },
});
