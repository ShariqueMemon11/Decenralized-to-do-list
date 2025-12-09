import { Stack } from 'expo-router';
import { useState } from 'react';
import 'react-native-reanimated'; 
import  SplashScreen  from '../app/(Screens)/SplashScreen';
import  LoginScreen from '../app/(Screens)/login'

export default function RootLayout() {
  
  const [showSplashscreen, setSplashscreen] = useState(true)
  const [showLoginscreen, setLoginscreen] = useState(true)

  return (
    showSplashscreen ? (
      <SplashScreen Oncomplete={() => setSplashscreen(false)} />
    ): showLoginscreen ? 
    ( 
      <LoginScreen onComplete={() => setLoginscreen(false)}/>
    ):
    <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}


