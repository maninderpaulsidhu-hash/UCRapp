import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Stack } from "expo-router";

const CRASH_DATA = [
  {
    letter: "C",
    problem: "Increased oxygen Consumption",
    solution: "Optimize preoxygenation, apneic oxygenation",
  },
  {
    letter: "R",
    problem: "Right ventricular failure",
    solution:
      "Optimize preoxygenation, inhaled pulmonary vasodilators, choice of induction agents, early use of vasopressors",
  },
  {
    letter: "A",
    problem: "Acidosis (Metabolic)",
    solution:
      "Correct underlying issues, avoid mechanical ventilation if possible, minimize apnea time, consider awake intubation, maintain increased minute ventilation",
  },
  {
    letter: "S",
    problem: "Risk of deSaturation",
    solution: "Optimize preoxygenation",
  },
  {
    letter: "H",
    problem: "Hypotension",
    solution: "Volume resuscitation, vasopressors",
  },
];

const AIRWAY_ASSESSMENT = [
  {
    test: "Bag Mask Ventilation Difficulty",
    signs: "Beard, Obese, No teeth, Elderly, Sleep apnea/ snoring",
  },
  {
    test: "Supraglottic Airway Insertion",
    signs: "Restricted mouth opening, Obstruction, Distorted airway, stiff lungs or c-spine",
  },
  {
    test: "Mouth Opening",
    signs: "3-3-2",
  },
];

export default function PreIntubationChecklist() {
  const [checkedCrash, setCheckedCrash] = useState<Set<number>>(new Set());
  const [checkedAirway, setCheckedAirway] = useState<Set<number>>(new Set());

  const toggleCrash = (i: number) => {
    setCheckedCrash((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAirway = (i: number) => {
    setCheckedAirway((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: "Pre-Intubation Checklist" }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pre-Intubation Checklist</Text>

        <Text style={styles.sectionTitle}>CRASH Mnemonic: Optimizing hemodynamics</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.letterCol]}>Letter</Text>
            <Text style={[styles.tableHeaderCell, styles.textCol]}>Problem / Solution</Text>
          </View>
          {CRASH_DATA.map((item, i) => {
            const checked = checkedCrash.has(i);
            return (
              <Pressable
                key={item.letter}
                style={[styles.tableRow, checked && styles.tableRowChecked]}
                onPress={() => toggleCrash(i)}
              >
                <Text
                  style={[
                    styles.crashLetter,
                    styles.letterCol,
                    checked && styles.checkedText,
                  ]}
                >
                  {item.letter}
                </Text>
                <View style={styles.textCol}>
                  <Text style={[styles.problemText, checked && styles.checkedText]}>
                    {item.problem}
                  </Text>
                  <Text style={[styles.solutionText, checked && styles.checkedText]}>
                    {item.solution}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Airway Assessment: Bedside Tests</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Test</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Risk Factors</Text>
          </View>
          {AIRWAY_ASSESSMENT.map((item, i) => {
            const checked = checkedAirway.has(i);
            return (
              <Pressable
                key={item.test}
                style={[styles.tableRow, checked && styles.tableRowChecked]}
                onPress={() => toggleAirway(i)}
              >
                <Text style={[styles.airwayCell, { flex: 1 }, checked && styles.checkedText]}>
                  {item.test}
                </Text>
                <Text style={[styles.airwayCell, { flex: 1 }, checked && styles.checkedText]}>
                  {item.signs}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  table: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 28,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
    padding: 12,
  },
  tableHeaderCell: { fontWeight: "900", fontSize: 13, color: "#111827" },
  letterCol: { width: 44 },
  textCol: { flex: 1 },
  tableRow: {
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  tableRowChecked: { backgroundColor: "#dcfce7" },
  crashLetter: { fontSize: 22, fontWeight: "900", color: "#9333ea" },
  problemText: { fontWeight: "700", fontSize: 13, color: "#374151", marginBottom: 4 },
  solutionText: { fontSize: 12, color: "#374151", lineHeight: 17 },
  airwayCell: { fontWeight: "700", fontSize: 13, color: "#374151" },
  checkedText: { textDecorationLine: "line-through", color: "#15803d" },
});
