import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const CORRECT_PASSWORD = "UCRCCM";

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Feather name="lock" size={32} color="#2563eb" />
        </View>
        <Text style={styles.title}>UCR - Clinical Reference Tools</Text>
        <Text style={styles.subtitle}>
          This site is password protected. Please enter the password to continue.
        </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError("");
          }}
          placeholder="Enter password"
          placeholderTextColor="#6b7280"
          secureTextEntry
          autoFocus
          onSubmitEditing={handleSubmit}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Unlock</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconWrap: {
    alignSelf: "center",
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    padding: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 18,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    marginBottom: 8,
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
});
