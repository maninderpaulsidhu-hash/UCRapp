import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";

interface LogEntry {
  msg: string;
  time: string;
}

const HS = ["Hypovolemia", "Hypoxia", "Hydrogen ion (Acidosis)", "Hypo/Hyperkalemia", "Hypothermia"];
const TS = ["Tension pneumothorax", "Tamponade (cardiac)", "Toxins", "Thrombosis (pulmonary)", "Thrombosis (coronary)"];

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function nowHHMM() {
  const d = new Date();
  return d.getHours().toString().padStart(2, "0") + d.getMinutes().toString().padStart(2, "0");
}

export default function ACLSScreen() {
  const [caseRunning, setCaseRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [epiTime, setEpiTime] = useState(0);
  const [epiActive, setEpiActive] = useState(false);
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
    if (!caseRunning || !epiActive || epiTime <= 0) return;
    const id = setInterval(() => setEpiTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [caseRunning, epiActive, epiTime]);

  const logEvent = (msg: string) => {
    setLog((prev) => [{ msg, time: nowHHMM() }, ...prev]);
  };

  const startCase = () => {
    setTotalSeconds(0);
    setEpiTime(0);
    setEpiActive(false);
    setLog([]);
    setAmioDoseCount(0);
    setCheckedHs(new Set());
    setCheckedTs(new Set());
    setCaseRunning(true);
    logEvent("Case started");
  };

  const stopCase = () => {
    setCaseRunning(false);
    logEvent(`Case ended — total time: ${formatTime(totalSeconds)}`);
  };

  const handleEpi = () => {
    setEpiTime(240);
    setEpiActive(true);
    logEvent("Epinephrine 1mg IV");
  };

  const handleAmio = () => {
    const dose = amioDoseCount === 0 ? "300mg" : "150mg";
    setAmioDoseCount((c) => c + 1);
    logEvent(`Amiodarone ${dose} IV`);
  };

  const epiDue = epiActive && epiTime === 0 && caseRunning;

  const toggleH = (item: string) => {
    setCheckedHs((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const toggleT = (item: string) => {
    setCheckedTs((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: "Code Blue / ACLS" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Timers */}
        <View style={styles.timerRow}>
          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>Case Time</Text>
            <Text style={styles.timerValue}>{formatTime(totalSeconds)}</Text>
          </View>
          <Pressable
            style={[styles.epiCard, epiDue && styles.epiDue]}
            onPress={handleEpi}
          >
            <Text style={styles.timerLabel}>Next Epi</Text>
            <Text style={[styles.timerValue, epiDue && styles.epiDueText]}>
              {epiActive ? (epiDue ? "DUE NOW" : formatTime(epiTime)) : "—"}
            </Text>
            {epiDue && <Text style={styles.epiDueLabel}>GIVE EPI</Text>}
          </Pressable>
        </View>

        {/* Case Control */}
        {!caseRunning ? (
          <Pressable style={styles.startButton} onPress={startCase}>
            <Text style={styles.startButtonText}>Start Case</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.stopButton} onPress={stopCase}>
            <Text style={styles.stopButtonText}>Stop Case</Text>
          </Pressable>
        )}

        {/* Drug Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <View style={styles.drugGrid}>
            <Pressable style={[styles.drugButton, styles.drugEpi]} onPress={handleEpi} disabled={!caseRunning}>
              <Text style={styles.drugLabel}>Epinephrine</Text>
              <Text style={styles.drugDose}>1mg IV</Text>
            </Pressable>
            <Pressable style={[styles.drugButton, styles.drugAmio]} onPress={handleAmio} disabled={!caseRunning}>
              <Text style={styles.drugLabel}>Amiodarone</Text>
              <Text style={styles.drugDose}>{amioDoseCount === 0 ? "300mg" : "150mg"} IV</Text>
            </Pressable>
            <Pressable style={[styles.drugButton, styles.drugLido]} onPress={() => logEvent("Lidocaine 1–1.5 mg/kg IV")} disabled={!caseRunning}>
              <Text style={styles.drugLabel}>Lidocaine</Text>
              <Text style={styles.drugDose}>1–1.5 mg/kg</Text>
            </Pressable>
            <Pressable style={[styles.drugButton, styles.drugBicarb]} onPress={() => logEvent("Sodium Bicarbonate 1 AMP IV")} disabled={!caseRunning}>
              <Text style={styles.drugLabel}>NaHCO₃</Text>
              <Text style={styles.drugDose}>1 AMP IV</Text>
            </Pressable>
            <Pressable style={[styles.drugButton, styles.drugCalcium]} onPress={() => logEvent("Calcium Gluconate/Chloride 1g IV")} disabled={!caseRunning}>
              <Text style={styles.drugLabel}>Calcium</Text>
              <Text style={styles.drugDose}>1g IV</Text>
            </Pressable>
          </View>
        </View>

        {/* H's & T's */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reversible Causes</Text>
          <View style={styles.htRow}>
            <View style={styles.htCol}>
              <Text style={styles.htHeader}>H's</Text>
              {HS.map((item) => (
                <Pressable key={item} style={styles.htItem} onPress={() => toggleH(item)}>
                  <View style={[styles.htCheck, checkedHs.has(item) && styles.htChecked]} />
                  <Text style={[styles.htText, checkedHs.has(item) && styles.htTextChecked]}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.htCol}>
              <Text style={styles.htHeader}>T's</Text>
              {TS.map((item) => (
                <Pressable key={item} style={styles.htItem} onPress={() => toggleT(item)}>
                  <View style={[styles.htCheck, checkedTs.has(item) && styles.htChecked]} />
                  <Text style={[styles.htText, checkedTs.has(item) && styles.htTextChecked]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Case Log */}
        {log.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Case Log</Text>
            <View style={styles.logBox}>
              {log.map((entry, i) => (
                <View key={i} style={styles.logEntry}>
                  <Text style={styles.logTime}>{entry.time}</Text>
                  <Text style={styles.logMsg}>{entry.msg}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  timerRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  timerCard: { flex: 1, backgroundColor: "#1f2937", borderRadius: 16, padding: 16, alignItems: "center" },
  epiCard: { flex: 1, backgroundColor: "#1f2937", borderRadius: 16, padding: 16, alignItems: "center" },
  epiDue: { backgroundColor: "#dc2626" },
  timerLabel: { color: "#9ca3af", fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  timerValue: { color: "#fff", fontSize: 32, fontWeight: "900", fontVariant: ["tabular-nums"], marginTop: 4 },
  epiDueText: { color: "#fef2f2" },
  epiDueLabel: { color: "#fca5a5", fontSize: 12, fontWeight: "700", marginTop: 4 },
  startButton: { backgroundColor: "#16a34a", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 16 },
  startButtonText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  stopButton: { backgroundColor: "#dc2626", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 16 },
  stopButtonText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  section: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 12 },
  drugGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  drugButton: { width: "47%", borderRadius: 12, padding: 14, alignItems: "center" },
  drugEpi: { backgroundColor: "#dc2626" },
  drugAmio: { backgroundColor: "#2563eb" },
  drugLido: { backgroundColor: "#7c3aed" },
  drugBicarb: { backgroundColor: "#d97706" },
  drugCalcium: { backgroundColor: "#059669" },
  drugLabel: { color: "#fff", fontWeight: "800", fontSize: 15 },
  drugDose: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  htRow: { flexDirection: "row", gap: 12 },
  htCol: { flex: 1 },
  htHeader: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 8 },
  htItem: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  htCheck: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: "#d1d5db" },
  htChecked: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  htText: { fontSize: 13, color: "#374151", flex: 1 },
  htTextChecked: { color: "#6b7280", textDecorationLine: "line-through" },
  logBox: { backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, gap: 8 },
  logEntry: { flexDirection: "row", gap: 10 },
  logTime: { color: "#6b7280", fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"], width: 40 },
  logMsg: { color: "#111827", fontSize: 13, flex: 1 },
});
