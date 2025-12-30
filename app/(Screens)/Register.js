import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const register = async () => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Optional: Redirect to login after registration
      router.replace('/(Screens)/login');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../assets/images/splashimg.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(Screens)/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5941a9',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 34,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff6161',
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
  },
  link: {
    color: '#1566d5',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});

