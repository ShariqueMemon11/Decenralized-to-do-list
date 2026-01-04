import "../polyfills";
import { Stack } from "expo-router";
import { AuthProvider } from "../services/AuthContext";
import { MetaMaskProvider } from "@metamask/sdk-react";

export default function RootLayout() {
  return (
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: "D-Todo",
          url: "todolist://"
        }
      }}
    >
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(Screens)/login" />
          <Stack.Screen name="(Screens)/Register" />
        </Stack>
      </AuthProvider>
    </MetaMaskProvider>
  );
}
