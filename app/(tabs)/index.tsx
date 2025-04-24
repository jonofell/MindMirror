
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.greeting}>Good {getTimeOfDay()}</ThemedText>
          <HelloWave />
        </View>
        <ThemedText style={styles.subtitle}>Welcome to MindMirror, your personal journaling companion.</ThemedText>
      </View>
      
      <View style={styles.statsContainer}>
        <ThemedText style={styles.statsText}>You've written 0 entries</ThemedText>
        <ThemedText style={styles.statsSubtext}>Start your journaling journey today!</ThemedText>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/journal')}
      >
        <ThemedText style={styles.buttonText}>Start Journaling</ThemedText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  header: {
    marginTop: Theme.spacing.xl * 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  greeting: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
  statsContainer: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.xl * 2,
    alignItems: 'center',
  },
  statsText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Theme.colors.text,
  },
  statsSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Theme.colors.textLight,
    marginTop: Theme.spacing.sm,
  },
  button: {
    position: 'absolute',
    bottom: Theme.spacing.xl * 2,
    left: Theme.spacing.lg,
    right: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
