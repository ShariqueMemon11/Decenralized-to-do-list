import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { addTask } from "../../services/blockchain";
import { useRouter } from "expo-router";
import { theme } from "../../constants/theme";

export default function AddTask() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddTask = async () => {
    if (!task.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }

    try {
      setLoading(true);
      Alert.alert("Transaction Sent", "Waiting for confirmation...");
      
      await addTask(task);
      
      Alert.alert("Success", "Task added to blockchain!");
      setTask("");
      router.back();
    } catch (error: any) {
      console.error("Error adding task:", error);
      if (error.message?.includes("MetaMask is not available")) {
        Alert.alert("MetaMask Required", "Please use a web browser with MetaMask installed.");
      } else if (error.message?.includes("User rejected")) {
        Alert.alert("Transaction Cancelled", "You rejected the transaction.");
      } else {
        Alert.alert("Error", error.message || "Failed to add task");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>

      <TextInput
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddTask} disabled={!task.trim()}>
          <Text style={styles.buttonText}>Save to Blockchain</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: theme.spacing.xl, 
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  title: { 
    fontSize: theme.fontSize.title, 
    fontWeight: theme.fontWeight.bold, 
    marginBottom: theme.spacing.xl, 
    textAlign: "center",
    color: theme.colors.text,
  },
  input: { 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    padding: theme.spacing.md, 
    borderRadius: theme.borderRadius.md, 
    marginBottom: theme.spacing.xl,
    fontSize: theme.fontSize.lg,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  button: { 
    backgroundColor: theme.colors.primary, 
    paddingVertical: theme.spacing.xxl, 
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignSelf: "center",
    width: "100%",
  },
  buttonText: { 
    color: theme.colors.background, 
    textAlign: "center", 
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.xl,
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
});
