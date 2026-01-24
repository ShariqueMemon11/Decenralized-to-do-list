import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyTasks, Task } from "../../services/blockchain";
import { theme } from "../../constants/theme";

export default function CompletedTasksScreen() {
  const [address, setAddress] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadWalletAddress();
    loadCompletedTasks();
  }, []);

  const loadWalletAddress = async () => {
    const saved = await AsyncStorage.getItem("walletAddress");
    setAddress(saved);
  };

  const loadCompletedTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await getMyTasks();
      // Filter only completed tasks
      const completed = allTasks.filter((task) => task.completed === true);
      setCompletedTasks(completed);
    } catch (error: any) {
      console.error("Error loading completed tasks:", error);
      if (error.message?.includes("MetaMask is not available")) {
        Alert.alert("MetaMask Required", "Please use a web browser with MetaMask installed.");
      } else {
        Alert.alert("Error", "Failed to load completed tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.watermark} pointerEvents="none">
        <Image source={require("../../assets/images/splashimg.png")} style={styles.watermarkImage} />
      </View>
      <Text style={styles.title}>Completed Tasks</Text>
      
      {address && (
        <Text style={styles.addressLabel}>Wallet: {address.slice(0, 10)}...{address.slice(-8)}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskBox}>
              <View style={styles.taskContent}>
                <Text style={styles.taskText}>{item.text}</Text>
                <Text style={styles.taskDate}>
                  Completed: {new Date(Number(item.timestamp) * 1000).toLocaleString()}
                </Text>
              </View>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No completed tasks yet. Complete some tasks to see them here!</Text>
          }
          refreshing={loading}
          onRefresh={loadCompletedTasks}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  title: { 
    fontSize: theme.fontSize.xxl, 
    fontWeight: theme.fontWeight.bold, 
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  addressLabel: { 
    fontSize: theme.fontSize.sm, 
    color: theme.colors.textSecondary, 
    marginBottom: theme.spacing.lg,
  },
  loader: { marginTop: 50 },
  taskBox: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.completed,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
    flexDirection: "row",
    alignItems: "center",
  },
  taskContent: {
    flex: 1,
  },
  taskText: { 
    fontSize: theme.fontSize.lg, 
    marginBottom: theme.spacing.xs, 
    fontWeight: theme.fontWeight.medium,
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  taskDate: { 
    fontSize: theme.fontSize.xs, 
    color: theme.colors.textLight,
  },
  completedBadge: {
    width: 30,
    height: 30,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  completedBadgeText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.lg,
  },
  emptyText: { 
    textAlign: "center", 
    marginTop: 50, 
    fontSize: theme.fontSize.lg, 
    color: theme.colors.textLight,
  },
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkImage: {
    width: 240,
    height: 240,
    opacity: 0.08,
    borderRadius: 120, // Half of width/height to make it a circle
  },
});

