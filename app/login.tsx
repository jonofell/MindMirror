
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { signIn } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <ThemedText style={styles.title}>Welcome Back</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
});
