import './polyfills'; // Import polyfills FIRST

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLETCONNECT_PROJECT_ID = '8795a532fe887db4cc95fb9fac373566';

// Create a proper storage adapter for WalletConnect v2
// WalletConnect expects string values, not parsed JSON
const createAsyncStorageAdapter = () => {
  return {
    getItem: async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        // Return string or null (WalletConnect handles JSON parsing internally)
        return value;
      } catch (error) {
        console.error('Storage getItem error:', error);
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        // WalletConnect passes string values, store as-is
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('Storage setItem error:', error);
      }
    },
    removeItem: async (key) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('Storage removeItem error:', error);
      }
    },
    getKeys: async () => {
      try {
        return await AsyncStorage.getAllKeys();
      } catch (error) {
        console.error('Storage getKeys error:', error);
        return [];
      }
    },
  };
};

let web3WalletInstance = null;

export default function WalletConnectionScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

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

    return () => {
      sub?.remove();
    };
  }, []);

  const initializeWalletConnect = async () => {
    // Prevent duplicate initialization
    if (web3WalletInstance) {
      console.log('✅ WalletConnect already initialized');
      return;
    }
    
    try {
      console.log('🚀 Starting WalletConnect initialization...');

      const storageAdapter = createAsyncStorageAdapter();
      
      const core = new Core({
        projectId: WALLETCONNECT_PROJECT_ID,
        storage: storageAdapter,
      });

      console.log('✅ Core initialized');

      web3WalletInstance = await Web3Wallet.init({
        core,
        metadata: {
          name: 'D-Todo',
          description: 'Decentralized To-Do List',
          url: 'https://d-todo.app',
          icons: ['https://walletconnect.com/walletconnect-logo.svg'],
        },
      });

      console.log('✅ Web3Wallet initialized');

      // Set up event listeners
      web3WalletInstance.on('session_proposal', onSessionProposal);
      web3WalletInstance.on('session_delete', onSessionDelete);

      // Check for existing active sessions (session restoration)
      const activeSessions = web3WalletInstance.getActiveSessions();
      console.log('📋 Active sessions found:', Object.keys(activeSessions).length);

      if (Object.keys(activeSessions).length > 0) {
        // Restore the first active session
        const session = Object.values(activeSessions)[0];
        const accounts = session.namespaces?.eip155?.accounts || [];
        
        if (accounts.length > 0) {
          const walletAddress = accounts[0].split(':')[2];
          console.log('✅ Restored session with address:', walletAddress);
          
          setAddress(walletAddress);
          setIsConnected(true);
          setInitializing(false);
          
          // Auto-navigate to tabs since wallet is already connected
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 500);
          return;
        }
      }

      setInitializing(false);
      console.log('✅ WalletConnect is ready!');

    } catch (err) {
      console.error('❌ WalletConnect init error:', err);
      console.error('Error details:', err.message);
      console.error('Full error:', err);
      
      setInitializing(false);

      // Don't show alert on first initialization failure - just log it
      // User can retry by pressing the connect button
      console.log('⚠️ WalletConnect initialization failed, but user can still try to connect');
      
      // Reset initialized flag so user can retry
      initialized.current = false;
    }
  };

  const onSessionProposal = async (proposal) => {
    try {
      console.log('📱 Session proposal received');
      const { id, params } = proposal;

      // Get the first account from the proposal
      const proposedChains = params.requiredNamespaces?.eip155?.chains || ['eip155:1'];
      const proposedMethods = params.requiredNamespaces?.eip155?.methods || [
        'eth_sendTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData_v4',
      ];
      const proposedEvents = params.requiredNamespaces?.eip155?.events || [
        'accountsChanged',
        'chainChanged',
      ];

      const session = await web3WalletInstance.approveSession({
        id,
        namespaces: {
          eip155: {
            chains: proposedChains,
            methods: proposedMethods,
            events: proposedEvents,
          },
        },
      });

      console.log('✅ Session approved');

      // Extract the actual wallet address from the session
      if (session?.namespaces?.eip155?.accounts?.[0]) {
        const account = session.namespaces.eip155.accounts[0].split(':')[2];
        setAddress(account);
        setIsConnected(true);
      }

      setLoading(false);
      Alert.alert('Success', 'Wallet connected successfully!');
      
      // Navigate to tabs after a short delay
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);

    } catch (err) {
      console.error('❌ Session approval error:', err);
      setLoading(false);
      Alert.alert('Error', `Failed to connect: ${err.message}`);
    }
  };

  const onSessionDelete = () => {
    console.log('🔌 Session disconnected');
    setIsConnected(false);
    setAddress(null);
    Alert.alert('Disconnected', 'Your wallet has been disconnected');
  };

  const handleDeepLink = ({ url }) => {
    console.log('🔗 Deep link received:', url);
    
    if (!web3WalletInstance) {
      console.log('⚠️ WalletConnect not initialized yet');
      return;
    }

    if (!url?.includes('wc')) {
      console.log('⚠️ Not a WalletConnect deep link');
      return;
    }

    try {
      let uri = url;
      
      // Extract URI from different formats
      if (url.includes('uri=')) {
        uri = decodeURIComponent(url.split('uri=')[1].split('&')[0]);
      } else if (url.includes('wc:')) {
        uri = url.includes('//') ? url.split('//')[1] : url;
      }

      console.log('🔗 Pairing with URI:', uri.substring(0, 50) + '...');
      web3WalletInstance.core.pairing.pair({ uri });
      
    } catch (err) {
      console.error('❌ Deep link error:', err);
      Alert.alert('Connection Error', 'Failed to process the wallet connection link');
    }
  };

  const connectWallet = async () => {
    // If WalletConnect is not initialized, try to initialize it first
    if (!web3WalletInstance) {
      console.log('⚠️ WalletConnect not initialized, attempting to initialize...');
      setLoading(true);
      
      try {
        await initializeWalletConnect();
        
        // Wait a bit for initialization to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!web3WalletInstance) {
          setLoading(false);
          Alert.alert(
            'Initialization Failed',
            'Failed to initialize WalletConnect. Please try again or restart the app.',
            [{ text: 'OK' }]
          );
          return;
        }
      } catch (err) {
        console.error('❌ Retry initialization error:', err);
        setLoading(false);
        Alert.alert(
          'Initialization Error',
          'Failed to initialize WalletConnect. Please restart the app.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    setLoading(true);

    try {
      const { uri, approval } = await web3WalletInstance.core.pairing.create();
      
      console.log('🔗 Connection URI created');

      // Try different wallet apps
      const metamaskUrl = `metamask://wc?uri=${encodeURIComponent(uri)}`;
      const trustWalletUrl = `trust://wc?uri=${encodeURIComponent(uri)}`;
      const universalUrl = `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;

      let opened = false;

      // Try MetaMask
      if (await Linking.canOpenURL('metamask://')) {
        console.log('📱 Opening MetaMask...');
        await Linking.openURL(metamaskUrl);
        opened = true;
      }
      // Try Trust Wallet
      else if (await Linking.canOpenURL('trust://')) {
        console.log('📱 Opening Trust Wallet...');
        await Linking.openURL(trustWalletUrl);
        opened = true;
      }
      // Fallback to universal link
      else {
        console.log('📱 Opening via universal link...');
        await Linking.openURL(universalUrl);
        opened = true;
      }

      if (!opened) {
        setLoading(false);
        Alert.alert(
          'No Wallet Found',
          'Please install MetaMask or Trust Wallet to continue.',
          [
            {
              text: 'Install MetaMask',
              onPress: () =>
                Linking.openURL('https://play.google.com/store/apps/details?id=io.metamask'),
            },
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          ]
        );
      }

      // Set timeout for connection
      setTimeout(() => {
        if (loading) {
          setLoading(false);
          Alert.alert(
            'Connection Timeout',
            'Connection request timed out. Please try again.'
          );
        }
      }, 90000); // 90 seconds

    } catch (err) {
      console.error('❌ Connect error:', err);
      setLoading(false);
      Alert.alert('Error', `Connection failed: ${err.message}`);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/splashimg.png')}
          style={styles.logo}
        />
        <ActivityIndicator size="large" color="#50fa7b" style={styles.loader} />
        <Text style={styles.initText}>Initializing WalletConnect...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splashimg.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Connect Your Wallet</Text>
      <Text style={styles.subtitle}>Connect your wallet to get started</Text>

      {!isConnected ? (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={connectWallet}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#000" size="small" />
              <Text style={[styles.buttonText, styles.loadingText]}>Connecting...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Connect Wallet</Text>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.connectedCard}>
            <Text style={styles.connectedLabel}>Connected Address:</Text>
            <Text style={styles.address}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.buttonText}>Continue to App</Text>
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
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#50fa7b',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    marginLeft: 10,
  },
  connectedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  connectedLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  address: {
    color: '#50fa7b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  initText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
});