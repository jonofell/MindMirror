
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

interface Props {
  entries: JournalEntry[];
}

export function MoodAnalysis({ entries }: Props) {
  const analyzeMoodPatterns = () => {
    if (!entries.length) return null;

    const weekdayMoods: { [key: string]: string[] } = {
      'Sunday': [], 'Monday': [], 'Tuesday': [], 
      'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': []
    };

    entries.forEach(entry => {
      const day = new Date(entry.timestamp * 1000).toLocaleDateString('en-US', { weekday: 'long' });
      if (entry.mood) {
        weekdayMoods[day].push(entry.mood);
      }
    });

    // Find the most common mood for each day
    const patterns = Object.entries(weekdayMoods).reduce((acc, [day, moods]) => {
      if (moods.length === 0) return acc;
      const commonMood = moods.sort((a,b) =>
        moods.filter(v => v === a).length - moods.filter(v => v === b).length
      ).pop();
      return { ...acc, [day]: commonMood };
    }, {});

    return patterns;
  };

  const patterns = analyzeMoodPatterns();

  if (!patterns) return null;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Weekly Patterns</ThemedText>
      {Object.entries(patterns).map(([day, mood]) => (
        <View key={day} style={styles.patternRow}>
          <ThemedText style={styles.day}>{day}</ThemedText>
          <ThemedText style={styles.mood}>{mood?.split(' ')[0]}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.cardLight,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  day: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  mood: {
    fontSize: 20,
  }
});
