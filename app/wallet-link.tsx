import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export default function WalletLink() {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onContinue = async () => {
    const trimmed = address.trim();
    if (!ETH_ADDRESS_REGEX.test(trimmed)) {
      Alert.alert("Invalid Address", "Please enter a valid Ethereum address.");
      return;
    }
    try {
      setLoading(true);
      await AsyncStorage.setItem("walletAddress", trimmed);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link Your Wallet</Text>
      <Text style={styles.subtitle}>
        Open MetaMask, copy your wallet address and paste it below to continue.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="0x..."
        autoCapitalize="none"
        value={address}
        onChangeText={setAddress}
      />
      <Button title={loading ? "Saving..." : "Continue"} onPress={onContinue} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});

