import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";

export default function IntubationHub() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: "Intubation" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Intubation</Text>
        <Pressable
          style={({ pressed }) => [styles.button, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.push("/intubation/checklist")}
        >
          <Text style={styles.buttonText}>RSI Checklist</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 56, fontWeight: "900", color: "#111827", textTransform: "uppercase", letterSpacing: -1, marginBottom: 48 },
  button: { backgroundColor: "#2563eb", paddingHorizontal: 48, paddingVertical: 28, borderRadius: 20 },
  buttonText: { color: "#fff", fontSize: 22, fontWeight: "900", textTransform: "uppercase" },
});
