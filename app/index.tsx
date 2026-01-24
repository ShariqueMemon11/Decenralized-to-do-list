import { InteractionManager } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import SplashScreen from "./(Screens)/SplashScreen";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      router.replace("/(auth)/login");
    });
  }, []);

  return (
    <SplashScreen />
  );
}
