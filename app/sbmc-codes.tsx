import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

const SECTIONS = [
  {
    title: "SBMC Codes",
    color: "#2563eb",
    headerBg: "#eff6ff",
    badgeBg: "#dbeafe",
    items: [
      { room: "Closet", code: "89120" },
      { room: "Call Room", code: "78287", note: "STATS" },
      { room: "OR Locker", code: "37150", note: "Ladies" },
      { room: "Procedure Equipment Room", code: "53153" },
      { room: "Line Cart SICU", code: "13145" },
    ],
  },
  {
    title: "GME Lock Codes",
    color: "#9333ea",
    headerBg: "#faf5ff",
    badgeBg: "#f3e8ff",
    items: [
      { room: "Lecture Hall", code: "76677", note: "POOPS" },
      { room: "Didactic", code: "20167" },
      { room: "Hallway Restroom", code: "76677", note: "POOPS" },
      { room: "Kitchen Door", code: "3663", note: "FOOD" },
    ],
  },
  {
    title: "SMBC Codes",
    color: "#059669",
    headerBg: "#ecfdf5",
    badgeBg: "#d1fae5",
    items: [
      { room: "Workroom", code: "12345" },
      { room: "Sleep Room", code: "92404" },
      { room: "Didactic Room", code: "20167" },
      { room: "Lecture Room", code: "76677" },
      { room: "IR Hallway", code: "76450" },
      { room: "Procedure Equipment Room", code: "53153" },
    ],
  },
];

export default function SBMCCodes() {
  return (
    <>
      <Stack.Screen options={{ title: "SBMC Codes" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Feather name="lock" size={26} color="#374151" />
          <Text style={styles.pageTitle}>Door & Room Codes</Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.card}>
            <View style={[styles.sectionHeader, { backgroundColor: section.headerBg }]}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, i) => (
              <View
                key={item.room}
                style={[
                  styles.codeRow,
                  i < section.items.length - 1 && styles.codeRowBorder,
                ]}
              >
                <Text style={styles.roomName}>
                  {item.room}
                  {item.note && <Text style={styles.roomNote}> ({item.note})</Text>}
                </Text>
                <View style={[styles.codeBadge, { backgroundColor: section.badgeBg }]}>
                  <Text style={[styles.codeText, { color: section.color }]}>{item.code}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.disclaimer}>
          Keep these codes confidential — do not share outside the program.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: "700", color: "#111827", letterSpacing: -0.3 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    overflow: "hidden",
  },
  sectionHeader: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  codeRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  roomName: { fontSize: 13, color: "#1f2937", flex: 1, fontWeight: "500" },
  roomNote: { fontSize: 12, color: "#6b7280", fontWeight: "400" },
  codeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  codeText: { fontFamily: "monospace", fontSize: 16, fontWeight: "700", letterSpacing: 1 },
  disclaimer: { textAlign: "center", fontSize: 12, color: "#9ca3af", paddingBottom: 16 },
});
