import '@walletconnect/react-native-compat';
import 'react-native-get-random-values';

import { Stack } from 'expo-router';
import { AuthProvider } from '../services/AuthContext';
import { WagmiConfig } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'viem/chains';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal
} from '@web3modal/wagmi-react-native';

const projectId = '8795a532fe887db4cc95fb9fac373566'; // ✅ REAL ID

const chains = [mainnet, polygon, arbitrum];

const metadata = {
  name: 'D-Todo',
  description: 'Decentralized To-Do List',
  url: 'https://yourwebsite.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'todolist://',
    universal: 'https://yourwebsite.com',
  },
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true,
});

export default function RootLayout() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(Screens)/login" />
          <Stack.Screen name="(Screens)/Register" />
        </Stack>
      </AuthProvider>
      <Web3Modal />
    </WagmiConfig>
  );
}
