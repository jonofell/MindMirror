
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

interface Props {
  entries: JournalEntry[];
}

interface MoodStreak {
  mood: string;
  streak: number;
}

export function MoodStreakChart({ entries }: Props) {
  const calculateLongestStreaks = (): MoodStreak[] => {
    if (!entries.length) return [];

    // Group entries by date and mood
    const entriesByDate = entries.reduce((acc, entry) => {
      const date = new Date(entry.timestamp * 1000).toLocaleDateString();
      acc[date] = entry.mood;
      return acc;
    }, {} as { [key: string]: string });

    // Get unique moods
    const uniqueMoods = [...new Set(entries.map(entry => entry.mood))];

    // Calculate longest streak for each mood
    return uniqueMoods.map(mood => {
      let maxStreak = 0;
      let currentStreak = 0;
      let prevDate: Date | null = null;

      Object.entries(entriesByDate)
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .forEach(([dateStr, currentMood]) => {
          const currentDate = new Date(dateStr);

          if (currentMood === mood) {
            if (prevDate) {
              const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
              if (dayDiff === 1) {
                currentStreak++;
              } else {
                currentStreak = 1;
              }
            } else {
              currentStreak = 1;
            }
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
          prevDate = currentDate;
        });

      return {
        mood: mood.split(' ')[0], // Get just the emoji
        streak: maxStreak
      };
    });
  };

  const streaks = calculateLongestStreaks();
  const maxStreak = Math.max(...streaks.map(s => s.streak), 1);

  return (
    <View style={styles.container}>
      {streaks.map((streak, index) => (
        <View key={index} style={styles.streakRow}>
          <View style={styles.labelContainer}>
            <ThemedText style={styles.moodLabel}>{streak.mood}</ThemedText>
          </View>
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { width: `${(streak.streak / maxStreak) * 100}%` }
              ]} 
            />
            <ThemedText style={styles.streakText}>
              {streak.streak} {streak.streak === 1 ? 'day' : 'days'}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  labelContainer: {
    width: 40,
    marginRight: 10,
  },
  moodLabel: {
    fontSize: 20,
  },
  barContainer: {
    flex: 1,
    height: 30,
    backgroundColor: Theme.colors.cardLight,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  bar: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 15,
  },
  streakText: {
    position: 'absolute',
    right: 10,
    top: 5,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
});
