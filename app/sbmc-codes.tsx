import { ScrollView, View, Text, StyleSheet } from 'react-native';

// Placeholder room/code data — replace with the actual SBMC codes.
const SECTIONS = [
  {
    title: 'SBMC Codes',
    entries: [
      { room: 'ICU Team Room', code: '0000' },
      { room: 'ICU Med Room', code: '0000' },
      { room: 'Rapid Response Closet', code: '0000' },
    ],
  },
  {
    title: 'GME Lock Codes',
    entries: [
      { room: 'GME Office', code: '0000' },
      { room: 'Resident Lounge', code: '0000' },
      { room: 'Call Room Hallway', code: '0000' },
    ],
  },
  {
    title: 'SMBC Codes',
    entries: [
      { room: 'Supply Room', code: '0000' },
      { room: 'Equipment Closet', code: '0000' },
    ],
  },
];

export default function SbmcCodes() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.card}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.entries.map((entry) => (
            <View key={entry.room} style={styles.row}>
              <Text style={styles.roomName}>{entry.room}</Text>
              <View style={styles.codeBadge}>
                <Text style={styles.codeText}>{entry.code}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  roomName: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
    paddingRight: 12,
  },
  codeBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
