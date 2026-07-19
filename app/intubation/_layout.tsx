import { Stack } from "expo-router";
import NavMenu from "../../components/NavMenu";

export default function IntubationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1d4ed8" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => <NavMenu />,
      }}
    />
  );
}
