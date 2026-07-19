import { StyleSheet, Text, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        For educational reference only. Not a substitute for clinical judgment or infectious
        disease consultation.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  text: {
    textAlign: "center",
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 16,
  },
});
