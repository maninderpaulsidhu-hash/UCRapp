import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack } from "expo-router";

type HeightUnit = "in" | "cm" | "ftIn";

interface VentResult {
  ibw: number;
  vt4: number;
  vt5: number;
  vt6: number;
}

export default function VentPage() {
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("in");
  const [heightInches, setHeightInches] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<VentResult | null>(null);
  const [error, setError] = useState("");

  const calculateIBW = () => {
    setError("");
    setResult(null);

    if (!gender) {
      setError("Please select a gender");
      return;
    }

    let totalHeightInches = 0;

    if (heightUnit === "in") {
      const v = parseFloat(heightInches);
      if (!v || v <= 0) {
        setError("Please enter a valid height in inches");
        return;
      }
      totalHeightInches = v;
    } else if (heightUnit === "cm") {
      const v = parseFloat(heightCm);
      if (!v || v <= 0) {
        setError("Please enter a valid height in centimeters");
        return;
      }
      totalHeightInches = v / 2.54;
    } else {
      const f = parseFloat(feet);
      const i = parseFloat(inches);
      if (!f || f < 0 || !i || i < 0) {
        setError("Please enter valid feet and inches");
        return;
      }
      totalHeightInches = f * 12 + i;
    }

    const baseWeight = gender === "M" ? 50 : 45.5;
    let ibw = baseWeight;
    if (totalHeightInches >= 60) {
      ibw = baseWeight + 2.3 * (totalHeightInches - 60);
    }

    setResult({ ibw, vt4: ibw * 4, vt5: ibw * 5, vt6: ibw * 6 });
  };

  return (
    <>
      <Stack.Screen options={{ title: "Vent Calculator" }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ventilator Settings</Text>
        <Text style={styles.subtitle}>
          Calculate ideal body weight and tidal volume using the Devine Formula
        </Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.rowGap}>
            <Pressable
              style={[styles.choiceButton, gender === "M" && styles.choiceButtonActive]}
              onPress={() => setGender("M")}
            >
              <Text style={[styles.choiceButtonText, gender === "M" && styles.choiceButtonTextActive]}>
                Male
              </Text>
            </Pressable>
            <Pressable
              style={[styles.choiceButton, gender === "F" && styles.choiceButtonActive]}
              onPress={() => setGender("F")}
            >
              <Text style={[styles.choiceButtonText, gender === "F" && styles.choiceButtonTextActive]}>
                Female
              </Text>
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Height Unit</Text>
          <View style={styles.colGap}>
            {(["in", "cm", "ftIn"] as HeightUnit[]).map((u) => (
              <Pressable
                key={u}
                style={[styles.choiceButtonFull, heightUnit === u && styles.choiceButtonActive]}
                onPress={() => setHeightUnit(u)}
              >
                <Text style={[styles.choiceButtonText, heightUnit === u && styles.choiceButtonTextActive]}>
                  {u === "in" ? "Inches" : u === "cm" ? "Centimeters" : "Feet/Inches"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Height</Text>
          {heightUnit === "in" && (
            <TextInput
              style={styles.input}
              value={heightInches}
              onChangeText={setHeightInches}
              placeholder="Inches"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          )}
          {heightUnit === "cm" && (
            <TextInput
              style={styles.input}
              value={heightCm}
              onChangeText={setHeightCm}
              placeholder="Centimeters"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          )}
          {heightUnit === "ftIn" && (
            <View style={styles.rowGap}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={feet}
                onChangeText={setFeet}
                placeholder="Feet"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={inches}
                onChangeText={setInches}
                placeholder="Inches"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
          )}

          <Pressable style={styles.calcButton} onPress={calculateIBW}>
            <Text style={styles.calcButtonText}>Calculate</Text>
          </Pressable>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {result && (
            <View style={styles.resultBox}>
              <View style={styles.ibwCard}>
                <Text style={styles.resultLabel}>Ideal Body Weight</Text>
                <Text style={styles.ibwValue}>{result.ibw.toFixed(2)} kg</Text>
              </View>
              <View style={styles.vtGrid}>
                {[
                  { label: "@ 4 mL/kg", value: result.vt4 },
                  { label: "@ 5 mL/kg", value: result.vt5 },
                  { label: "@ 6 mL/kg", value: result.vt6 },
                ].map((vt) => (
                  <View key={vt.label} style={styles.vtCard}>
                    <Text style={styles.resultLabel}>{vt.label}</Text>
                    <Text style={styles.vtValue}>{vt.value.toFixed(0)}</Text>
                    <Text style={styles.vtUnit}>mL</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>About the Devine Formula</Text>
          <Text style={styles.aboutItem}>• Male: IBW = 50 kg + 2.3 kg per inch above 5 feet</Text>
          <Text style={styles.aboutItem}>• Female: IBW = 45.5 kg + 2.3 kg per inch above 5 feet</Text>
          <Text style={styles.aboutItem}>• Tidal volumes typically range from 4-6 mL/kg of IBW</Text>
          <Text style={styles.aboutItem}>• Lung-protective ventilation commonly uses 6 mL/kg or less</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "700", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  fieldLabel: { fontSize: 12, fontWeight: "700", color: "#059669", marginTop: 14, marginBottom: 8 },
  rowGap: { flexDirection: "row", gap: 8 },
  colGap: { gap: 6 },
  choiceButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  choiceButtonFull: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  choiceButtonActive: { backgroundColor: "#059669", borderColor: "#059669" },
  choiceButtonText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  choiceButtonTextActive: { color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  calcButton: {
    marginTop: 16,
    backgroundColor: "#059669",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  calcButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  errorBox: {
    marginTop: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
  },
  errorText: { color: "#b91c1c", fontSize: 12, fontWeight: "500" },
  resultBox: {
    marginTop: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  ibwCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 10,
    padding: 14,
  },
  resultLabel: { fontSize: 11, fontWeight: "700", color: "#6b7280", marginBottom: 6 },
  ibwValue: { fontSize: 28, fontWeight: "700", color: "#059669" },
  vtGrid: { flexDirection: "row", gap: 10 },
  vtCard: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10 },
  vtValue: { fontSize: 20, fontWeight: "700", color: "#2563eb" },
  vtUnit: { fontSize: 11, color: "#6b7280" },
  aboutBox: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 10,
    padding: 16,
    gap: 4,
  },
  aboutTitle: { fontWeight: "700", color: "#1e3a8a", marginBottom: 4 },
  aboutItem: { fontSize: 13, color: "#1e40af", lineHeight: 19 },
});
