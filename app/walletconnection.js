import 'react-native-get-random-values';
import 'fast-text-encoding';

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLETCONNECT_PROJECT_ID = '8795a532fe887db4cc95fb9fac373566';

let web3WalletInstance = null;

export default function WalletConnectionScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeWalletConnect();
    }

    const sub = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub?.remove();
  }, []);

  // ✅ CORRECT INITIALIZATION
  const initializeWalletConnect = async () => {
    try {
      const core = new Core({
        projectId: WALLETCONNECT_PROJECT_ID,
        storage: AsyncStorage,
      });

      web3WalletInstance = await Web3Wallet.init({
        core,
        metadata: {
          name: 'D-Todo',
          description: 'Decentralized To-Do List',
          url: 'https://example.com',
          icons: ['https://walletconnect.com/walletconnect-logo.svg'],
        },
      });

      web3WalletInstance.on('session_proposal', onSessionProposal);
      web3WalletInstance.on('session_delete', onSessionDelete);

    } catch (err) {
      console.error('WalletConnect init error:', err);
      Alert.alert(
        'Error',
        'Failed to initialize WalletConnect. Please restart the app.'
      );
    }
  };

  const onSessionProposal = async (proposal) => {
    try {
      const { id, params } = proposal;

      const session = await web3WalletInstance.approveSession({
        id,
        namespaces: {
          eip155: {
            chains: ['eip155:1'],
            methods: [
              'eth_sendTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData_v4',
            ],
            events: ['accountsChanged', 'chainChanged'],
          },
        },
      });

      const account =
        session.namespaces.eip155.accounts[0].split(':')[2];

      setAddress(account);
      setIsConnected(true);
      setLoading(false);

      Alert.alert('Success', 'Wallet connected');
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Approve error:', err);
      setLoading(false);
      Alert.alert('Error', 'Wallet connection failed');
    }
  };

  const onSessionDelete = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const handleDeepLink = ({ url }) => {
    if (!web3WalletInstance || !url?.includes('wc')) return;

    try {
      const uri = url.includes('uri=')
        ? decodeURIComponent(url.split('uri=')[1])
        : url;

      web3WalletInstance.core.pairing.pair({ uri });
    } catch (err) {
      console.error('Deep link error:', err);
    }
  };

  const connectWallet = async () => {
    if (!web3WalletInstance) {
      Alert.alert('Error', 'WalletConnect not ready');
      return;
    }

    setLoading(true);

    try {
      const { uri } = await web3WalletInstance.core.pairing.create();

      const metamaskUrl = `metamask://wc?uri=${encodeURIComponent(uri)}`;
      const universalUrl = `https://walletconnect.com/wc?uri=${encodeURIComponent(
        uri
      )}`;

      if (await Linking.canOpenURL('metamask://')) {
        await Linking.openURL(metamaskUrl);
      } else {
        await Linking.openURL(universalUrl);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      Alert.alert('Error', 'Could not connect wallet');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splashimg.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Connect Wallet</Text>

      {!isConnected ? (
        <TouchableOpacity
          style={styles.button}
          onPress={connectWallet}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.address}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b2b55',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#50fa7b',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
});
