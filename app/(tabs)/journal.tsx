
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { Collapsible } from '@/components/Collapsible';
import { JournalEntry } from '@/types/journal';
import { Theme } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function JournalScreen() {
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
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.title}>Journal Entries</ThemedText>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <ThemedText style={styles.entryDate}>
              {new Date(entry.timestamp).toLocaleDateString()}
            </ThemedText>
            {entry.content.split('\n\n').map((section, index) => {
              const parts = section.split('\n');
              const prompt = parts[0] || '';
              const response = parts.slice(1).join('\n') || '';
              return prompt && response ? (
                <Collapsible key={index} title={prompt}>
                  <ThemedText style={styles.entryContent}>{response}</ThemedText>
                </Collapsible>
              ) : null;
            })}
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 60,
    marginBottom: 20,
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryDate: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.textLight,
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
  },
});
