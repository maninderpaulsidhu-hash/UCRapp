import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

const PASSCODE = "UCR123";
const STORAGE_KEY = "programUpdates";

const ICU_LINKS = [
  { label: "Code Blue", description: "ACLS algorithms & code blue protocols", color: "#dc2626", route: "/acls" as const },
  { label: "Intubation", description: "Pre-intubation checklist & RSI guide", color: "#d97706", route: "/intubation" as const },
  { label: "SBMC Codes", description: "Door & room access codes", color: "#7c3aed", route: "/sbmc-codes" as const },
  { label: "On Call", description: "SBMC call schedule & contact list", color: "#059669", url: "https://schedule.tigerconnect.com/telecom/DignityHealthSBMC_92404.html" },
];

const GME_LINKS = [
  { label: "Conference Schedule", description: "Join program conference via Teams", cta: "Join Meeting", color: "#2563eb", url: "https://teams.microsoft.com/l/meetup-join/19%3aeybMTf_FQxXegy4o04z0QC0tE7GXbAG7ecMxjjSsYRo1%40thread.tacv2/1718913000600?context=%7b%22Tid%22%3a%227564fc97-f117-40a5-8272-b2c1a981a517%22%2c%22Oid%22%3a%224dc2d3f4-73d5-40cc-9b94-b626ff0706b8%22%7d" },
  { label: "Night Float Schedule", description: "View the CCM night float schedule", cta: "View Schedule", color: "#059669", url: "https://medsch2.sharepoint.com/:x:/r/sites/CriticalCareFellowshipProgram/Shared%20Documents/General/Program%20Resources/CCM%20Night%20Float.xlsx?d=w5c169861739540c1a939b4d969a9fbc0&csf=1&web=1&e=WVOefO" },
  { label: "Medhub Hours", description: "Track your duty hours and training progress", cta: "View Hours", color: "#7c3aed", url: "https://ucrsom.medhub.com/functions/apps/mobile/dutyhours.mh" },
  { label: "Vacation Request", description: "Must be submitted at least two months in advance", cta: "Request Vacation", color: "#e11d48", url: "https://ucrsom.medhub.com/u/r/schedule_request.mh" },
];

