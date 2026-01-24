import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../constants/theme";

export default function MainScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to tabs immediately
    router.replace("/(tabs)");
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});

