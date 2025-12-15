import { ethers } from "ethers";
import TaskContractABI from '../abi/TaskContract.json'

const CONTRACT_ADDRESS = "0x9E6a32c3a6320710B24c026Ee1A58F3472EB88F1";

// This function returns a contract instance
export const getContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    TaskContractABI,
    signer
  );
};