export default function Home() {
  const router = useRouter();
  const [updates, setUpdates] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setUpdates(val);
    });
  }, []);

  const submitPasscode = () => {
    if (passcode === PASSCODE) {
      setShowPasscodeModal(false);
      setPasscode("");
      setPasscodeError("");
      setTempText(updates);
      setIsEditing(true);
    } else {
      setPasscodeError("Incorrect passcode");
    }
  };

  const saveUpdates = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, tempText);
    setUpdates(tempText);
    setIsEditing(false);
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CCM Fellows</Text>
        <Text style={styles.headerSubtitle}>UCR Critical Care Medicine</Text>
      </View>

      {/* Program Updates */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Program Updates</Text>
          {!isEditing && (
            <Pressable onPress={() => setShowPasscodeModal(true)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          )}
          {isEditing && (
            <View style={styles.editActions}>
              <Pressable onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveUpdates} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          )}
        </View>
        {isEditing ? (
          <TextInput
            style={styles.textarea}
            multiline
            value={tempText}
            onChangeText={setTempText}
            placeholder="Type program updates here..."
            autoFocus
          />
        ) : (
          <Text style={updates ? styles.updatesText : styles.updatesPlaceholder}>
            {updates || "No updates yet. Tap Edit to add updates."}
          </Text>
        )}
      </View>

      {/* ICU Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ICU Links</Text>
        <View style={styles.icuGrid}>
          {ICU_LINKS.map((link) => (
            <Pressable
              key={link.label}
              style={({ pressed }) => [styles.icuButton, { borderColor: link.color, opacity: pressed ? 0.8 : 1 }]}
              onPress={() => {
                if (link.route) {
                  router.push(link.route);
                } else if (link.url) {
                  openLink(link.url);
                }
              }}
            >
              <View style={[styles.icuButtonBar, { backgroundColor: link.color }]} />
              <View style={styles.icuButtonContent}>
                <Text style={[styles.icuButtonLabel, { color: link.color }]}>{link.label}</Text>
                <Text style={styles.icuButtonDesc}>{link.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* GME Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>GME Links</Text>
        <View style={styles.linkList}>
          {GME_LINKS.map((link) => (
            <Pressable
              key={link.label}
              style={({ pressed }) => [styles.linkCard, { opacity: pressed ? 0.8 : 1, borderLeftColor: link.color }]}
              onPress={() => openLink(link.url)}
            >
              <View style={styles.linkCardContent}>
                <Text style={[styles.linkCardLabel, { color: link.color }]}>{link.label}</Text>
                <Text style={styles.linkCardDesc}>{link.description}</Text>
                <Text style={[styles.linkCardCta, { color: link.color }]}>{link.cta} →</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Program Calendar</Text>
          <Pressable onPress={() => setShowCalendar(!showCalendar)} style={styles.editButton}>
            <Text style={styles.editButtonText}>{showCalendar ? "Hide" : "Show"}</Text>
          </Pressable>
        </View>
        {showCalendar && (
          <View style={styles.calendarContainer}>
            <WebView
              source={{ uri: "https://calendar.google.com/calendar/embed?src=hf1sh5qpp7ich9b8chcekj5efo%40group.calendar.google.com" }}
              style={styles.webview}
            />
          </View>
        )}
        {!showCalendar && (
          <Pressable
            onPress={() => setShowCalendar(true)}
            style={styles.calendarPlaceholder}
          >
            <Text style={styles.calendarPlaceholderText}>Tap to show calendar</Text>
          </Pressable>
        )}
      </View>

      {/* Passcode Modal */}
      <Modal visible={showPasscodeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter Passcode</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry
              value={passcode}
              onChangeText={(t) => { setPasscode(t); setPasscodeError(""); }}
              placeholder="Passcode"
              onSubmitEditing={submitPasscode}
              autoFocus
            />
            {passcodeError ? <Text style={styles.modalError}>{passcodeError}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable onPress={() => { setShowPasscodeModal(false); setPasscode(""); setPasscodeError(""); }} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitPasscode} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Unlock</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, alignItems: "center", paddingTop: 8 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#1d4ed8", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  card: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  cardTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },
  editButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#eff6ff", borderRadius: 8 },
  editButtonText: { color: "#2563eb", fontWeight: "600", fontSize: 14 },
  editActions: { flexDirection: "row", gap: 8 },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#f3f4f6", borderRadius: 8 },
  cancelButtonText: { color: "#6b7280", fontWeight: "600", fontSize: 14 },
  saveButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#2563eb", borderRadius: 8 },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  textarea: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, fontSize: 15, minHeight: 100, textAlignVertical: "top" },
  updatesText: { fontSize: 15, color: "#374151", lineHeight: 22 },
  updatesPlaceholder: { fontSize: 15, color: "#9ca3af", fontStyle: "italic" },
  icuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  icuButton: { width: "47%", borderRadius: 12, borderWidth: 2, overflow: "hidden", backgroundColor: "#fff" },
  icuButtonBar: { height: 4 },
  icuButtonContent: { padding: 12 },
  icuButtonLabel: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  icuButtonDesc: { fontSize: 12, color: "#6b7280", lineHeight: 16 },
  linkList: { gap: 10, marginTop: 4 },
  linkCard: { borderRadius: 12, borderWidth: 2, borderColor: "#e5e7eb", borderLeftWidth: 4, backgroundColor: "#fff", padding: 14 },
  linkCardContent: {},
  linkCardLabel: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  linkCardDesc: { fontSize: 13, color: "#6b7280", marginBottom: 6 },
  linkCardCta: { fontSize: 13, fontWeight: "600" },
  calendarContainer: { height: 400, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#e5e7eb", marginTop: 4 },
  webview: { flex: 1 },
  calendarPlaceholder: { height: 80, backgroundColor: "#f3f4f6", borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 4 },
  calendarPlaceholderText: { color: "#6b7280", fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  modalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "80%", gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  modalInput: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, fontSize: 16 },
  modalError: { color: "#dc2626", fontSize: 13 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 4 },
});
