import { View, StyleSheet, Pressable, Text } from 'react-native'
import React from 'react'

const LoginScreen = ({onComplete}) => {
  return (
    <View style={styles.container}>
      <Text>login</Text>
      <Pressable onPress={onComplete}>
        <Text>Login</Text>
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
    }
})