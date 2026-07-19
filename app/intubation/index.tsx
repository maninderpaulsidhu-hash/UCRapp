import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function IntubationHub() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Intubation</Text>
      <Text style={styles.subtitle}>
        Run through the RSI checklist before every intubation attempt.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push('/intubation/checklist')}
      >
        <Text style={styles.buttonText}>Start RSI Checklist</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#d97706',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
