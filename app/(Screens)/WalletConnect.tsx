import { View, Text, Button } from "react-native";
import { useSDK } from "@metamask/sdk-react";
import { Redirect } from "expo-router";
import { useState } from "react";

export default function WalletConnectScreen() {
  const { sdk, connected, account } = useSDK();
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      await sdk?.connect();
    } catch (err) {
      console.log("Wallet connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Once connected → GO TO TABS
  if (connected && account) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Connect your wallet to continue
      </Text>

      <Button
        title={loading ? "Connecting..." : "Connect MetaMask"}
        onPress={connectWallet}
        disabled={loading}
      />
    </View>
  );
}
