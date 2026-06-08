import { Link } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Projeto de Monitoramento" subtitle="Florestas com IA & Minissatélites" />

        <ThemedText type="title" style={styles.title}>
          Monitoramento de Florestas
        </ThemedText>

        <ThemedText style={styles.lead}>Plataforma inicial para visualização de dados e alertas.</ThemedText>

        <View style={styles.grid}>
          <Link href="/monitoring" asChild>
            <Pressable>
              <Card>
                <ThemedText type="smallBold">Monitoramento</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Status de satélites e loop</ThemedText>
              </Card>
            </Pressable>
          </Link>

          <Link href="/regions" asChild>
            <Pressable>
              <Card>
                <ThemedText type="smallBold">Regiões</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Amazônia, Cerrado, Pantanal</ThemedText>
              </Card>
            </Pressable>
          </Link>

          <Link href="/alerts" asChild>
            <Pressable>
              <Card>
                <ThemedText type="smallBold">Alertas</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Queimadas e desmatamento</ThemedText>
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
