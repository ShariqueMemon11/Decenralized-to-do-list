import { ethers } from "ethers";
import TaskContractABI from "../abi/TaskContract.json";

const CONTRACT_ADDRESS = "0x9E6a32c3a6320710B24c026Ee1A5853472EB88F1";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    TaskContractABI,
    signer
  );
};
