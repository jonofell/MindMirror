import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { signIn, signUp } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleAuth = async () => {
    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) throw error;
      if (!isLogin) {
        setRegistrationSuccess(true);
        setEmail('');
        setPassword('');
        setIsLogin(true);
        return;
      }
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
      {registrationSuccess && (
        <View style={styles.successMessage}>
          <ThemedText style={styles.successText}>Registration successful! Please log in.</ThemedText>
        </View>
      )}
      <View style={styles.formContainer}>
        <ThemedText style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <ThemedText style={styles.buttonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => setIsLogin(!isLogin)}
        >
          <ThemedText style={styles.switchText}>
            {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  successMessage: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  successText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
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
    color: Theme.colors.primary,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
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
  switchButton: {
    marginTop: 15,
  },
  switchText: {
    color: Theme.colors.primary,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});