import "react-native-get-random-values";
import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../services/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
