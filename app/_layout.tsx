import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1d4ed8' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#f1f5f9' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'UCR CCM Fellowship' }} />
      <Stack.Screen name="acls" options={{ title: 'ACLS' }} />
      <Stack.Screen name="intubation/index" options={{ title: 'Intubation' }} />
      <Stack.Screen
        name="intubation/checklist"
        options={{ title: 'RSI Checklist' }}
      />
      <Stack.Screen name="sbmc-codes" options={{ title: 'SBMC Codes' }} />
    </Stack>
  );
}
