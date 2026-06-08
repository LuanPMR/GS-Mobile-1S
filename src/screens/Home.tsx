import { Link } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet } from 'react-native';

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

        <ThemedText style={styles.lead}>
          Plataforma inicial para visualização de dados, alertas e sensores por satélite.
        </ThemedText>

        <Link href="/explore" asChild>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <ThemedText type="linkPrimary">Explorar dados</ThemedText>
          </Pressable>
        </Link>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: MaxContentWidth,
  },
  title: { textAlign: 'center' },
  lead: { textAlign: 'center', marginVertical: Spacing.two },
  button: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: Spacing.four },
  pressed: { opacity: 0.8 },
});
