import 'react-native-get-random-values';
import { ethers } from "ethers";
import EthereumProvider from "@walletconnect/ethereum-provider";

let provider;

export const connectWallet = async () => {
  provider = await EthereumProvider.init({
    projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
    chains: [80002], // Polygon Amoy
    showQrModal: false, // IMPORTANT for mobile
    methods: ["eth_sendTransaction", "personal_sign"],
    events: ["chainChanged", "accountsChanged"],
  });

  await provider.connect();

  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();

  return signer;
};

