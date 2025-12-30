import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import TaskContractABI from '../abi/TaskContract.json';

const WALLETCONNECT_PROJECT_ID = '8795a532fe887db4cc95fb9fac373566';
const CONTRACT_ADDRESS = "0x9E6a32c3a6320710B24c026Ee1A5853472EB88F1";
const REDIRECT_SCHEME = 'todolist://';

let web3WalletInstance = null;

export default function WalletConnectionScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const initializationRef = useRef(false);

  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      initializeWalletConnect();
    }
    
    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const initializeWalletConnect = async () => {
    try {
      const core = new Core({
        projectId: WALLETCONNECT_PROJECT_ID,
        metadata: {
          name: 'To-Do List DApp',
          description: 'Decentralized To-Do List Application',
          url: 'https://todolist.app',
          icons: ['https://walletconnect.com/walletconnect-logo.svg'],
        },
      });

      web3WalletInstance = await Web3Wallet.init({
        core,
        metadata: {
          name: 'To-Do List DApp',
          description: 'Decentralized To-Do List Application',
          url: 'https://todolist.app',
          icons: ['https://walletconnect.com/walletconnect-logo.svg'],
        },
      });

      // Set up event listeners
      web3WalletInstance.on('session_proposal', handleSessionProposal);
      web3WalletInstance.on('session_delete', handleSessionDelete);

      // Check for existing sessions
      const sessions = web3WalletInstance.getActiveSessions();
      if (Object.keys(sessions).length > 0) {
        const session = Object.values(sessions)[0];
        const accounts = session.namespaces.eip155?.accounts || [];
        if (accounts.length > 0) {
          const walletAddress = accounts[0].split(':')[2];
          setAddress(walletAddress);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('WalletConnect initialization error:', error);
      Alert.alert('Error', 'Failed to initialize WalletConnect. Please restart the app.');
    }
  };

  const handleSessionProposal = async (proposal) => {
    try {
      const { id, params } = proposal;
      const { requiredNamespaces } = params;
      
      // Build namespaces for approval
      const namespaces = {
        eip155: {
          chains: requiredNamespaces.eip155?.chains || ['eip155:1'],
          methods: requiredNamespaces.eip155?.methods || [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
            'eth_signTypedData_v4',
          ],
          events: requiredNamespaces.eip155?.events || ['chainChanged', 'accountsChanged'],
        },
      };

      // Approve the session
      const session = await web3WalletInstance.approveSession({
        id,
        namespaces,
      });

      // Extract address from approved session
      const accounts = session.namespaces.eip155?.accounts || [];
      if (accounts.length > 0) {
        const walletAddress = accounts[0].split(':')[2];
        setAddress(walletAddress);
        setIsConnected(true);
        setLoading(false);
        Alert.alert('Success', 'Wallet connected successfully!');
        
        // Navigate to main app after short delay
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
      }
    } catch (error) {
      console.error('Session proposal error:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to approve wallet connection');
    }
  };

  const handleSessionDelete = () => {
    setIsConnected(false);
    setAddress(null);
    setLoading(false);
  };

  const handleDeepLink = ({ url }) => {
    console.log('Deep link received:', url);
    
    if (!web3WalletInstance) {
      // If WalletConnect not initialized yet, wait a bit and try again
      setTimeout(() => handleDeepLink({ url }), 1000);
      return;
    }

    if (url && url.includes('wc:')) {
      try {
        // Extract URI from deep link
        const uri = url.includes('wc?uri=') 
          ? decodeURIComponent(url.split('wc?uri=')[1])
          : url;
        
        // Pair with the wallet
        web3WalletInstance.core.pairing.pair({ uri });
      } catch (error) {
        console.error('Deep link pairing error:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!web3WalletInstance) {
      Alert.alert('Error', 'WalletConnect not initialized. Please restart the app.');
      return;
    }

    if (isConnected) {
      Alert.alert('Already Connected', 'Wallet is already connected.');
      return;
    }

    setLoading(true);
    try {
      // Create a pairing URI
      const { uri } = await web3WalletInstance.core.pairing.create();
      
      if (!uri) {
        throw new Error('Failed to create pairing URI');
      }

      // Create universal link for WalletConnect
      const universalLink = `https://walletconnect.com/wc?uri=${encodeURIComponent(uri)}`;
      
      // Try to open MetaMask directly first
      const metamaskDeepLink = `metamask://wc?uri=${encodeURIComponent(uri)}`;
      
      try {
        const canOpenMetaMask = await Linking.canOpenURL('metamask://');
        if (canOpenMetaMask) {
          await Linking.openURL(metamaskDeepLink);
          Alert.alert(
            'Opening MetaMask',
            'Please approve the connection in MetaMask.',
            [{ text: 'OK' }]
          );
          return;
        }
      } catch (error) {
        console.log('MetaMask not available, using universal link');
      }

      // Fallback to WalletConnect universal link (shows wallet picker)
      try {
        const canOpen = await Linking.canOpenURL(universalLink);
        if (canOpen) {
          await Linking.openURL(universalLink);
          Alert.alert(
            'Connect Wallet',
            'Please select your wallet and approve the connection.',
            [{ text: 'OK' }]
          );
        } else {
          // If can't open URL, show the URI for manual entry (fallback)
          Alert.alert(
            'Connection URI',
            `Copy this URI and paste it in your wallet:\n\n${uri.substring(0, 50)}...`,
            [{ text: 'OK' }]
          );
          setLoading(false);
        }
      } catch (error) {
        console.error('Error opening universal link:', error);
        Alert.alert('Error', 'Failed to open wallet. Please make sure you have a wallet app installed.');
        setLoading(false);
      }

      // Timeout after 60 seconds
      setTimeout(() => {
        if (loading && !isConnected) {
          setLoading(false);
          Alert.alert(
            'Connection Timeout',
            'Connection timed out. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }, 60000);

    } catch (error) {
      console.error('Connection error:', error);
      setLoading(false);
      Alert.alert(
        'Connection Error',
        'Failed to initiate wallet connection. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const disconnectWallet = async () => {
    if (!web3WalletInstance) return;
    
    try {
      const sessions = web3WalletInstance.getActiveSessions();
      for (const [topic] of Object.entries(sessions)) {
        await web3WalletInstance.disconnectSession({
          topic,
          reason: {
            code: 6000,
            message: 'User disconnected',
          },
        });
      }
      setIsConnected(false);
      setAddress(null);
      Alert.alert('Success', 'Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
      Alert.alert('Error', 'Failed to disconnect wallet');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splashimg.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Connect Your Wallet</Text>
      
      {!isConnected ? (
        <View style={styles.connectContainer}>
          <Text style={styles.instructionText}>
            Connect your wallet to use the decentralized to-do list
          </Text>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={connectWallet}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </Text>
          </TouchableOpacity>
          {loading && (
            <Text style={styles.hintText}>
              Please approve the connection in your wallet app{'\n'}
              (MetaMask, Trust Wallet, etc.)
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Wallet Connected ✅
          </Text>
          <Text style={styles.addressText}>
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.disconnectButton]}
            onPress={disconnectWallet}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.buttonText}>Continue to App</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b2b55',
    padding: 24,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: -70,
    marginTop: -150,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 32,
    fontWeight: 'bold',
  },
  connectContainer: {
    alignItems: 'center',
    width: '100%',
  },
  instructionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#50fa7b',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  connectedContainer: {
    alignItems: 'center',
    width: '100%',
  },
  connectedText: {
    color: '#50fa7b',
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  addressText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 24,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  disconnectButton: {
    backgroundColor: '#ff5555',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#50fa7b',
  },
});
