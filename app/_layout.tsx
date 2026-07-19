import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PasscodeGate from "../components/PasscodeGate";
import NavMenu from "../components/NavMenu";

export default function RootLayout() {
  return (
    <PasscodeGate>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1d4ed8" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#f9fafb" },
          headerRight: () => <NavMenu />,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Chat/Tab Fellows" }} />
      </Stack>
    </PasscodeGate>
  );
}
