
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

export default function HomeScreen() {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.greeting}>Good Morning,{'\n'}Jono</ThemedText>
        </View>
        <ThemedText style={styles.subtitle}>Let's tune in. What's on your mind?</ThemedText>
      </View>

      <TouchableOpacity style={styles.mainButton}>
        <LinearGradient
          colors={['#FFB6A9', '#B5C6E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}>
          <View style={styles.buttonContent}>
            <ThemedText style={styles.mainButtonText}>✍️ Start journaling</ThemedText>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.secondaryButtonsContainer}>
        <TouchableOpacity style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>🕯️ Set intention</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>🎙️ Talk to a Coach</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.entryCard}>
        <ThemedText style={styles.entryTitle}>April 12th Entry</ThemedText>
        <ThemedText style={styles.entryText}>Felt a bit better today 😊</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    marginTop: '15%',
  },
  titleContainer: {
    marginBottom: 10,
  },
  greeting: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 40,
    background: 'linear-gradient(45deg, #FF9190, #B5C6E0)',
    backgroundClip: 'text',
    color: '#FF9190',
    lineHeight: 48,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: '#2D3142',
    marginTop: 10,
  },
  mainButton: {
    marginTop: 30,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#2D3142',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  entryCard: {
    marginTop: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  entryTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2D3142',
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#2D3142',
  },
});
