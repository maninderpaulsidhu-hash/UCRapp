import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const PASSCODE = 'UCR123';
const UNLOCK_KEY = 'programUpdatesUnlocked';

const PROGRAM_UPDATES = [
  { date: 'Check back often', text: 'Program announcements will be posted here by fellowship leadership.' },
  { date: 'Have an update?', text: 'Contact the program coordinator to have it added to this list.' },
];

const ICU_LINKS = [
  { label: 'Code Blue', color: '#dc2626', route: '/acls' as const },
  { label: 'Intubation', color: '#d97706', route: '/intubation' as const },
  { label: 'SBMC Codes', color: '#7e22ce', route: '/sbmc-codes' as const },
  {
    label: 'On Call',
    color: '#16a34a',
    url: 'https://schedule.tigerconnect.com/telecom/DignityHealthSBMC_92404.html',
  },
];

const GME_LINKS = [
  {
    label: 'Conference Schedule',
    description: 'Join via Microsoft Teams',
    url: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
  },
  {
    label: 'Night Float Schedule',
    description: 'View on SharePoint',
    url: 'https://ucrhealth.sharepoint.com/sites/PLACEHOLDER',
  },
  {
    label: 'Medhub Hours',
    description: 'Log duty hours',
    url: 'https://redirect.medhub.com/PLACEHOLDER',
  },
  {
    label: 'Vacation Request',
    description: 'Submit a time-off request',
    url: 'https://forms.office.com/PLACEHOLDER',
  },
];

const CALENDAR_URL =
  'https://calendar.google.com/calendar/embed?src=hf1sh5qpp7ich9b8chcekj5efo%40group.calendar.google.com';

export default function Home() {
  const router = useRouter();

  const [unlocked, setUnlocked] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [calendarExpanded, setCalendarExpanded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(UNLOCK_KEY)
      .then((value) => {
        if (value === 'true') setUnlocked(true);
      })
      .finally(() => setCheckingStorage(false));
  }, []);

  const submitPasscode = () => {
    if (passcodeInput.trim().toUpperCase() === PASSCODE) {
      setUnlocked(true);
      setPasscodeError(false);
      AsyncStorage.setItem(UNLOCK_KEY, 'true');
    } else {
      setPasscodeError(true);
    }
    setPasscodeInput('');
  };

  const openUrl = (url: string) => Linking.openURL(url);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Program Updates */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Program Updates</Text>
        {checkingStorage ? null : unlocked ? (
          <View>
            {PROGRAM_UPDATES.map((update, i) => (
              <View key={i} style={styles.updateRow}>
                <Text style={styles.updateDate}>{update.date}</Text>
                <Text style={styles.updateText}>{update.text}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={styles.lockedText}>
              Enter the program passcode to view updates.
            </Text>
            <TextInput
              style={styles.passcodeInput}
              value={passcodeInput}
              onChangeText={(t) => {
                setPasscodeInput(t);
                setPasscodeError(false);
              }}
              placeholder="Passcode"
              autoCapitalize="characters"
              secureTextEntry
              onSubmitEditing={submitPasscode}
            />
            {passcodeError && (
              <Text style={styles.errorText}>Incorrect passcode. Try again.</Text>
            )}
            <Pressable style={styles.unlockButton} onPress={submitPasscode}>
              <Text style={styles.unlockButtonText}>Unlock</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* ICU Links */}
      <Text style={styles.sectionHeading}>ICU Links</Text>
      <View style={styles.grid}>
        {ICU_LINKS.map((link) => (
          <Pressable
            key={link.label}
            style={[styles.gridItem, { backgroundColor: link.color }]}
            onPress={() =>
              link.route ? router.push(link.route) : openUrl(link.url!)
            }
          >
            <Text style={styles.gridItemText}>{link.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* GME Links */}
      <Text style={styles.sectionHeading}>GME Links</Text>
      <View style={styles.stack}>
        {GME_LINKS.map((link) => (
          <Pressable
            key={link.label}
            style={styles.stackCard}
            onPress={() => openUrl(link.url)}
          >
            <Text style={styles.stackCardTitle}>{link.label}</Text>
            <Text style={styles.stackCardSubtitle}>{link.description}</Text>
          </Pressable>
        ))}
      </View>

      {/* Google Calendar */}
      <Text style={styles.sectionHeading}>Calendar</Text>
      <View style={styles.card}>
        <Pressable
          style={styles.calendarToggle}
          onPress={() => setCalendarExpanded((e) => !e)}
        >
          <Text style={styles.cardTitle}>Google Calendar</Text>
          <Text style={styles.chevron}>{calendarExpanded ? '▲' : '▼'}</Text>
        </Pressable>
        {calendarExpanded && (
          <View style={styles.webviewContainer}>
            <WebView source={{ uri: CALENDAR_URL }} style={styles.webview} />
          </View>
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
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  lockedText: {
    marginTop: 8,
    color: '#475569',
    fontSize: 14,
  },
  passcodeInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  errorText: {
    marginTop: 6,
    color: '#dc2626',
    fontSize: 13,
  },
  unlockButton: {
    marginTop: 12,
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  updateRow: {
    marginTop: 10,
  },
  updateDate: {
    fontWeight: '600',
    color: '#1d4ed8',
    fontSize: 13,
  },
  updateText: {
    color: '#334155',
    fontSize: 14,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1.4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridItemText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  stack: {
    marginBottom: 20,
  },
  stackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1d4ed8',
  },
  stackCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  stackCardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  calendarToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 14,
    color: '#64748b',
  },
  webviewContainer: {
    marginTop: 12,
    height: 500,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});
