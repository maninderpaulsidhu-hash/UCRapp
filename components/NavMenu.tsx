import { useState } from "react";
import { Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const LINKS = [
  { href: "/acls" as const, label: "ACLS" },
  { href: "/intubation" as const, label: "Intubation" },
  {
    href: "https://schedule.tigerconnect.com/telecom/DignityHealthSBMC_92404.html",
    label: "Call List",
    external: true,
  },
];

export default function NavMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handlePress = (link: (typeof LINKS)[number]) => {
    setOpen(false);
    if (link.external) {
      Linking.openURL(link.href);
    } else {
      router.push(link.href);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={10}
        style={styles.trigger}
        accessibilityLabel="Toggle menu"
      >
        <Feather name="menu" size={22} color="#fff" />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            {LINKS.map((link) => (
              <Pressable
                key={link.label}
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                onPress={() => handlePress(link)}
              >
                <Text style={styles.itemText}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  dropdown: {
    position: "absolute",
    top: 56,
    right: 12,
    width: 192,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemPressed: {
    backgroundColor: "#f9fafb",
  },
  itemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});
