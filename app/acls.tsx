import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, StyleSheet } from 'react-native';

const EPI_DURATION = 4 * 60; // seconds

const DRUGS = [
  'Epi 1mg',
  'Amiodarone 300/150mg',
  'Lidocaine 1-1.5mg/kg',
  'NaHCO3 1 AMP',
  'Calcium 1g',
];

const HS_AND_TS = [
  'Hypovolemia',
  'Hypoxia',
  "Hydrogen ion (Acidosis)",
  'Hypo-/Hyperkalemia',
  'Hypothermia',
  'Tension pneumothorax',
  'Tamponade (cardiac)',
  'Toxins',
  'Thrombosis (pulmonary)',
  'Thrombosis (coronary)',
];

type LogEntry = { id: string; time: string; label: string };

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function Acls() {
  const [caseRunning, setCaseRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [epiRunning, setEpiRunning] = useState(false);
  const [epiRemaining, setEpiRemaining] = useState(EPI_DURATION);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [checkedHT, setCheckedHT] = useState<Record<string, boolean>>({});

  const caseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const epiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (caseRunning) {
      caseIntervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    } else if (caseIntervalRef.current) {
      clearInterval(caseIntervalRef.current);
      caseIntervalRef.current = null;
    }
    return () => {
      if (caseIntervalRef.current) clearInterval(caseIntervalRef.current);
    };
  }, [caseRunning]);

  useEffect(() => {
    if (epiRunning) {
      epiIntervalRef.current = setInterval(() => {
        setEpiRemaining((r) => {
          if (r <= 1) {
            setEpiRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else if (epiIntervalRef.current) {
      clearInterval(epiIntervalRef.current);
      epiIntervalRef.current = null;
    }
    return () => {
      if (epiIntervalRef.current) clearInterval(epiIntervalRef.current);
    };
  }, [epiRunning]);

  const addLog = (label: string) => {
    setLog((prev) => [
      { id: `${Date.now()}-${Math.random()}`, time: formatTime(elapsed), label },
      ...prev,
    ]);
  };

  const startCase = () => {
    setCaseRunning(true);
    addLog('Case started');
  };

  const pauseCase = () => {
    setCaseRunning(false);
    addLog('Case paused');
  };

  const resetCase = () => {
    Alert.alert('Reset case?', 'This clears the timer, epi timer, log, and checklist.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setCaseRunning(false);
          setElapsed(0);
          setEpiRunning(false);
          setEpiRemaining(EPI_DURATION);
          setLog([]);
          setCheckedHT({});
        },
      },
    ]);
  };

  const resetEpiTimer = () => {
    setEpiRemaining(EPI_DURATION);
    setEpiRunning(true);
  };

  const logDrug = (drug: string) => {
    addLog(drug);
    if (drug === 'Epi 1mg') {
      resetEpiTimer();
    }
  };

  const toggleHT = (item: string) => {
    setCheckedHT((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Case timer */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Case Timer</Text>
        <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        <View style={styles.buttonRow}>
          {!caseRunning ? (
            <Pressable style={[styles.button, styles.buttonGreen]} onPress={startCase}>
              <Text style={styles.buttonText}>{elapsed === 0 ? 'Start' : 'Resume'}</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.button, styles.buttonAmber]} onPress={pauseCase}>
              <Text style={styles.buttonText}>Pause</Text>
            </Pressable>
          )}
          <Pressable style={[styles.button, styles.buttonRed]} onPress={resetCase}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {/* Epi timer */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Epi Timer (4 min)</Text>
        <Text
          style={[
            styles.timerText,
            epiRemaining <= 30 && styles.timerTextUrgent,
          ]}
        >
          {formatTime(epiRemaining)}
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.buttonBlue]}
            onPress={() => setEpiRunning((r) => !r)}
          >
            <Text style={styles.buttonText}>{epiRunning ? 'Pause' : 'Start'}</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonSlate]} onPress={resetEpiTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {/* Drug buttons */}
      <Text style={styles.sectionHeading}>Drugs</Text>
      <View style={styles.drugGrid}>
        {DRUGS.map((drug) => (
          <Pressable key={drug} style={styles.drugButton} onPress={() => logDrug(drug)}>
            <Text style={styles.drugButtonText}>{drug}</Text>
          </Pressable>
        ))}
      </View>

      {/* H's and T's */}
      <Text style={styles.sectionHeading}>H's &amp; T's</Text>
      <View style={styles.card}>
        {HS_AND_TS.map((item) => (
          <Pressable key={item} style={styles.htRow} onPress={() => toggleHT(item)}>
            <View style={[styles.checkbox, checkedHT[item] && styles.checkboxChecked]}>
              {checkedHT[item] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.htText, checkedHT[item] && styles.htTextChecked]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Case log */}
      <Text style={styles.sectionHeading}>Case Log</Text>
      <View style={styles.card}>
        {log.length === 0 ? (
          <Text style={styles.emptyLogText}>No events logged yet.</Text>
        ) : (
          log.map((entry) => (
            <View key={entry.id} style={styles.logRow}>
              <Text style={styles.logTime}>{entry.time}</Text>
              <Text style={styles.logLabel}>{entry.label}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  timerText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginVertical: 12,
    fontVariant: ['tabular-nums'],
  },
  timerTextUrgent: {
    color: '#dc2626',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonGreen: { backgroundColor: '#16a34a' },
  buttonAmber: { backgroundColor: '#d97706' },
  buttonRed: { backgroundColor: '#dc2626' },
  buttonBlue: { backgroundColor: '#1d4ed8' },
  buttonSlate: { backgroundColor: '#64748b' },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  drugGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  drugButton: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  drugButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  htRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  htText: {
    fontSize: 14,
    color: '#334155',
  },
  htTextChecked: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  emptyLogText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  logRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logTime: {
    width: 56,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    color: '#1d4ed8',
    fontSize: 13,
  },
  logLabel: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
});
