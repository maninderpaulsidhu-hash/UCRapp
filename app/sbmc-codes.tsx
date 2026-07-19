import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

const SECTIONS = [
  {
    title: "SBMC Codes",
    color: "#2563eb",
    items: [
      { room: "Closet", code: "89120" },
      { room: "Call Room", code: "78287 (STATS)" },
      { room: "OR Locker (Ladies)", code: "37150" },
      { room: "Procedure Equipment Room", code: "53153" },
      { room: "Line Cart SICU", code: "13145" },
    ],
  },
  {
    title: "GME Lock Codes",
    color: "#7c3aed",
    items: [
      { room: "Lecture Hall", code: "76677 (POOPS)" },
      { room: "Didactic", code: "20167" },
      { room: "Hallway Restroom", code: "76677 (POOPS)" },
      { room: "Kitchen Door", code: "3663 (FOOD)" },
    ],
  },
  {
    title: "SMBC Codes",
    color: "#059669",
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
        <Text style={styles.pageTitle}>SBMC Codes</Text>
        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.card, { borderTopColor: section.color, borderTopWidth: 4 }]}>
            <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
            {section.items.map((item, i) => (
              <View key={i} style={[styles.codeRow, i < section.items.length - 1 && styles.codeRowBorder]}>
                <Text style={styles.roomName}>{item.room}</Text>
                <View style={[styles.codeBadge, { backgroundColor: section.color + "18" }]}>
                  <Text style={[styles.codeText, { color: section.color }]}>{item.code}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.disclaimer}>
          🔒 Confidential — for authorized personnel only
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  pageTitle: { fontSize: 34, fontWeight: "900", color: "#111827", marginBottom: 20, textTransform: "uppercase", letterSpacing: -0.5 },
  card: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderColor: "#e5e7eb", marginBottom: 16, overflow: "hidden" },
  sectionTitle: { fontSize: 18, fontWeight: "800", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  codeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  codeRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  roomName: { fontSize: 14, color: "#374151", flex: 1, fontWeight: "500" },
  codeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  codeText: { fontFamily: "monospace" as any, fontSize: 16, fontWeight: "700" },
  disclaimer: { textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 8 },
});
