import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { W3mButton } from '@web3modal/wagmi-react-native';
import { useAccount } from 'wagmi';

export default function WalletConnectionScreen() {
  const { address, isConnected } = useAccount();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splashimg.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Connect Your Wallet</Text>
      <Text style={styles.subtitle}>Connect your wallet to get started</Text>
      <W3mButton label={isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"} />
      {isConnected && (
        <Text style={styles.address}>{address}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3b2b55', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 220, height: 220, marginBottom: 20 },
  title: { fontSize: 26, color: '#fff', marginBottom: 10, fontWeight: 'bold', textAlign: 'center', },
  subtitle: { fontSize: 14, color: '#ccc', marginBottom: 40, textAlign: 'center', },
  address: { color: '#50fa7b', fontSize: 18, fontWeight: 'bold', marginTop: 32, textAlign: 'center' }
});