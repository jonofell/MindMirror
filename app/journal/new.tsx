
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

export default function NewJournalEntry() {
  const router = useRouter();
  const [entry, setEntry] = useState('');

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
      
      // Navigate back to journal screen and trigger refresh
      router.replace('/journal');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
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
          <ThemedText style={styles.buttonText}>Save Entry</ThemedText>
        </TouchableOpacity>
      </View>
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
});
