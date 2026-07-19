import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

const CHECKLIST = [
  { letter: 'Y', label: 'Yankauer', detail: 'Rigid suction ready and functioning at bedside' },
  { letter: 'B', label: 'BVM', detail: 'Bag-valve-mask with PEEP valve and backup ventilation device' },
  { letter: 'A', label: 'Airway equipment', detail: 'Correct ETT sizes, blades, stylet/bougie checked' },
  { letter: 'G', label: 'Gas', detail: 'Oxygen source connected, capnography ready' },
  { letter: 'P', label: 'Pharmacy', detail: 'Induction and paralytic drugs drawn up and labeled' },
  { letter: 'E', label: 'Equipment', detail: 'Cardiac monitor, pulse ox, and BP cycling' },
  { letter: 'O', label: 'Oxygen', detail: 'Patient preoxygenated / apneic oxygenation running' },
  { letter: 'P', label: 'Position', detail: 'Bed height and ramped/sniffing position optimized' },
  { letter: 'L', label: 'Lines', detail: 'IV/IO access patent and secured' },
  { letter: 'E', label: 'Extra', detail: 'Backup/rescue plan and difficult airway cart available' },
];

const AIRWAY_PLAN = [
  { plan: 'A', label: 'Direct / video laryngoscopy', color: '#16a34a' },
  { plan: 'B', label: 'Bougie or 2nd-generation blade', color: '#1d4ed8' },
  { plan: 'C', label: 'Supraglottic airway (LMA)', color: '#d97706' },
  { plan: 'D', label: 'Cricothyrotomy', color: '#dc2626' },
];

export default function RsiChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (index: number) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Y BAG PEOPLE</Text>
        <Text style={styles.progress}>
          {checkedCount} / {CHECKLIST.length} complete
        </Text>

        {CHECKLIST.map((item, index) => {
          const isChecked = !!checked[index];
          return (
            <Pressable
              key={index}
              style={styles.row}
              onPress={() => toggle(index)}
            >
              <View style={[styles.letterBadge, isChecked && styles.letterBadgeChecked]}>
                <Text style={[styles.letterText, isChecked && styles.letterTextChecked]}>
                  {item.letter}
                </Text>
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowLabel, isChecked && styles.rowTextChecked]}>
                  {item.label}
                </Text>
                <Text style={[styles.rowDetail, isChecked && styles.rowTextChecked]}>
                  {item.detail}
                </Text>
              </View>
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionHeading}>Airway Plan</Text>
      <View style={styles.card}>
        {AIRWAY_PLAN.map((step, index) => (
          <View key={step.plan}>
            <View style={styles.planRow}>
              <View style={[styles.planBadge, { backgroundColor: step.color }]}>
                <Text style={styles.planBadgeText}>{step.plan}</Text>
              </View>
              <Text style={styles.planLabel}>{step.label}</Text>
            </View>
            {index < AIRWAY_PLAN.length - 1 && <Text style={styles.planArrow}>↓</Text>}
          </View>
        ))}
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  progress: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  letterBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  letterBadgeChecked: {
    backgroundColor: '#1d4ed8',
  },
  letterText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#334155',
  },
  letterTextChecked: {
    color: '#ffffff',
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  rowDetail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  rowTextChecked: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginLeft: 8,
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
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  planBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  planLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  planArrow: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 16,
    marginLeft: 15,
  },
});
