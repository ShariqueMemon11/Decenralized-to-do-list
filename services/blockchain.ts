import { ethers } from "ethers";
import TaskContract from "../abi/TaskContract.json";

// ⚠️ IMPORTANT: Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0x6F1CEe1aC630bA394928612a28Bab7ac4D29FbAe";

// Check if we're in a browser environment with MetaMask
const isBrowser = typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined";

export const getContract = async () => {
  if (!isBrowser) {
    throw new Error("MetaMask is not available. Please use a web browser with MetaMask installed.");
  }
  const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, TaskContract as any, signer);
  return contract;
};

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  deleted: boolean;
  timestamp: string;
}

// Helper function to convert blockchain task to Task interface
export const formatTask = (task: any): Task => {
  return {
    id: task.id.toString(),
    text: task.text,
    completed: task.completed,
    deleted: task.deleted,
    timestamp: task.timestamp.toString(),
  };
};

// Add a new task
export const addTask = async (text: string) => {
  const contract = await getContract();
  const tx = await contract.addTask(text);
  await tx.wait();
  return tx;
};

// Toggle task completion status
export const toggleTask = async (taskId: number) => {
  const contract = await getContract();
  const tx = await contract.toggleTask(taskId);
  await tx.wait();
  return tx;
};

// Delete a task (soft delete)
export const deleteTask = async (taskId: number) => {
  const contract = await getContract();
  const tx = await contract.deleteTask(taskId);
  await tx.wait();
  return tx;
};

// Get all non-deleted tasks
export const getMyTasks = async (): Promise<Task[]> => {
  const contract = await getContract();
  const result = await contract.getMyTasks();
  return result.map(formatTask);
};

// Get deleted tasks (history)
export const getDeletedTasks = async (): Promise<Task[]> => {
  const contract = await getContract();
  const result = await contract.getDeletedTasks();
  return result.map(formatTask);
};

