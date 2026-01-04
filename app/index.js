import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import SplashScreen from "./(Screens)/SplashScreen";
import { useAuth } from "../services/AuthContext";

export default function Index() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  if (!user) {
    return <Redirect href="/(Screens)/login" />;
  }

  // 🔑 LOGGED IN → WALLET CONNECT
  return <Redirect href="/(Screens)/WalletConnect" />;
}
