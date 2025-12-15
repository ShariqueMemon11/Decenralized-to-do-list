import { View, StyleSheet, Pressable, Text } from 'react-native'
import React from 'react'
import { connectWallet } from '../../services/wallet'

const LoginScreen = ({ onComplete }) => {

  const handleLogin = async () => {
    try {
      const signer = await connectWallet(); // 🔐 wallet connect
      onComplete(signer);                  // ✅ user logged in
    } catch (err) {
      console.log("Wallet connection failed", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Decentralized To-Do List</Text>
      <Pressable style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Connect Wallet</Text>
      </Pressable>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white'
  },
  title:{
    fontSize:20,
    marginBottom:20,
  },
  btn:{
    backgroundColor:'#5b5bff',
    padding:14,
    borderRadius:8,
  },
  btnText:{
    color:'#fff',
    fontSize:16,
  }
})
