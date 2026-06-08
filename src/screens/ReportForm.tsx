import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function ReportFormScreen() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [severity, setSeverity] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setLoading(true);
    // fake save
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push('/alerts');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Relatar Ocorrência" subtitle="Criar ou editar um relatório" />

        <Card>
          <ThemedText type="smallBold">Título</ThemedText>
          <TextInput value={title} onChangeText={setTitle} placeholder="Ex: Fumaça detectada" style={styles.input} />

          <ThemedText type="smallBold">Descrição</ThemedText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Detalhes da ocorrência"
            style={[styles.input, styles.textarea]}
            multiline
          />

          <ThemedText type="smallBold">Gravidade</ThemedText>
          <View style={styles.row}>
            <Button title="Baixa" variant={severity === 'low' ? 'primary' : 'secondary'} onPress={() => setSeverity('low')} />
            <Button title="Média" variant={severity === 'medium' ? 'primary' : 'secondary'} onPress={() => setSeverity('medium')} />
            <Button title="Alta" variant={severity === 'high' ? 'primary' : 'secondary'} onPress={() => setSeverity('high')} />
          </View>

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
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two, marginTop: Spacing.two },
  actions: { marginTop: Spacing.four, alignItems: 'center' },
});
