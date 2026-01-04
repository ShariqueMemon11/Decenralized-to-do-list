import { ethers } from 'ethers';
import TaskABI from '../abi/TaskContract.json';
import { getMetaMaskProvider } from './metamask';

const CONTRACT_ADDRESS = '0x9E6a32c3a6320710B24c026Ee1A5853472EB88F1';

export const getContract = async () => {
  const providerInstance = await getMetaMaskProvider();

  // Create ethers provider (React Native compatible)
  const provider = new ethers.BrowserProvider(providerInstance);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    TaskABI,
    signer
  );
};

export const addTask = async (taskText) => {
  const contract = await getContract();
  const tx = await contract.addTask(taskText);
  await tx.wait();
};

export const getTasks = async () => {
  const contract = await getContract();
  return await contract.getMyTasks();
};
