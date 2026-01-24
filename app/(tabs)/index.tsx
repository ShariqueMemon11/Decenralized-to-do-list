import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyTasks, toggleTask, deleteTask, Task } from "../../services/blockchain";
import { theme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AllTasksTab() {
  const [address, setAddress] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadWalletAddress();
    loadTasks();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setEmail(u?.email ?? null);
    });
    return unsub;
  }, []);

  const loadWalletAddress = async () => {
    const saved = await AsyncStorage.getItem("walletAddress");
    setAddress(saved);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result = await getMyTasks();
      setTasks(result);
    } catch (error: any) {
      console.error("Error loading tasks:", error);
      if (error.message?.includes("MetaMask is not available")) {
        Alert.alert("MetaMask Required", "Please use a web browser with MetaMask installed.");
      } else {
        Alert.alert("Error", "Failed to load tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      setProcessingId(task.id);
      const taskId = parseInt(task.id);
      const tx = await toggleTask(taskId);
      
      Alert.alert("Transaction Sent", "Waiting for confirmation...");
      await tx.wait();
      
      Alert.alert("Success", `Task marked as ${task.completed ? "pending" : "completed"}!`);
      await loadTasks();
    } catch (error: any) {
      console.error("Error toggling task:", error);
      if (error.message?.includes("User rejected")) {
        Alert.alert("Transaction Cancelled", "You rejected the transaction.");
      } else {
        Alert.alert("Error", error.message || "Failed to update task");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const proceed =
      Platform.OS === "web"
        ? typeof window !== "undefined"
          ? window.confirm(`Are you sure you want to delete "${task.text}"?`)
          : false
        : true;

    if (!proceed) return;

    try {
      setProcessingId(task.id);
      const taskId = parseInt(task.id);
      const tx = await deleteTask(taskId);
      Alert.alert("Transaction Sent", "Waiting for confirmation...");
      await tx.wait();
      Alert.alert("Success", "Task deleted successfully!");
      await loadTasks();
    } catch (error: any) {
      console.error("Error deleting task:", error);
      if (error.message?.includes("User rejected")) {
        Alert.alert("Transaction Cancelled", "You rejected the transaction.");
      } else {
        Alert.alert("Error", error.message || "Failed to delete task");
      }
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.watermark} pointerEvents="none">
        <Image source={require("../../assets/images/splashimg.png")} style={styles.watermarkImage} />
      </View>
      <Text style={styles.title}>All Tasks</Text>
      
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color={theme.colors.onPrimary} />
        </View>
        <View>
          {email && <Text style={styles.emailText}>{email}</Text>}
          {address && (
            <Text style={styles.walletText}>Wallet: {address.slice(0, 10)}...{address.slice(-8)}</Text>
          )}
        </View>
      </View>
      
      {address && null}

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.taskBox, item.completed && styles.taskBoxCompleted]}>
              <View style={styles.taskContent}>
                <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                  {item.text}
                </Text>
                <Text style={styles.taskStatus}>
                  {item.completed ? "✓ Completed" : "○ Pending"}
                </Text>
                <Text style={styles.taskDate}>
                  {new Date(Number(item.timestamp) * 1000).toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.taskActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.toggleButton]}
                  onPress={() => handleToggleTask(item)}
                  disabled={processingId === item.id}
                >
                  <Text style={styles.actionButtonText}>
                    {item.completed ? "Undo" : "Complete"}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteTask(item)}
                  disabled={processingId === item.id}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
              
              {processingId === item.id && (
                <ActivityIndicator size="small" style={styles.processingIndicator} />
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks found. Add one to get started!</Text>
          }
          refreshing={loading}
          onRefresh={loadTasks}
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
  addressLabel: {},
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  walletText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  loader: { marginTop: 50 },
  taskBox: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.pending,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  taskBoxCompleted: {
    backgroundColor: theme.colors.completed,
    borderLeftColor: theme.colors.secondary,
  },
  taskContent: {
    flex: 1,
  },
  taskText: { 
    fontSize: theme.fontSize.lg, 
    marginBottom: theme.spacing.xs, 
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
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
  taskActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: theme.colors.accent,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  actionButtonText: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.sm,
  },
  processingIndicator: {
    marginTop: theme.spacing.sm,
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
