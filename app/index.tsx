import { useEffect, useState } from "react";
import {
  Linking,
  Modal,
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
import { Feather, Ionicons } from "@expo/vector-icons";
import Footer from "../components/Footer";

const PASSCODE = "UCR123";
const STORAGE_KEY = "programUpdates";

const COLORS: Record<string, string> = {
  red: "#dc2626",
  amber: "#d97706",
  emerald: "#059669",
  purple: "#9333ea",
  blue: "#2563eb",
  rose: "#e11d48",
};

const ICU_LINKS = [
  {
    label: "Code Blue",
    description: "ACLS algorithms & code blue protocols",
    icon: "heart" as const,
    iconSet: "feather" as const,
    color: "red",
    route: "/acls" as const,
  },
  {
    label: "Intubation Checklist",
    description: "Pre-intubation checklist & RSI guide",
    icon: "wind" as const,
    iconSet: "feather" as const,
    color: "amber",
    route: "/intubation" as const,
  },
  {
    label: "On Call",
    description: "SBMC call schedule & contact list",
    icon: "phone" as const,
    iconSet: "feather" as const,
    color: "emerald",
    url: "https://schedule.tigerconnect.com/telecom/DignityHealthSBMC_92404.html",
  },
  {
    label: "SBMC Codes",
    description: "Door & room access codes",
    icon: "lock" as const,
    iconSet: "feather" as const,
    color: "purple",
    route: "/sbmc-codes" as const,
  },
];

const GME_LINKS = [
  {
    label: "Conference Schedule",
    description: "Join the program conference via Microsoft Teams",
    cta: "Join Meeting",
    icon: "calendar" as const,
    iconSet: "feather" as const,
    color: "blue",
    url: "https://teams.microsoft.com/l/meetup-join/19%3aeybMTf_FQxXegy4o04z0QC0tE7GXbAG7ecMxjjSsYRo1%40thread.tacv2/1718913000600?context=%7b%22Tid%22%3a%227564fc97-f117-40a5-8272-b2c1a981a517%22%2c%22Oid%22%3a%224dc2d3f4-73d5-40cc-9b94-b626ff0706b8%22%7d",
  },
  {
    label: "Night Float Schedule",
    description: "View the CCM night float schedule spreadsheet",
    cta: "View Schedule",
    icon: "file-text" as const,
    iconSet: "feather" as const,
    color: "emerald",
    url: "https://medsch2.sharepoint.com/:x:/r/sites/CriticalCareFellowshipProgram/Shared%20Documents/General/Program%20Resources/CCM%20Night%20Float.xlsx?d=w5c169861739540c1a939b4d969a9fbc0&csf=1&web=1&e=WVOefO",
  },
  {
    label: "Medhub Hours",
    description: "Track your duty hours and training progress",
    cta: "View Hours",
    icon: "clock" as const,
    iconSet: "feather" as const,
    color: "purple",
    url: "https://ucrsom.medhub.com/functions/apps/mobile/dutyhours.mh",
  },
  {
    label: "Vacation Request",
    description: "Must be submitted at least two months in advance",
    cta: "Request Vacation",
    icon: "airplane" as const,
    iconSet: "ionicons" as const,
    color: "rose",
    url: "https://ucrsom.medhub.com/u/r/schedule_request.mh",
  },
];

function LinkIcon({
  icon,
  iconSet,
  color,
}: {
  icon: string;
  iconSet: "feather" | "ionicons";
  color: string;
}) {
  if (iconSet === "ionicons") {
    return <Ionicons name={icon as any} size={20} color={color} />;
  }
  return <Feather name={icon as any} size={20} color={color} />;
}

export default function Home() {
  const router = useRouter();
  const [updates, setUpdates] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setUpdates(val);
    });
  }, []);

  const handleEdit = () => {
    setShowPasscodeModal(true);
    setPasscodeError(false);
    setPasscode("");
  };

  const handlePasscodeSubmit = () => {
    if (passcode === PASSCODE) {
      setTempText(updates);
      setIsEditing(true);
      setShowPasscodeModal(false);
      setPasscode("");
    } else {
      setPasscodeError(true);
      setPasscode("");
    }
  };

  const handleSave = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, tempText);
    setUpdates(tempText);
    setIsEditing(false);
  };

  const openLink = (url: string) => Linking.openURL(url);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Program Updates */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Program Updates</Text>
          {!isEditing && (
            <Pressable style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editBlock}>
            <TextInput
              style={styles.textarea}
              multiline
              value={tempText}
              onChangeText={setTempText}
              placeholder="Enter program updates here..."
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.editActions}>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={updates ? styles.updatesText : styles.updatesPlaceholder}>
            {updates || "No updates yet. Tap Edit to add program updates."}
          </Text>
        )}
      </View>

      {/* GME Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>GME Links</Text>
        <View style={styles.linkStack}>
          {GME_LINKS.map((link) => {
            const color = COLORS[link.color];
            return (
              <Pressable
                key={link.label}
                style={({ pressed }) => [
                  styles.linkItem,
                  pressed && { borderColor: color },
                ]}
                onPress={() => openLink(link.url)}
              >
                <View style={styles.linkItemHeader}>
                  <LinkIcon icon={link.icon} iconSet={link.iconSet} color={color} />
                  <Text style={styles.linkItemLabel}>{link.label}</Text>
                </View>
                <Text style={styles.linkItemDesc}>{link.description}</Text>
                <Text style={[styles.linkItemCta, { color }]}>{link.cta} →</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ICU Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ICU Links</Text>
        <View style={styles.linkStack}>
          {ICU_LINKS.map((link) => {
            const color = COLORS[link.color];
            return (
              <Pressable
                key={link.label}
                style={({ pressed }) => [
                  styles.linkItem,
                  pressed && { borderColor: color },
                ]}
                onPress={() => {
                  if (link.route) {
                    router.push(link.route);
                  } else if (link.url) {
                    openLink(link.url);
                  }
                }}
              >
                <View style={styles.linkItemHeader}>
                  <LinkIcon icon={link.icon} iconSet={link.iconSet} color={color} />
                  <Text style={styles.linkItemLabel}>{link.label}</Text>
                </View>
                <Text style={styles.linkItemDesc}>{link.description}</Text>
                <Text style={[styles.linkItemCta, { color }]}>Open →</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Program Calendar</Text>
        {showCalendar ? (
          <View style={styles.calendarContainer}>
            <WebView
              source={{
                uri: "https://calendar.google.com/calendar/embed?src=hf1sh5qpp7ich9b8chcekj5efo%40group.calendar.google.com",
              }}
              style={styles.webview}
            />
          </View>
        ) : (
          <Pressable style={styles.calendarPlaceholder} onPress={() => setShowCalendar(true)}>
            <Feather name="calendar" size={32} color="#9ca3af" />
            <Text style={styles.calendarPlaceholderText}>Tap to show calendar</Text>
          </Pressable>
        )}
      </View>

      <Footer />

      {/* Passcode Modal */}
      <Modal visible={showPasscodeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter Passcode</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry
              value={passcode}
              onChangeText={(t) => {
                setPasscode(t);
                setPasscodeError(false);
              }}
              placeholder="Enter passcode"
              placeholderTextColor="#9ca3af"
              onSubmitEditing={handlePasscodeSubmit}
              autoFocus
            />
            {passcodeError && (
              <Text style={styles.modalError}>Incorrect passcode. Try again.</Text>
            )}
            <View style={styles.modalActions}>
              <Pressable style={styles.modalSubmit} onPress={handlePasscodeSubmit}>
                <Text style={styles.modalSubmitText}>Submit</Text>
              </Pressable>
              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setShowPasscodeModal(false);
                  setPasscode("");
                  setPasscodeError(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  editButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  editBlock: { gap: 12 },
  textarea: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    minHeight: 120,
    textAlignVertical: "top",
  },
  editActions: { flexDirection: "row", gap: 8 },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#16a34a",
    borderRadius: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#9ca3af",
    borderRadius: 8,
  },
  cancelButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  updatesText: { fontSize: 14, color: "#4b5563", lineHeight: 20 },
  updatesPlaceholder: { fontSize: 14, color: "#9ca3af", fontStyle: "italic" },
  linkStack: { gap: 12 },
  linkItem: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
  },
  linkItemHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  linkItemLabel: { fontSize: 15, fontWeight: "700", color: "#111827" },
  linkItemDesc: { fontSize: 13, color: "#4b5563", marginBottom: 4 },
  linkItemCta: { fontSize: 13, fontWeight: "600" },
  calendarContainer: {
    height: 420,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  webview: { flex: 1 },
  calendarPlaceholder: {
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  calendarPlaceholderText: { color: "#6b7280", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: 360,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 16 },
  modalInput: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },
  modalError: { color: "#dc2626", fontSize: 13, marginBottom: 12 },
  modalActions: { flexDirection: "row", gap: 8 },
  modalSubmit: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalSubmitText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  modalCancel: {
    flex: 1,
    backgroundColor: "#9ca3af",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalCancelText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
