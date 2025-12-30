import { View, StyleSheet, StatusBar, Image } from 'react-native'
import React from 'react'

const SplashScreen = () => {

    return (
        <View style={styles.container}>
            <Image
              style={styles.img}
              source={require('../assets/images/splashimg.png')}
              resizeMode="contain"
            />
            <StatusBar barStyle="dark-content"/>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#3b2b55'
    },
    img:{
        width: '80%',
        height: '80%'
    }
})