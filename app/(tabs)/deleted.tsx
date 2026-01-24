import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeletedTasks, Task } from "../../services/blockchain";
import { theme } from "../../constants/theme";

export default function DeletedTasksScreen() {
  const [address, setAddress] = useState<string | null>(null);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadWalletAddress();
    loadDeletedTasks();
  }, []);

  const loadWalletAddress = async () => {
    const saved = await AsyncStorage.getItem("walletAddress");
    setAddress(saved);
  };

  const loadDeletedTasks = async () => {
    try {
      setLoading(true);
      const result = await getDeletedTasks();
      setDeletedTasks(result);
    } catch (error: any) {
      console.error("Error loading deleted tasks:", error);
      if (error.message?.includes("MetaMask is not available")) {
        Alert.alert("MetaMask Required", "Please use a web browser with MetaMask installed.");
      } else {
        Alert.alert("Error", "Failed to load deleted tasks. Please try again.");
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
      <Text style={styles.title}>Deleted Tasks History</Text>
      
      {address && (
        <Text style={styles.addressLabel}>Wallet: {address.slice(0, 10)}...{address.slice(-8)}</Text>
      )}

      <Text style={styles.subtitle}>
        View your deleted tasks history. These tasks are permanently removed from your active list.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={deletedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskBox}>
              <View style={styles.taskContent}>
                <Text style={styles.taskText}>{item.text}</Text>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskStatus}>
                    {item.completed ? "✓ Was Completed" : "○ Was Pending"}
                  </Text>
                  <Text style={styles.taskDate}>
                    Deleted: {new Date(Number(item.timestamp) * 1000).toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.deletedBadge}>
                <Text style={styles.deletedBadgeText}>🗑️</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No deleted tasks yet. Deleted tasks will appear here for history.
            </Text>
          }
          refreshing={loading}
          onRefresh={loadDeletedTasks}
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
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 18,
  },
  loader: { marginTop: 50 },
  taskBox: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "#FFF3E0",
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
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
    color: theme.colors.textSecondary,
    textDecorationLine: "line-through",
  },
  taskInfo: {
    marginTop: theme.spacing.xs,
  },
  taskStatus: { 
    fontSize: theme.fontSize.sm, 
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  taskDate: { 
    fontSize: theme.fontSize.xs, 
    color: theme.colors.textLight,
  },
  deletedBadge: {
    width: 35,
    height: 35,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
  },
  deletedBadgeText: {
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

