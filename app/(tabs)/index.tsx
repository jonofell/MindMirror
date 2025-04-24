
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    DMSerifDisplay_400Regular,
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
          <ThemedText style={styles.greeting}>Good Morning, Jono</ThemedText>
          <HelloWave />
        </View>
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
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 32,
    color: Theme.colors.text,
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
