import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { createAlert, getAlertByIdRaw, resolveAlert, updateAlert } from '@/services/alertService';
import { getRegions } from '@/services/regionService';

const TIPO_ALERTA = [
  'Desmatamento',
  'Queimada',
  'VegetacaoBaixa',
  'VariacaoBrusca',
  'NuvemAlta',
  'Monitoramento',
  'PossivelQueimada',
  'PossivelDesmatamento',
  'AreaCritica',
];

const NIVEL_RISCO = ['Baixo', 'Medio', 'Alto', 'Critico'];

export default function AlertFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.id as string | undefined;

  const [regiaoId, setRegiaoId] = React.useState<number | null>(null);
  const [analiseId, setAnaliseId] = React.useState<string>('');
  const [tipoAlerta, setTipoAlerta] = React.useState<string | null>(null);
  const [nivelRisco, setNivelRisco] = React.useState<string | null>(null);
  const [mensagem, setMensagem] = React.useState<string>('');
  const [resolvido, setResolvido] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [regions, setRegions] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const r = await getRegions();
        if (r.success && r.data) {
          if (!mounted) return;
          setRegions(r.data as any[]);
        }

        if (editId) {
          const a = await getAlertByIdRaw(Number(editId));
          if (a.success && a.data) {
            const d = a.data;
            setRegiaoId(d.regiaoMonitoradaId ?? null);
            setAnaliseId(d.analiseAmbientalId != null ? String(d.analiseAmbientalId) : '');
            setTipoAlerta(String(d.tipoAlerta));
            setNivelRisco(String(d.nivelRisco));
            setMensagem(d.mensagem ?? '');
            setResolvido(!!d.resolvido);
          } else if (!a.success) {
            setError(a.error || 'Falha ao carregar alerta.');
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [editId]);

  const validate = () => {
    if (!regiaoId) return 'Selecione a região.';
    if (!tipoAlerta) return 'Selecione o tipo de alerta.';
    if (!nivelRisco) return 'Selecione o nível de risco.';
    return null;
  };

  const submit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const payload: any = {
        regiaoMonitoradaId: regiaoId,
        analiseAmbientalId: analiseId ? Number(analiseId) : undefined,
        tipoAlerta,
        nivelRisco,
        mensagem: mensagem || undefined,
        resolvido,
      };

      if (editId) {
        const res = await updateAlert(Number(editId), payload);
        if (res.success) {
          Alert.alert('Sucesso', 'Alerta atualizado.');
          router.push(`/alerts?refresh=${Date.now()}`);
        } else {
          setError(res.error || 'Falha ao atualizar alerta.');
        }
      } else {
        const res = await createAlert(payload);
        if (res.success) {
          Alert.alert('Sucesso', 'Alerta criado.');
          router.push(`/alerts?refresh=${Date.now()}`);
        } else {
          setError(res.error || 'Falha ao criar alerta.');
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = async () => {
    if (!editId) return;
    try {
      setSaving(true);
      const res = await resolveAlert(Number(editId));
      if (res.success) {
        Alert.alert('Sucesso', 'Alerta resolvido.');
        router.push(`/alerts?refresh=${Date.now()}`);
      } else {
        Alert.alert('Erro', res.error || 'Falha ao resolver alerta.');
      }
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title={editId ? 'Editar Alerta' : 'Novo Alerta'} subtitle="Criar ou editar alerta ambiental" />

        <Card>
          {loading ? <Loading /> : null}

          <ThemedText type="smallBold">Região</ThemedText>
          <View style={{ marginTop: Spacing.one, marginBottom: Spacing.two }}>
            {regions.length === 0 ? (
              <ThemedText type="small">Nenhuma região disponível.</ThemedText>
            ) : (
              regions.map((r: any) => (
                <Button key={r.id} title={(r.nome ?? (r as any).Nome) as string} variant={regiaoId === r.id ? 'primary' : 'secondary'} onPress={() => setRegiaoId(r.id)} style={{ marginBottom: Spacing.two }} />
              ))
            )}
          </View>

          <ThemedText type="smallBold">ID da análise (opcional)</ThemedText>
          <TextInput value={analiseId} onChangeText={setAnaliseId} placeholder="Ex: 123" keyboardType="numeric" style={styles.input} />

          <ThemedText type="smallBold">Tipo de Alerta</ThemedText>
          <View style={styles.rowWrap}>
            {TIPO_ALERTA.map((t) => (
              <Button key={t} title={t} variant={tipoAlerta === t ? 'primary' : 'secondary'} onPress={() => setTipoAlerta(t)} style={{ marginRight: Spacing.two, marginBottom: Spacing.two }} />
            ))}
          </View>

          <ThemedText type="smallBold">Nível de Risco</ThemedText>
          <View style={styles.rowWrap}>
            {NIVEL_RISCO.map((n) => (
              <Button key={n} title={n} variant={nivelRisco === n ? 'primary' : 'secondary'} onPress={() => setNivelRisco(n)} style={{ marginRight: Spacing.two, marginBottom: Spacing.two }} />
            ))}
          </View>

          <ThemedText type="smallBold">Mensagem</ThemedText>
          <TextInput value={mensagem} onChangeText={setMensagem} placeholder="Detalhes do alerta" style={[styles.input, styles.textarea]} multiline />

          {editId ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two }}>
              <ThemedText type="smallBold">Resolvido</ThemedText>
              <View style={{ width: Spacing.five }} />
              <Switch value={resolvido} onValueChange={setResolvido} />
            </View>
          ) : null}

          {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText> : null}

          <View style={styles.actions}>
            <Button title={saving ? 'Salvando...' : editId ? 'Atualizar' : 'Criar'} onPress={submit} loading={saving} />
            {editId ? (
              <View style={{ marginTop: Spacing.two }}>
                <Button title="Resolver" variant="secondary" onPress={handleResolve} />
              </View>
            ) : null}
          </View>
        </Card>
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
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' as any, marginTop: Spacing.one },
  actions: { marginTop: Spacing.four, alignItems: 'center' },
});
