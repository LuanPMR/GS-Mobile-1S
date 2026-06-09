import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ApiResponse, createOccurrence, getOccurrenceById, updateOccurrence } from '@/services/api';

export default function ReportFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.id as string | undefined;
  const [regionName, setRegionName] = React.useState('');
  const [satelliteCode, setSatelliteCode] = React.useState('');
  const [status, setStatus] = React.useState<'PRESERVADA' | 'DESMATAMENTO' | 'QUEIMADA' | 'RISCO' | ''>('QUEIMADA');
  const [vegetationColor, setVegetationColor] = React.useState<'VERDE' | 'MARROM' | 'PRETO' | ''>('PRETO');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingExisting, setLoadingExisting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validate = () => {
    if (!regionName.trim()) return 'Região é obrigatória.';
    if (!satelliteCode.trim()) return 'Satélite responsável é obrigatório.';
    if (!status) return 'Selecione o status da ocorrência.';
    if (!vegetationColor) return 'Selecione a cor predominante da vegetação.';
    return null;
  };

  const submit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const payload = {
        regionName: regionName.trim(),
        satelliteCode: satelliteCode.trim(),
        status,
        vegetationColor,
        description: description.trim(),
        detectedAt: new Date().toISOString(),
      };
      if (editId) {
        const res = await updateOccurrence(editId, payload as any);
        if (res.success) {
          Alert.alert('Sucesso', 'Ocorrência atualizada.');
          router.push(`/alerts?refresh=${Date.now()}`);
        } else {
          setError(res.error || 'Falha ao atualizar ocorrência.');
        }
      } else {
        const res: ApiResponse<any> = await createOccurrence(payload as any);
        if (res.success) {
          Alert.alert('Sucesso', 'Ocorrência criada.');
          router.push(`/alerts?refresh=${Date.now()}`);
        } else {
          setError(res.error || 'Falha ao salvar ocorrência.');
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let mounted = true;
    async function loadExisting() {
      if (!editId) return;
      setLoadingExisting(true);
      setError(null);
      try {
        const res = await getOccurrenceById(editId);
        if (!mounted) return;
        if (res.success && res.data) {
          const occ = res.data;
          setRegionName(occ.regionName ?? '');
          setSatelliteCode(occ.satelliteCode ?? '');
          setStatus((occ.status as any) ?? '');
          setVegetationColor((occ.vegetationColor as any) ?? '');
          setDescription(occ.description ?? '');
        } else {
          setError(res.error || 'Falha ao carregar ocorrência.');
        }
      } catch (err: any) {
        setError(err?.message || 'Erro desconhecido ao carregar.');
      } finally {
        if (mounted) setLoadingExisting(false);
      }
    }

    loadExisting();
    return () => {
      mounted = false;
    };
  }, [editId]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Relatar Ocorrência" subtitle="Criar ou editar um relatório" />

        <Card>
          {loadingExisting ? <Loading /> : null}
          <ThemedText type="smallBold">Região</ThemedText>
          <TextInput value={regionName} onChangeText={setRegionName} placeholder="Ex: Amazônia" style={styles.input} />

          <ThemedText type="smallBold">Satélite responsável</ThemedText>
          <TextInput value={satelliteCode} onChangeText={setSatelliteCode} placeholder="Ex: MS-01" style={styles.input} />

          <ThemedText type="smallBold">Status</ThemedText>
          <View style={styles.row}>
            <Button title="Preservada" variant={status === 'PRESERVADA' ? 'primary' : 'secondary'} onPress={() => setStatus('PRESERVADA')} />
            <Button title="Desmatamento" variant={status === 'DESMATAMENTO' ? 'primary' : 'secondary'} onPress={() => setStatus('DESMATAMENTO')} />
            <Button title="Queimada" variant={status === 'QUEIMADA' ? 'primary' : 'secondary'} onPress={() => setStatus('QUEIMADA')} />
            <Button title="Risco" variant={status === 'RISCO' ? 'primary' : 'secondary'} onPress={() => setStatus('RISCO')} />
          </View>

          <ThemedText type="smallBold">Cor predominante da vegetação</ThemedText>
          <View style={styles.row}>
            <Button title="Verde" variant={vegetationColor === 'VERDE' ? 'primary' : 'secondary'} onPress={() => setVegetationColor('VERDE')} />
            <Button title="Marrom" variant={vegetationColor === 'MARROM' ? 'primary' : 'secondary'} onPress={() => setVegetationColor('MARROM')} />
            <Button title="Preto" variant={vegetationColor === 'PRETO' ? 'primary' : 'secondary'} onPress={() => setVegetationColor('PRETO')} />
          </View>

          <ThemedText type="smallBold">Descrição</ThemedText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Detalhes da ocorrência"
            style={[styles.input, styles.textarea]}
            multiline
          />

          {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText> : null}

          <View style={styles.actions}>
            <Button title="Enviar" onPress={submit} loading={loading} />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two, marginTop: Spacing.two, flexWrap: 'wrap' as any },
  actions: { marginTop: Spacing.four, alignItems: 'center' },
});
