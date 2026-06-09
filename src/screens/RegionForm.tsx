import { useRouter, useSearchParams } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { ApiResponse } from '@/services/apiClient';
import { createRegion, getRegionById, updateRegion } from '@/services/regionService';

const BIOMAS = [
  'Amazonia',
  'Cerrado',
  'MataAtlantica',
  'Caatinga',
  'Pantanal',
  'Pampa',
  'Outro',
] as const;

export default function RegionFormScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.id as string | undefined;

  const [nome, setNome] = React.useState('');
  const [bioma, setBioma] = React.useState<string | null>(null);
  const [estado, setEstado] = React.useState('');
  const [pais, setPais] = React.useState('');
  const [latitude, setLatitude] = React.useState<string>('');
  const [longitude, setLongitude] = React.useState<string>('');
  const [areaKm2, setAreaKm2] = React.useState<string>('');
  const [ativa, setAtiva] = React.useState(true);

  const [loadingExisting, setLoadingExisting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validate = () => {
    if (!nome.trim()) return 'Nome é obrigatório.';
    if (!bioma) return 'Selecione o bioma.';
    return null;
  };

  React.useEffect(() => {
    let mounted = true;
    async function loadExisting() {
      if (!editId) return;
      setLoadingExisting(true);
      try {
        const res = await getRegionById(Number(editId));
        if (!mounted) return;
        if (res.success && res.data) {
          const r = res.data;
          setNome(r.nome ?? '');
          setBioma((r.bioma as string) ?? null);
          setEstado(r.estado ?? '');
          setPais(r.pais ?? '');
          setLatitude(r.latitude != null ? String(r.latitude) : '');
          setLongitude(r.longitude != null ? String(r.longitude) : '');
          setAreaKm2(r.areaKm2 != null ? String(r.areaKm2) : '');
          setAtiva(r.ativa ?? true);
        } else {
          setError(res.error || 'Falha ao carregar região.');
        }
      } catch (e: any) {
        setError(e?.message || 'Erro desconhecido ao carregar.');
      } finally {
        if (mounted) setLoadingExisting(false);
      }
    }

    loadExisting();
    return () => {
      mounted = false;
    };
  }, [editId]);

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
        nome: nome.trim(),
        bioma,
        estado: estado.trim() || undefined,
        pais: pais.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        areaKm2: areaKm2 ? Number(areaKm2) : undefined,
        ativa,
      };

      if (editId) {
        const res = await updateRegion(Number(editId), payload);
        if (res.success) {
          Alert.alert('Sucesso', 'Região atualizada.');
          router.push(`/regions?refresh=${Date.now()}`);
        } else {
          setError(res.error || 'Falha ao atualizar região.');
        }
      } else {
        const res: ApiResponse<any> = await createRegion(payload as any);
        if (res.success) {
          Alert.alert('Sucesso', 'Região criada.');
          router.push(`/regions?refresh=${Date.now()}`);
        } else {
          setError(res.error || 'Falha ao criar região.');
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title={editId ? 'Editar Região' : 'Nova Região'} subtitle="Preencha os dados da região" />

        <Card>
          {loadingExisting ? <Loading /> : null}

          <ThemedText type="smallBold">Nome</ThemedText>
          <TextInput value={nome} onChangeText={setNome} placeholder="Ex: Floresta X" style={styles.input} />

          <ThemedText type="smallBold">Bioma</ThemedText>
          <View style={styles.rowWrap}>
            {BIOMAS.map((b) => (
              <Button key={b} title={b === 'MataAtlantica' ? 'Mata Atlântica' : b} variant={bioma === b ? 'primary' : 'secondary'} onPress={() => setBioma(b)} style={{ marginRight: Spacing.two, marginBottom: Spacing.two }} />
            ))}
          </View>

          <ThemedText type="smallBold">Estado</ThemedText>
          <TextInput value={estado} onChangeText={setEstado} placeholder="Ex: AC" style={styles.input} />

          <ThemedText type="smallBold">País</ThemedText>
          <TextInput value={pais} onChangeText={setPais} placeholder="Ex: BR" style={styles.input} />

          <ThemedText type="smallBold">Latitude</ThemedText>
          <TextInput value={latitude} onChangeText={setLatitude} placeholder="-3.4653" keyboardType="numeric" style={styles.input} />

          <ThemedText type="smallBold">Longitude</ThemedText>
          <TextInput value={longitude} onChangeText={setLongitude} placeholder="-62.2159" keyboardType="numeric" style={styles.input} />

          <ThemedText type="smallBold">Área (km²)</ThemedText>
          <TextInput value={areaKm2} onChangeText={setAreaKm2} placeholder="4000" keyboardType="numeric" style={styles.input} />

          {editId ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two }}>
              <ThemedText type="smallBold">Ativa</ThemedText>
              <View style={{ width: Spacing.five }} />
              <Switch value={ativa} onValueChange={setAtiva} />
            </View>
          ) : null}

          {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText> : null}

          <View style={styles.actions}>
            <Button title={saving ? 'Salvando...' : editId ? 'Atualizar' : 'Criar'} onPress={submit} loading={saving} />
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
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' as any, marginTop: Spacing.one },
  actions: { marginTop: Spacing.four, alignItems: 'center' },
});
