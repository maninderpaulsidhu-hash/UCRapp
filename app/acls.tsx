import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface LogEntry {
  msg: string;
  time: string;
}

const HS = [
  "Hypovolemia",
  "Hypoxia",
  "Hydrogen ion (acidosis)",
  "Hypo-/hyperkalemia",
  "Hypothermia",
];
const TS = [
  "Tension pneumothorax",
  "Tamponade, cardiac",
  "Toxins",
  "Thrombosis, pulmonary",
  "Thrombosis, coronary",
];

function getMilitaryTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  return `${hours}${mins}`;
}

function formatElapsed(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function ACLSGuide() {
  const [epiTime, setEpiTime] = useState(240);
  const [epiActive, setEpiActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [caseRunning, setCaseRunning] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [amioDoseCount, setAmioDoseCount] = useState(0);
  const [checkedHs, setCheckedHs] = useState<Set<string>>(new Set());
  const [checkedTs, setCheckedTs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!caseRunning) return;
    const id = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [caseRunning]);

  useEffect(() => {
    if (!epiActive || epiTime <= 0 || !caseRunning) return;
    const id = setInterval(() => setEpiTime((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [epiActive, epiTime, caseRunning]);

  const toggleH = (h: string) => {
    setCheckedHs((prev) => {
      const next = new Set(prev);
      next.has(h) ? next.delete(h) : next.add(h);
      return next;
    });
  };

  const toggleT = (t: string) => {
    setCheckedTs((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const logEvent = (msg: string) => {
    if (!caseRunning) return;
    setLog((prev) => [{ msg, time: getMilitaryTime() }, ...prev]);
  };

  const handleEpiPush = () => {
    logEvent("Epinephrine 1mg IV/IO");
    setEpiTime(240);
    setEpiActive(true);
  };

  const stopCase = () => {
    setCaseRunning(false);
    setLog((prev) => [
      { msg: `CASE STOPPED (Total Duration: ${formatElapsed(totalSeconds)})`, time: getMilitaryTime() },
      ...prev,
    ]);
  };

  const epiDue = epiTime === 0 && caseRunning;

  return (
    <ScrollView style={styles.screen}>
      {/* Reversible Causes */}
      <View style={styles.causesSection}>
        <View style={styles.causesHeader}>
          <Feather name="alert-triangle" size={18} color="#dc2626" />
          <Text style={styles.causesTitle}>Reversible Causes</Text>
        </View>
        <View style={styles.causesGrid}>
          <View style={styles.causesCol}>
            <Text style={styles.hLabel}>H&apos;s</Text>
            {HS.map((h) => (
              <Pressable
                key={h}
                onPress={() => toggleH(h)}
                style={[styles.causeItem, checkedHs.has(h) ? styles.hItemChecked : styles.hItem]}
              >
                <Text
                  style={[styles.causeItemText, checkedHs.has(h) && styles.causeItemTextChecked]}
                >
                  • {h}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.causesCol}>
            <Text style={styles.tLabel}>T&apos;s</Text>
            {TS.map((t) => (
              <Pressable
                key={t}
                onPress={() => toggleT(t)}
                style={[styles.causeItem, checkedTs.has(t) ? styles.tItemChecked : styles.tItem]}
              >
                <Text
                  style={[styles.causeItemText, checkedTs.has(t) && styles.causeItemTextChecked]}
                >
                  • {t}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Tools & Log */}
      <View style={styles.toolsSection}>
        <View style={styles.timerRow}>
          <View>
            <Text style={styles.timerLabel}>Total Case Time</Text>
            <Text style={[styles.timerValue, !caseRunning && styles.timerValueStopped]}>
              {formatElapsed(totalSeconds)}
            </Text>
          </View>
          {caseRunning && (
            <Pressable style={styles.stopButton} onPress={stopCase}>
              <Feather name="square" size={12} color="#fff" />
              <Text style={styles.stopButtonText}>Stop</Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.epiCard, epiDue && styles.epiCardDue]}>
          <Text style={styles.epiLabel}>Epinephrine</Text>
          <Text style={styles.epiSubLabel}>1mg IV/IO q3-5m</Text>
          <View style={styles.epiTimerRow}>
            <Text style={styles.epiStatus}>{epiDue ? "DUE" : "EPI"}</Text>
            <Text style={[styles.epiTime, epiDue && styles.epiTimeDue]}>
              {formatElapsed(epiTime)}
            </Text>
          </View>
          <Pressable
            style={[styles.epiPushButton, epiDue && styles.epiPushButtonDue, !caseRunning && styles.disabled]}
            onPress={handleEpiPush}
            disabled={!caseRunning}
          >
            <Text style={styles.epiPushButtonText}>PUSH</Text>
          </Pressable>
        </View>

        <View style={styles.drugGrid}>
          <Pressable
            style={[styles.drugButton, !caseRunning && styles.disabled]}
            disabled={!caseRunning}
            onPress={() => {
              logEvent(`Amiodarone ${amioDoseCount === 0 ? "300mg" : "150mg"}`);
              setAmioDoseCount((c) => c + 1);
            }}
          >
            <Text style={styles.drugLabel}>Amiodarone</Text>
            <Text style={styles.drugValue}>{amioDoseCount === 0 ? "300mg" : "150mg"}</Text>
          </Pressable>
          <Pressable
            style={[styles.drugButton, !caseRunning && styles.disabled]}
            disabled={!caseRunning}
            onPress={() => logEvent("Lidocaine 1-1.5 mg/kg")}
          >
            <Text style={styles.drugLabel}>Lidocaine</Text>
            <Text style={styles.drugValue}>1-1.5 mg/kg</Text>
          </Pressable>
          <Pressable
            style={[styles.drugButton, !caseRunning && styles.disabled]}
            disabled={!caseRunning}
            onPress={() => logEvent("Sodium Bicarb 1 AMP")}
          >
            <Text style={styles.drugLabel}>NaHCO3</Text>
            <Text style={styles.drugValue}>1 AMP</Text>
          </Pressable>
          <Pressable
            style={[styles.drugButton, !caseRunning && styles.disabled]}
            disabled={!caseRunning}
            onPress={() => logEvent("Calcium (1g Glu/Cl)")}
          >
            <Text style={styles.drugLabel}>Calcium</Text>
            <Text style={styles.drugValue}>1g Glu/Cl</Text>
          </Pressable>
        </View>

        <View style={styles.logBox}>
          <View style={styles.logHeader}>
            <Text style={styles.logHeaderText}>Case Log</Text>
            <Feather name="clock" size={14} color="#4b5563" />
          </View>
          {log.map((entry, i) => (
            <View key={i} style={styles.logRow}>
              <Text style={styles.logTime}>{entry.time}</Text>
              <Text style={[styles.logMsg, entry.msg.includes("STOPPED") && styles.logMsgStopped]}>
                {entry.msg}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#030712" },
  causesSection: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 2,
    borderBottomColor: "#1f2937",
    padding: 20,
  },
  causesHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  causesTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  causesGrid: { flexDirection: "row", gap: 16 },
  causesCol: { flex: 1 },
  hLabel: { fontSize: 13, fontWeight: "900", color: "#1e40af", marginBottom: 8 },
  tLabel: { fontSize: 13, fontWeight: "900", color: "#b91c1c", marginBottom: 8 },
  causeItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  hItem: { backgroundColor: "#fff", borderColor: "#60a5fa" },
  hItemChecked: { backgroundColor: "#bfdbfe", borderColor: "#bfdbfe" },
  tItem: { backgroundColor: "#fff", borderColor: "#f87171" },
  tItemChecked: { backgroundColor: "#fecaca", borderColor: "#fecaca" },
  causeItemText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  causeItemTextChecked: { textDecorationLine: "line-through", color: "#1e3a8a" },
  toolsSection: { padding: 20, gap: 16 },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  timerLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  timerValue: { color: "#4ade80", fontSize: 30, fontWeight: "700", fontVariant: ["tabular-nums"] },
  timerValueStopped: { color: "#6b7280" },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#dc2626",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  stopButtonText: { color: "#fff", fontWeight: "900", fontSize: 12, textTransform: "uppercase" },
  epiCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#1f2937",
  },
  epiCardDue: { borderColor: "#dc2626", backgroundColor: "#450a0a" },
  epiLabel: { color: "#9ca3af", fontSize: 13, fontWeight: "900", textTransform: "uppercase" },
  epiSubLabel: { color: "#60a5fa", fontSize: 15, fontWeight: "700", marginTop: 2, marginBottom: 10 },
  epiTimerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  epiStatus: { color: "#fff", fontSize: 17, fontWeight: "900" },
  epiTime: { color: "#60a5fa", fontSize: 26, fontWeight: "700", fontVariant: ["tabular-nums"] },
  epiTimeDue: { color: "#ef4444" },
  epiPushButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  epiPushButtonDue: { backgroundColor: "#dc2626" },
  epiPushButtonText: { color: "#fff", fontWeight: "900", fontSize: 14 },
  disabled: { opacity: 0.35 },
  drugGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  drugButton: {
    width: "47%",
    padding: 12,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  drugLabel: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  drugValue: { color: "#fff", fontSize: 14, fontWeight: "900" },
  logBox: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    minHeight: 120,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    paddingBottom: 8,
    marginBottom: 8,
  },
  logHeaderText: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
  },
  logTime: { color: "#3b82f6", fontWeight: "900", fontSize: 13, fontVariant: ["tabular-nums"] },
  logMsg: { color: "#d1d5db", fontSize: 13, fontStyle: "italic", flex: 1 },
  logMsgStopped: { color: "#ef4444", fontWeight: "900", fontStyle: "normal" },
});
