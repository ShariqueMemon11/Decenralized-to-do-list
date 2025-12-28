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
    }, 3000); // 2 sec splash

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  // 🔐 AUTH FLOW
  return user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(Screens)/login" />
  );
}
