import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

export default function JournalScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('journal_entries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/journal/new')}
        >
          <ThemedText style={styles.buttonText}>Write New Entry</ThemedText>
        </TouchableOpacity>

        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <ThemedText style={styles.entryText}>{entry.content}</ThemedText>
            <ThemedText style={styles.entryDate}>
              {new Date(entry.timestamp).toLocaleDateString()}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginVertical: Theme.spacing.xl,
    ...Theme.shadows.soft,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.soft,
  },
  entryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  entryDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Theme.colors.textLight,
  },
});