
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

export default function JournalScreen() {
  const router = useRouter();
  const [entry, setEntry] = useState('');
  const [lastEntry, setLastEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadLastEntry();
  }, []);

  const loadLastEntry = async () => {
    try {
      const entries = await AsyncStorage.getItem('journal_entries');
      if (entries) {
        const parsedEntries: JournalEntry[] = JSON.parse(entries);
        if (parsedEntries.length > 0) {
          setLastEntry(parsedEntries[0]);
        }
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const saveEntry = async () => {
    if (!entry.trim()) return;

    try {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: entry,
        timestamp: Date.now(),
      };

      const existingEntries = await AsyncStorage.getItem('journal_entries');
      const entries: JournalEntry[] = existingEntries 
        ? JSON.parse(existingEntries)
        : [];

      entries.unshift(newEntry);
      await AsyncStorage.setItem('journal_entries', JSON.stringify(entries));
      
      setEntry('');
      setLastEntry(newEntry);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <TextInput
          style={styles.input}
          value={entry}
          onChangeText={setEntry}
          placeholder="What's on your mind?"
          multiline
          placeholderTextColor={Theme.colors.textLight}
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={saveEntry}
        >
          <ThemedText style={styles.buttonText}>Submit Entry</ThemedText>
        </TouchableOpacity>

        {lastEntry && (
          <View style={styles.lastEntryCard}>
            <ThemedText style={styles.lastEntryTitle}>Last Entry</ThemedText>
            <ThemedText style={styles.lastEntryText}>{lastEntry.content}</ThemedText>
            <ThemedText style={styles.lastEntryDate}>
              {new Date(lastEntry.timestamp).toLocaleDateString()}
            </ThemedText>
          </View>
        )}
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
  input: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    minHeight: 200,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Theme.colors.text,
    ...Theme.shadows.soft,
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
  lastEntryCard: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.soft,
  },
  lastEntryTitle: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 24,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  lastEntryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  lastEntryDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Theme.colors.textLight,
  },
});
