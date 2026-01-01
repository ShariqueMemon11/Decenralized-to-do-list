import '../app/polyfills';

import { Stack } from "expo-router";
import { AuthProvider } from "../services/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(Screens)/login" />
        <Stack.Screen name="(Screens)/Register" />
      </Stack>
    </AuthProvider>
  );
}
