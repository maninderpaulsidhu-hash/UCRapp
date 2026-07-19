import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

const CHECKLIST = [
  { letter: "Y", label: "Yankauer", items: ["Yankauer connected with working suction"] },
  { letter: "B", label: "BVM", items: ["BVM with PEEP valve", "Oral airway nearby"] },
  { letter: "A", label: "Access", items: ["Access (IV) flush and works"] },
  { letter: "G", label: "Get help", items: ["Get help (attending / 2 operators)"] },
  { letter: "P", label: "Place monitor", items: ["Place monitor: BP cycling every 2 min / STAT cycling", "Pre-Oxygenate"] },
  { letter: "E", label: "ETT", items: ["ETT size with correct stylet", "EMMA"] },
  { letter: "O", label: "Objective", items: ["Look in mouth: dentures / secretions / obstruction", "Neck ROM and airway exam completed", "Mouth opening / 3-3-2 assessed", "Position optimized: sniffing or ramped"] },
  { letter: "P", label: "Pharmacy", items: ["Fluid / pressors hanging", "RSI medications", "Post-intubation sedation"] },
  { letter: "L", label: "Laryngoscope", items: ["Laryngoscope: direct / video / glide / blades"] },
  { letter: "E", label: "Explain plan", items: ["Explain plan", "Plan A", "Plan B", "Plan C"] },
];

export default function IntubationChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const allChecked = checked.size === CHECKLIST.length;

  return (
    <>
      <Stack.Screen options={{ title: "RSI Checklist" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>RSI Checklist</Text>
          {checked.size > 0 && (
            <Pressable onPress={() => setChecked(new Set())} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.mnemonic}>Y BAG PEOPLE — tap to check off</Text>

        <View style={styles.listCard}>
          {CHECKLIST.map((item, index) => {
            const isChecked = checked.has(index);
            return (
              <Pressable
                key={index}
                style={[styles.row, isChecked && styles.rowChecked, index < CHECKLIST.length - 1 && styles.rowBorder]}
                onPress={() => toggle(index)}
              >
                <Text style={[styles.letter, isChecked && styles.letterChecked]}>{item.letter}</Text>
                <View style={styles.rowContent}>
                  <Text style={[styles.rowLabel, isChecked && styles.rowLabelChecked]}>{item.label}</Text>
                  {item.items.map((line, i) => (
                    <Text key={i} style={[styles.rowItem, isChecked && styles.rowItemChecked]}>
                      {item.items.length > 1 ? `• ${line}` : line}
                    </Text>
                  ))}
                </View>
                {isChecked && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {allChecked && (
          <View style={styles.allDone}>
            <Text style={styles.allDoneText}>✓ All items checked — ready to intubate</Text>
          </View>
        )}

        {/* Airway Plan Image */}
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Difficult Airway Algorithm</Text>
          <View style={styles.imageCard}>
            <Image
              source={require("../../assets/airway-plan.png")}
              style={styles.airwayImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  title: { fontSize: 34, fontWeight: "900", color: "#111827", textTransform: "uppercase", letterSpacing: -0.5 },
  resetButton: { padding: 8 },
  resetText: { color: "#6b7280", fontSize: 14, textDecorationLine: "underline" },
  mnemonic: { fontSize: 12, color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  listCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderColor: "#e5e7eb", overflow: "hidden", marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "flex-start", padding: 16, gap: 12 },
  rowChecked: { backgroundColor: "#f0fdf4" },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  letter: { fontSize: 28, fontWeight: "900", color: "#2563eb", width: 28, lineHeight: 34 },
  letterChecked: { color: "#16a34a" },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  rowLabelChecked: { color: "#16a34a" },
  rowItem: { fontSize: 15, color: "#1f2937", lineHeight: 22 },
  rowItemChecked: { textDecorationLine: "line-through", color: "#4ade80" },
  checkMark: { color: "#16a34a", fontSize: 18, fontWeight: "900" },
  allDone: { backgroundColor: "#dcfce7", borderWidth: 1, borderColor: "#86efac", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 16 },
  allDoneText: { color: "#15803d", fontWeight: "700", fontSize: 15 },
  imageSection: { marginBottom: 16 },
  imageLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  imageCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderColor: "#e5e7eb", overflow: "hidden" },
  airwayImage: { width: "100%", aspectRatio: 4 / 3 },
});
