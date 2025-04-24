
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
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
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    loadEntryCount();
  }, []);

  const loadEntryCount = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('journal_entries');
      if (storedEntries) {
        const entries = JSON.parse(storedEntries);
        setEntryCount(entries.length);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

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
        <ThemedText style={styles.statsText}>You've written {entryCount} entries</ThemedText>
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
    padding: '5%',
    paddingTop: '8%',
    paddingBottom: '15%',
  },
  header: {
    marginTop: '5%',
    paddingHorizontal: '4%',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    width: '100%',
  },
  greeting: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Platform.OS === 'ios' ? '7vw' : 32,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: Platform.OS === 'ios' ? '4vw' : 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '3%',
    paddingHorizontal: '5%',
  },
  statsContainer: {
    backgroundColor: Theme.colors.card,
    padding: '5%',
    borderRadius: Theme.borderRadius.md,
    marginTop: '10%',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  statsText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: Platform.OS === 'ios' ? '4.5vw' : 18,
    color: Theme.colors.text,
  },
  statsSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: Platform.OS === 'ios' ? '3.5vw' : 14,
    color: Theme.colors.textLight,
    marginTop: '2%',
  },
  button: {
    position: 'absolute',
    bottom: '8%',
    left: '5%',
    right: '5%',
    backgroundColor: Theme.colors.primary,
    padding: '4%',
    borderRadius: Theme.borderRadius.md,
    marginBottom: '4%',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: Platform.OS === 'ios' ? '4.5vw' : 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
